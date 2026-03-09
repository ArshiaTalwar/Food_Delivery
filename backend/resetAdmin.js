import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserModel from "./models/userModel.js"; // adjust if your model is elsewhere

const mongoUrl = "mongodb+srv://Arshia:Zwiggy@cluster0.aiemvo9.mongodb.net/food-del"; // your Atlas URL
const adminEmail = "admin@example.com"; // email of your admin
const newPassword = "admin123"; // new password you want

async function resetAdmin() {
  try {
    // connect to MongoDB
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update admin password (upsert ensures it exists)
    const result = await UserModel.updateOne(
      { email: adminEmail },
      { $set: { password: hashedPassword, role: "admin", name: "Admin" } },
      { upsert: true }
    );

    console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);

    // verify update
    const admin = await UserModel.findOne({ email: adminEmail });
    console.log("Admin in DB:", admin);

    await mongoose.disconnect();
    console.log("Admin password updated successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

resetAdmin();
