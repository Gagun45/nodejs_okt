import Joi from "joi";

import { OrderEnum } from "../enums/order.enum";
import { UserListOrderByEnum } from "../enums/user-list-order.enum";
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
    newPassword: password,
});

const changePassword = strictRequired({
    oldPassword: password,
    newPassword: password,
});

const listQuery = Joi.object({
    limit: Joi.number().min(1).max(100).default(10),
    page: Joi.number().min(1).default(1),
    search: Joi.string().trim().lowercase(),
    order: Joi.string().valid(...Object.values(OrderEnum)),
    orderBy: Joi.string().valid(...Object.values(UserListOrderByEnum)),
});

export const userSchemas = {
    signUp,
    signIn,
    update,
    forgotPasswordSend,
    forgotPasswordSet,
    changePassword,
    listQuery,
};
