import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.post("/", userController.createUser);

router.get("/reset", userController.resetUsers);

router.get("/:userId", userController.getUserById);
router.delete("/:userId", userController.deleteUserById);
router.put("/:userId", userController.putUserById);
router.patch("/:userId", userController.patchUserById);

export { router as userRouter };
