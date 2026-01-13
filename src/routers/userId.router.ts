import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { updateUserSchema } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router({ mergeParams: true });

router.get("/", userController.getUserById);
router.delete("/", userController.deleteUserById);
router.patch(
    "/",
    commonMiddleware.validateBody(updateUserSchema),
    userController.updateUserById,
);

export { router as userIdRouter };
