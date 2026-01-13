import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { createUserSchema } from "../joi/schemas";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userIdRouter } from "./userId.router";

const router = Router();

router.get("/", userController.getUsers);
router.post(
    "/",
    commonMiddleware.validateBody(createUserSchema),
    userController.createUser,
);

router.get("/reset", userController.resetUsers);

router.use("/:userId", commonMiddleware.isIdValid("userId"), userIdRouter);

export { router as userRouter };
