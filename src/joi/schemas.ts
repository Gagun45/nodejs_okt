import Joi from "joi";

export const singUpSchema = Joi.object({
    name: Joi.string().min(3).required(),
    age: Joi.number().integer().min(0).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
}).strict();

export const singInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
}).strict();

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    age: Joi.number().integer().min(0).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(4).optional(),
}).strict();
