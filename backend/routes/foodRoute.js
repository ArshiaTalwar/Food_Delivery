import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
import FoodModel from "../models/foodModel.js";
const foodRouter = express.Router();

// Image Storage Engine

const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload= multer({storage:storage})
foodRouter.post("/seed", async (req, res) => {
    await FoodModel.deleteMany({});
    await FoodModel.insertMany([
      {
        name: "Burger",
        description: "Tasty beef burger",
        price: 10,
        image: "burger.png", // Put a matching image in uploads
        category: "Sandwich",
      },
      {
        name: "Pasta",
        description: "White sauce pasta",
        price: 12,
        image: "pasta.png",
        category: "Pasta",
      },
    ]);
    res.send({ success: true });
  });
foodRouter.post("/add",upload.single("image"),authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);

export default foodRouter;
