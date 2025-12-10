// src/app.ts
import express from 'express';
// import cors from 'cors';
import UserRouter from './routes/userRoute';
import FieldRouter from './routes/fieldRoute';
import BookingRouter from './routes/bookingRoute';
import ScheduleRouter  from './routes/schedulsRoute';
import { corsMiddleware } from './middlewares/cors';
import { initMinIO } from './config/minioClient'
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(corsMiddleware)
app.use(express.json());

initMinIO().then(connected => {
  if (connected) {
    console.log('MinIO ready for file uploads');
  } else {
    console.log('MinIO not available - files will use local storage');
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1/", UserRouter);
app.use("/api/v1/", FieldRouter);
app.use("/api/v1/", BookingRouter);
app.use("/api/v1/", ScheduleRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;