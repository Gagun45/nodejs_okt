import { Request } from "express";

export const getBearerToken = (req: Request): string | undefined =>
    req.headers.authorization?.split("Bearer ")[1];
