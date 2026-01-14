import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userSchemas } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(userSchemas.singUp),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(userSchemas.singIn),
    authController.singIn,
);

export { router as authRouter };
