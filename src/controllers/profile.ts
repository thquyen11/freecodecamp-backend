import { Request, Response } from "express";
import { logger } from "../server";

export const getUserExerciseLog = async (req:Request, res:Response, db:any)=>{
    try {const userId:number = req.query.userId;
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;
    logger.info(userId);

    const result:any = await db.select('USERS.USER_NAME', 'EXERCISES.DESCRIPTION').from('USERS').where({ USER_ID: userId })
        .leftJoin('EXERCISES', 'USERS.REFERENCE', '=', 'EXERCISES.USER_ID')
        .then((result:any)=> {
            logger.info(result);
            return result;
        })
    
    res.status(200).json({
        userName: result[0].USER_NAME,
        exercise: result[0].DESCRIPTION,
    })
    } catch(err){
        logger.error(err);
    }
}

export const handleProfileGet=(req:Request, res:Response, db:any, userId:number)=>{
    console.log('userId '+userId);
    db.select('USER_NAME').from('USERS').where({ REFERENCE: userId})
        .then((user:any)=>{
            console.log(user[0].USER_NAME);
            return res.status(200).json({ sucess: 'true', userId: userId, userName: user[0].USER_NAME })
        })
        .catch((err:any)=> console.log(err))
}