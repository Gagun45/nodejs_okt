import { Request } from "express";

export const getBearerToken = (req: Request): string =>
    req.headers.authorization?.split("Bearer ")[1] || "";

export const minutesToSeconds = (minutes: string) => Number(minutes) * 60;
export const hoursToSeconds = (hours: string) => Number(hours) * 3600;
