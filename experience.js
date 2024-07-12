import { fetchUserData } from './query.js'
let xpSum = 0;
const data = await fetchUserData();

// Create a map for quick lookup by path
const progressMap = new Map(data.progresses.map(item => [item.path, item.createdAt]));

// Add createdAt to the corresponding xps items
data.xps.forEach(xp => {
    xpSum += xp.amount;
    if (progressMap.has(xp.path)) {
        xp.createdAt = progressMap.get(xp.path);
    }
});

console.log(Math.round(xpSum / 1000) + ' Kb')