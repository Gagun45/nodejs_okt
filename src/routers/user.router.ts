import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { updateUserSchema } from "../joi/schemas";
import { tokenMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", tokenMiddleware, userController.getAll);

router.get("/reset", userController.reset);

router.use(commonMiddleware.isIdValid("userId"));

router.get("/:userId", userController.getById);
router.delete("/:userId", userController.delete);
router.patch(
    "/:userId",
    commonMiddleware.validateBody(updateUserSchema),
    userController.update,
);

export { router as userRouter };
