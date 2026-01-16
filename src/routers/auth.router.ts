import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userSchemas } from "../joi/schemas";
import { authMiddleware } from "../middlewares/auth.middleware";
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
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refreshToken,
);
router.post("/logout", authController.logout);
router.post(
    "/logout-all",
    authMiddleware.checkAccessToken,
    authController.logoutAll,
);

export { router as authRouter };
