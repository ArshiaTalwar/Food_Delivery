import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});


// User.find()
// .then(data => {
//   console.log("All Users:", data);
// })
// .catch(err => {
//   console.error("Error fetching users:", err);
// });

const port =process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();
// app.listen(4000, () => console.log("Server running on port 4000"));
// api endpoints
app.use("/api/food", foodRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a room based on user ID for personalized notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  
  // Join admin room for admin notifications
  socket.on('joinAdmin', () => {
    socket.join('admin');
    console.log('Admin joined admin room');
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in controllers
app.set('io', io);

server.listen(port, () => {
  console.log(`Server Started on port: ${port}`);
});
