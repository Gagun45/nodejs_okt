import { ApiError } from "./errors/api-error";

export const validateNameOrThrow = (name: string) => {
    if (name.length < 4) throw new ApiError("Name validation failed", 400);
};

export const validateAgeOrThrow = (age: number) => {
    if (age < 0) throw new ApiError("Age validation failed", 400);
};

export const parseUserIdOrThrow = (value: string) => {
    const id = Number(value);
    if (Number.isNaN(id)) {
        throw new ApiError("Invalid user id", 400);
    }
    return id;
};
