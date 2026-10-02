import { Request, Response, NextFunction } from "express";
import redis from "../services/redis.js";
import ruleCache from "../services/ruleCache.js";

const rateLimitScript = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
end

return current
`;

export async function rateLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = req.headers["x-user-id"];

    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
            message: "X-User-Id header is required"
        });
    }

    const rule = ruleCache.get("default");

    if (!rule) {
        return res.status(503).json({
            message: "Rate limit rules unavailable"
        });
    }

    const key = `rate-limit:${userId}`;

    const count = await redis.eval(rateLimitScript, {
        keys: [key],
        arguments: [rule.windowSeconds.toString()]
    }) as number;

    console.log("User:", userId);
    console.log("Request count:", count);

    if (count > rule.limit) {
        return res.status(429).json({
            message: "Too many requests"
        });
    }

    next();
}