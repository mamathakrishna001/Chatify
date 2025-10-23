import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./libs/db.js"
import { app, server } from "./libs/socket.js";

// Ensure app is configured BEFORE middleware and routes
// app is likely imported from ./libs/socket.js

dotenv.config()
const PORT=process.env.PORT || 5000; // Use 5000 as fallback for local dev

// --- START: CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173", // Local Development
  "https://ping-it-up.vercel.app", // Vercel Frontend Domain
  "https://pingitup-n54z.onrender.com" // Render API Domain (precautionary)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or same-origin requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser())
app.use(cors(corsOptions)); // Apply the updated CORS options
// --- END: CORS Configuration ---

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

server.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
    connectDB()
})
