import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userSchemas } from "../joi/user.schemas";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

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

router.get(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    userController.getById,
);

export { router as userRouter };
