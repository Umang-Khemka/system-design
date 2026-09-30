import {Request, Response, NextFunction} from 'express';
import redis from "../services/redis.js";

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'] as string;
    if(!userId){
        return res.status(400).json({
            message: "User ID is not prvided",
        });
    }
    console.log(`Rate limiting check for user: ${userId}`);

    const key = `rate_limit:${userId}`;

    const count = await redis.incr(key);

    if(count == 1){
        await redis.expire(key, 60);
    }

    console.log(`User ${userId} has made ${count} requests in the last minute.`);

    if(count > 5){
        return res.status(429).json({
            message: "Too many requests. Please try again later.",
        });
    }

    next();
}