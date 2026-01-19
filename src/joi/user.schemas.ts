import Joi from "joi";

import { joiHelpers } from "./helper.joi";

const { name, age, email, password } = {
    name: Joi.string().min(3),
    age: Joi.number().integer().min(0),
    email: Joi.string().email(),
    password: Joi.string().min(4),
};

const { strictRequired, strict } = joiHelpers;

const signUp = strictRequired({
    name,
    age,
    email,
    password,
});

const signIn = strictRequired({
    email,
    password,
});

const update = strict({
    name,
    age,
    email,
    password,
}).min(1);

const forgotPasswordSend = strictRequired({
    email,
});

const forgotPasswordSet = strictRequired({
    password,
    token: Joi.string().min(1),
});

const verifyAccount = strictRequired({
    token: Joi.string().min(1),
});

const changePassword = strictRequired({
    oldPassword: password,
    newPassword: password,
});

export const userSchemas = {
    signUp,
    signIn,
    update,
    forgotPasswordSend,
    forgotPasswordSet,
    verifyAccount,
    changePassword,
};
