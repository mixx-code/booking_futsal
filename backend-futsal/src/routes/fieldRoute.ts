import express from "express";
import { createField } from "../controllers/field/createField";
import { getAllFields } from "../controllers/field/getAllFields";
import { getFieldById } from "../controllers/field/getFieldById";
import { handleMultipleImagesMiddleware } from "../middlewares/handle-multer";
import { uploadMultipleImagesToMinIO } from "../middlewares/minio-upload";
import { updateField } from "../controllers/field/updateField";
import { deleteField } from "../controllers/field/deleteField";
import { getAvailableSlots } from "../controllers/field/getAvailableSlots";


const router = express.Router();

router.post("/create-field", handleMultipleImagesMiddleware, uploadMultipleImagesToMinIO, createField);
router.put("/update-field/:id", handleMultipleImagesMiddleware, uploadMultipleImagesToMinIO, updateField);
router.get("/get-fields", getAllFields);
router.get("/get-fields/:id", getFieldById);
router.get("/get-available-slots/:id", getAvailableSlots);
router.delete("/delete-field/:id", deleteField);

export default router