import { Router } from "express";

import { FileConfig } from "../config/file.config";
import { userController } from "../controllers/user.controller";
import { userSchemas } from "../joi/user.schemas";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";

const router = Router();

router.get("/", userController.getAll);

router.get("/reset", userController.reset);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.patch(
    "/me",
    authMiddleware.checkAccessToken,
    commonMiddleware.validateBody(userSchemas.update),
    userController.updateMe,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);
router.post(
    "/me/avatar/upload",
    authMiddleware.checkAccessToken,
    fileMiddleware.isFileValid(FileConfig.avatar, "avatar"),
    userController.uploadAvatar,
);
router.post(
    "/me/avatar/reset",
    authMiddleware.checkAccessToken,
    userController.resetAvatar,
);

router.get(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    userController.getById,
);

export { router as userRouter };
