import { Request, Response } from 'express';
import * as redis from 'redis';

export const requireAuth=(req:Request, res:Response, next:any)=>{
    console.log('start auth0 process');
    const { authorization } = req.headers;
    const redisClient = redis.createClient(process.env.REDIS_URI);
    if(!authorization){
        console.log('no Authorization in request header');
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(authorization, (err:any, reply:any)=>{
        console.log('token '+authorization);
        if(err || !reply){
            console.log('token not existed in redis db');
            return res.status(401).json('Unauthorized');
        }
        console.log('pass auth0 process');
        return next();
    })
}