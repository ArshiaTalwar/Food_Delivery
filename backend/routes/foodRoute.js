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
// foodRouter.post("/seed", async (req, res) => {
//     await FoodModel.deleteMany({});
//     await FoodModel.insertMany([
//       {
//          name: "Lasagna Rolls",
//                 image: food_5,
//                 price: 14,
//                 description: "Food provides essential nutrients for overall health and well-being",
//                 category: "Rolls"
//       },
//       {
//         name: "Pasta",
//         description: "White sauce pasta",
//         price: 12,
//         image: "pasta.png",
//         category: "Pasta",
//       },
//        name: "Chicken Rolls",
//               image: food_7,
//               price: 20,
//               description: "Food provides essential nutrients for overall health and well-being",
//               category: "Rolls"
//     ]);
//     res.send({ success: true });
//   });
foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;
