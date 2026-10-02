type Rule = {
    limit: number;
    windowSeconds: number;
}

class RuleCache {
    private rules = new Map<string, Rule>();

    set(key: string, rule: Rule): void {
        this.rules.set(key, rule);
    }

    get(key: string): Rule | undefined {
        return this.rules.get(key);
    }
}

export default new RuleCache();