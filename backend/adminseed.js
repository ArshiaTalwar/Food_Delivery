import mongoose from "mongoose";
import UserModel from "./models/userModel.js";
import bcrypt from "bcryptjs";

const oldAdminEmail = "admin@example.com"; // current email
const newAdminEmail = "newadmin@example.com"; // new email
const adminPassword = "admin123"; // password you want
const mongoUrl = "mongodb+srv://Arshia:Zwiggy@cluster0.aiemvo9.mongodb.net/zwiggy";

async function updateAdmin() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const result = await UserModel.updateOne(
      { email: oldAdminEmail }, // find current admin
      {
        $set: {
          email: newAdminEmail,   // update email
          password: hashedPassword,
          role: "admin",
          name: "Admin"
        }
      }
    );

    console.log("Update result:", result);
    await mongoose.disconnect();
    console.log("Admin email/password updated successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

updateAdmin();
