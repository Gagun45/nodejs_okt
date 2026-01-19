import { Request } from "express";

export const getBearerToken = (req: Request): string =>
    req.headers.authorization?.split("Bearer ")[1] || "";
