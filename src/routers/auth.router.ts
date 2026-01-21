import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userSchemas } from "../joi/user.schemas";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.isBodyValid(userSchemas.signUp),
    authController.signUp,
);
router.post(
    "/sign-in",
    commonMiddleware.isBodyValid(userSchemas.signIn),
    authController.singIn,
);
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refreshToken,
);
router.post(
    "/logout",
    authMiddleware.checkLogoutRefreshToken,
    authController.logout,
);
router.post(
    "/logout-all",
    authMiddleware.checkAccessToken,
    authController.logoutAll,
);

router.post(
    "/forgot-password",
    commonMiddleware.isBodyValid(userSchemas.forgotPasswordSend),
    authController.forgotPasswordSend,
);
router.put(
    "/forgot-password",
    authMiddleware.checkForgotPasswordActionToken,
    commonMiddleware.isBodyValid(userSchemas.forgotPasswordSet),
    authController.forgotPasswordSet,
);

router.post(
    "/verify-account",
    authMiddleware.checkVerifyAccountToken,
    authController.verifyAccount,
);

router.post(
    "/change-password",
    authMiddleware.checkAccessToken,
    commonMiddleware.isBodyValid(userSchemas.changePassword),
    authController.changePassword,
);

export { router as authRouter };
