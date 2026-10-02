import express from "express";
import { connectRedis } from "./services/redis.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { startRuleWorker } from "./workers/ruleWorker.js";


const app = express();

app.use(express.json());
app.use(rateLimiter);

app.get("/api/products", (req, res) => {
    res.json({
        message: "Products returned"
    });
});

async function start() {
    await connectRedis();
    startRuleWorker();

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

start();