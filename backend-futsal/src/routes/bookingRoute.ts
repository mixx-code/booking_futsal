import express from "express";
import { createBooking } from "../controllers/booking/createBooking";
import { updateBooking } from "../controllers/booking/editBooking";
import { cancelBooking } from "../controllers/booking/cancelBooking";
import { getAllBookings } from "../controllers/booking/getAllBookings";
import { getBookingById } from "../controllers/booking/getBookingById";


const router = express.Router();

router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getBookingById);
router.post("/create-booking", createBooking);
router.put("/bookings/:id", updateBooking);
router.patch("/bookings/:id/cancel", cancelBooking);

export default router