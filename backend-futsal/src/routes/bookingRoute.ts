import express from "express";
import { createBooking } from "../controllers/booking/createBooking";


const router = express.Router();

router.post("/create-booking", createBooking);

export default router