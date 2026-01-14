import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { singInSchema, singUpSchema } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(singUpSchema),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(singInSchema),
    authController.singIn,
);

export { router as authRouter };
