import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { createUserSchema, updateUserSchema } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";

const router = Router();

router.get("/", userController.getAll);
router.post(
    "/",
    commonMiddleware.validateBody(createUserSchema),
    userController.create,
);

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
