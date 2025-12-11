import cors from 'cors'

export const corsMiddleware = cors({
    origin: ['http://192.168.10.10', 'http://localhost:5173', 'http://192.168.18.29', 'http://localhost:3001'],
    credentials: true
})