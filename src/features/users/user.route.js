import express from "express";
import * as userController from "./user.controller.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.post("/", userController.createUser);

// router.get("/:id",    userController.getUserById);
// router.put("/:id",    userController.updateUser);
// router.delete("/:id", userController.deleteUser);

export default router;
