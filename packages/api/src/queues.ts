import { Queue } from 'bullmq';

export const automodQueue = new Queue('automod');
export const nsfwQueue = new Queue('nsfw');
export const unmuteQueue = new Queue('unmute');
