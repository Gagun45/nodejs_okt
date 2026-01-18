import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userSchemas } from "../joi/user.schemas";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(userSchemas.signUp),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.validateBody(userSchemas.signIn),
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

router.post(
    "/forgot-password",
    commonMiddleware.validateBody(userSchemas.forgotPasswordSend),
    authController.forgotPasswordSend,
);
router.put(
    "/forgot-password",
    commonMiddleware.validateBody(userSchemas.forgotPasswordSet),
    authController.forgotPasswordSet,
);

router.post(
    "/verify-account",
    commonMiddleware.validateBody(userSchemas.verifyAccount),
    authMiddleware.checkVerifyAccountToken,
    authController.verifyAccount,
);

export { router as authRouter };
