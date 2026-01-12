import { ApiError } from "./errors/api-error";

export const validateNameOrThrow = (name) => {
    if (typeof name !== "string" || name.length < 4)
        throw new ApiError("Name validation failed", 400);
};

export const validateAgeOrThrow = (age) => {
    if (typeof age !== "number" || age < 0)
        throw new ApiError("Age validation failed", 400);
};

export const parseUserIdOrThrow = (value) => {
    const id = Number(value);
    if (Number.isNaN(id)) {
        throw new ApiError("Invalid user id", 400);
    }
    return id;
};
