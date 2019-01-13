import { Request, Response } from "express";
import * as bcrypt from 'bcryptjs';
import { logger } from "../server";
import * as jwt from 'jsonwebtoken';
import * as redis from 'redis';
import { resolve } from "bluebird";


export const handleSignin = (req: Request, res: Response, db: any) => {
    const { userName, userPassword } = req.body;
    if (!userName || !userPassword) {
        return Promise.reject('incorrect form submission');
    }
    console.log(userName + ' ' + userPassword);

    return db.select('*').from('USERS').where({USER_NAME: userName})
        .then((user: any) => {
            console.log('query ' + user[0].USER_NAME);
            const isValid = bcrypt.compareSync(userPassword, user[0].USER_PASSWORD);
            if (isValid) {
                logger.info(user[0].USER_NAME + ': credential valid');
                logger.info('userId '+ user[0].REFERENCE)
                return Promise.resolve({
                    userId: user[0].REFERENCE,
                    userName: user[0].USER_NAME
                });
            } else {
                logger.error('incorrect password');
                Promise.reject('incorrect username or password');
            }
        })
        .catch((err: any) => {
            console.log(err);
            return Promise.reject('user not existed');
        })
}

const redisClient: any = redis.createClient(process.env.REDIS_URI);
const getAuthTokenId = (req: Request, res: Response, db: any) => {
    console.log('getAuthTokenId');
    const { authorization } = req.headers;
    console.log('token '+authorization);
    return redisClient.get(authorization, (err:any, reply:any) => {
        if (err|| !reply) {
            return res.status(400).json('Unauthorized');
        } else{
            return db.select('USER_NAME').from('USERS').where({REFERENCE: reply})
                    .then((user:any)=> res.json({ sucess: 'true', userId: reply, userName: user.USER_NAME }))
                    .catch((err:any)=> console.log(err));
        }
    })
}

//create jwt token
const signToken = (userId: number, userName: string) => {
    console.log('signToken');
    const jwtPayLoad = { userId, userName };
    console.log(userId+' '+userName);
    return jwt.sign(jwtPayLoad, process.env.JWTSECRET, { expiresIn: '1 days' })
}

//save jwt token to Redis
const setToken = (key: any, value: number) => {
    console.log('setToken');
    console.log('key '+key);
    console.log('value '+value);
    return Promise.resolve(redisClient.set(key, value, 'EX', 600)); //this key will expire after 600 seconds
}

const createSessions = (user) => {
    const { userName, userId } = user;
    console.log('createSessions');
    const token: any = signToken(userId, userName);
    console.log('token: '+token);
    return setToken(token, userId)
        .then(() => {
            console.log('token '+token);
            return Promise.resolve({
                sucess: 'true',
                userId: userId,
                token: token
            })
        })
        .catch((err: any) => console.log(err))
}

export const handleSigninAuthentication = (req: Request, res: Response, db: any) => {
    const { authorization } = req.headers;
    return authorization ?
        getAuthTokenId(req, res, db) :
        handleSignin(req, res, db)
            .then((user: any) => {
                logger.info('userName '+user.userName);
                logger.info('userId '+user.userId);
                return user.userName && user.userId ? createSessions(user) : Promise.reject(user);
            })
            .then((session: any) => {
                console.log(session.sucess);
                return res.status(200).json(session);
            })
            .catch((err: any) => res.status(400).json(err));
}

