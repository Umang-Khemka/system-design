import fs from "fs/promises";
import ruleCache from "../services/ruleCache.js";

async function loadRules() {
    try {
        const data = await fs.readFile("./rules.json", "utf-8");
        const rules = JSON.parse(data);

        for(const [key,rule] of Object.entries(rules)) {
            ruleCache.set(key, rule as { limit: number; windowSeconds: number });
        }

        console.log("Rules loaded successfully:", rules);
    } catch (error) {
        console.error("Error loading rules:", error);
    }
}

export function startRuleWorker() {
    loadRules();
    setInterval(loadRules, 10000);
}