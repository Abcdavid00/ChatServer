import { set } from "mongoose";

export default class TimeCache {
    constructor(ttl, maxSize) {
        this.cache = {};
        this.ttl = ttl || 1000 * 60 * 60;
        this.maxSize = maxSize || -1;
        this.interval = setInterval(() => this.cleanOnInterval(), this.ttl);
    }

    set(key, value) {
        this.cache[key] = {
            value,
            timestamp: Date.now()
        };
        this.cleanOnAdd()
    }

    get(key) {
        const cacheItem = this.cache[key];
        if (!cacheItem) {
            return null;
        }
        this.cache[key].timestamp = Date.now();
        return cacheItem.value;
    }

    cleanOnAdd() {
        if (this.maxSize > 0) {
            const keys = Object.keys(this.cache);
            if (keys.length > this.maxSize) {
                const oldestKey = keys.reduce((a, b) => this.cache[a].timestamp < this.cache[b].timestamp ? a : b);
                delete this.cache[oldestKey];
            }
        }
    }

    cleanOnInterval() {
        const now = Date.now();
        Object.keys(this.cache).forEach(key => {
            if (now - this.cache[key].timestamp > this.ttl) {
                delete this.cache[key];
            }
        });
    }

    stop() {
        clearInterval(this.interval);
        this.cache = {};
    }
}