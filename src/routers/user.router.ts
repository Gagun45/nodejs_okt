import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { createUserSchema, updateUserSchema } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getUsers);
router.post(
    "/",
    commonMiddleware.validateBody(createUserSchema),
    userController.createUser,
);

router.get("/reset", userController.resetUsers);

router.get(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    userController.getUserById,
);
router.delete(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    userController.deleteUserById,
);
router.patch(
    "/:userId",
    commonMiddleware.isIdValid("userId"),
    commonMiddleware.validateBody(updateUserSchema),
    userController.updateUserById,
);

export { router as userRouter };
