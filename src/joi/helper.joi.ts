import Joi from "joi";

export const joiHelpers = {
    strict: (schema: Joi.SchemaMap) => Joi.object(schema).strict(),
    required: (schema: Joi.SchemaMap) => {
        const requiredSchema: Joi.SchemaMap = {};
        for (const key in schema) {
            requiredSchema[key] = (schema[key] as Joi.Schema).required();
        }
        return Joi.object(requiredSchema);
    },
    strictRequired: (schema: Joi.SchemaMap) =>
        joiHelpers.required(schema).strict(),
};
