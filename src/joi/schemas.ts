import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().min(3),
    age: Joi.number().integer().min(0),
    email: Joi.string().email(),
    password: Joi.string().min(4),
}).strict();

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    age: Joi.number().integer().min(0).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(4).optional(),
}).strict();
