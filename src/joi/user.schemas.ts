import Joi from "joi";

const userFields = {
    name: Joi.string().min(3),
    age: Joi.number().integer().min(0),
    email: Joi.string().email(),
    password: Joi.string().min(4),
};

const signUp = Joi.object({
    name: userFields.name.required(),
    age: userFields.age.required(),
    email: userFields.email.required(),
    password: userFields.password.required(),
}).strict();

const signIn = Joi.object({
    email: userFields.email.required(),
    password: userFields.password.required(),
}).strict();

const update = Joi.object({
    name: userFields.name.optional(),
    age: userFields.age.optional(),
    email: userFields.email.optional(),
    password: userFields.password.optional(),
}).strict();

const forgotPasswordSend = Joi.object({
    email: userFields.email.required(),
});

const forgotPasswordSet = Joi.object({
    password: userFields.password.required(),
    token: Joi.string().min(1),
});

export const userSchemas = {
    signUp,
    signIn,
    update,
    forgotPasswordSend,
    forgotPasswordSet,
};
