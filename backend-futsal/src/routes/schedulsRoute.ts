// routes/scheduleRoutes.ts
import express from "express";
import { createSchedule } from "../controllers/scheduls/createSchedule ";

const router = express.Router();

// Schedule routes
router.post("/schedules", createSchedule); // POST /schedules (single day)
// router.post('/weekly', createWeeklySchedules);         // POST /schedules/weekly (range of days)
// router.get('/field/:field_id', getSchedulesByField);   // GET /schedules/field/:field_id
// router.put('/:id', updateSchedule);                    // PUT /schedules/:id
// router.delete('/:id', deleteSchedule);                 // DELETE /schedules/:id

export default router;
