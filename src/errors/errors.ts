import { ApiError } from "./api-error";

export const customErrors = {
    notFound: (value: string) => new ApiError(`${value} not found`, 404),
};
