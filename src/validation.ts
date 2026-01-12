export const validateNameOrThrow = (name) => {
    if (typeof name !== "string" || name.length < 4)
        throw new Error("Name validation failed");
};

export const validateAgeOrThrow = (age) => {
    if (typeof age !== "number" || age < 0)
        throw new Error("Age validation failed");
};

export const parseUserIdOrThrow = (value) => {
    const id = Number(value);
    if (Number.isNaN(id)) {
        throw new Error("Invalid user id");
    }
    return id;
};
