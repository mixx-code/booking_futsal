import express from "express";
import { register } from "../controllers/user/register";
import { login } from "../controllers/user/login";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router