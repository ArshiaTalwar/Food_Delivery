import mongoose from "mongoose";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

const password = "admin123"; // Set your admin password here
const mongoUrl = "mongodb+srv://Arshia:Zwiggy@cluster0.aiemvo9.mongodb.net/zwiggy"; // Replace with your connection string

async function createAdmin() {
  await mongoose.connect(mongoUrl);k

  const saltRounds = process.env.SALT ? Number(process.env.SALT) : 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  await UserModel.create({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("Admin created!");
  mongoose.disconnect();
}

createAdmin();