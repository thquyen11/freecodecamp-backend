import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { logger } from "../server";



export const registerNewUser =async (req: Request, res: Response, db:any) => {
    try { 
    const { userName, userPassword } = req.body;
    const rowCount:number=await db.count('*').from('USERS').where({ USER_NAME: userName }).then((data:any)=> data[0].count);
    logger.info(rowCount);

    if(rowCount>0){
        logger.info("user existed in database");
        res.status(400).send("user existed in database")
    }else{
        const saltRounds:number = 10;
        bcrypt.hash(userPassword, saltRounds, (err, hashedPassword)=>{
            if(err){
                logger.info(err);
                res.status(500).end();
            }

            db('USERS').insert({
                USER_NAME: userName,
                USER_PASSWORD: hashedPassword,
            }).then((data)=>logger.info(data))
         
            res.status(200).json(userName+" inserted");
        })
    }
    } catch(err){
        logger.error(err);
        res.status(500).end();
    }
}

export const addNewExercise=(req: Request, res: Response, db:any)=>{
    const { userId, description, duration, date } = req.body;
    try{
        db('EXERCISES').insert({
            DESCRIPTION: description,
            DURATION: duration,
            DATE: new Date(date),
            USER_ID: userId
        }).then((data:any)=>logger.info(data))

        logger.info(description+ " inserted ok");
        res.status(200).send(description+" has been added");
    } catch(error){
        logger.error(error);
        res.status(500).end();
    }
}


