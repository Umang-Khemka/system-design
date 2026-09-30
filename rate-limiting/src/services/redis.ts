import { createClient } from "redis";

const redis = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

export async function connectRedis() {
    await redis.connect();
    console.log("Connected to Redis");
}

export default redis;