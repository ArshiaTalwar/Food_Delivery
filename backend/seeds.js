// filepath: backend/scripts/seedFoods.js
import mongoose from "mongoose";
import FoodModel from "./models/foodModel.js";

const seedFoods = [
  {
    name: "Peri Peri Rolls",
    image: "1722865934153food_6.png",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Rolls"
  },
  {
    name: "Greek salad",
    image: "food_1.png",
    price: 12,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },
  {
    name: "Veg salad",
    image: "1722865514626food_2.png",
    price: 18,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  },
  {
   
    name: "Clover Salad",
    image: "1722865628915food_3.png",
    price: 16,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
  }, {
    name: "Chicken Salad",
    image: "1722865668073food_4.png",
    price: 24,
    description: "Food provides essential nutrients for overall health and well-being",
    category: "Salad"
      }, {
        
          name: "Lasagna Rolls",
          image: "1751987331229food_5.png",
          price: 14,
          description: "Food provides essential nutrients for overall health and well-being",
          category: "Rolls"
      },
      {
        
          name: "Chicken Rolls",
          image: "1722865976487food_7.png",
          price: 20,
          description: "Food provides essential nutrients for overall health and well-being",
          category: "Rolls"
          }, {
              name: "Veg Rolls",
              image: "1722866043779food_8.png",
              price: 15,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Rolls"
          }, {
          
              name: "Ripple Ice Cream",
              image: "1722866109947food_9.png",
              price: 14,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Deserts"
          }, {
            
              name: "Fruit Ice Cream",
              image: "1722866148130food_10.png",
              price: 22,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Deserts"
          }, 
            {
              name: "Jar Ice Cream",
              image: "1722866329894food_11.png",
              price: 10,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Deserts"
          }, {
              name: "Vanilla Ice Cream",
              image: "1722866385025food_12.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Deserts"
          },
          {
        
              name: "Chicken Sandwich",
              image: "1722866412882food_13.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Sandwich"
          },
          {
              name: "Vegan Sandwich",
              image: "1722866469319food_14.png",
              price: 18,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Sandwich"
          }, {
              name: "Grilled Sandwich",
              image: "1722866504992food_15.png",
              price: 16,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Sandwich"
          }, {
              name: "Bread Sandwich",
              image: "1722866560218food_16.png",
              price: 24,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Sandwich"
          }, {

              name: "Cup Cake",
              image: "1722866610567food_17.png",
              price: 14,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Cake"
          }, {
              name: "Vegan Cake",
              image: "1722866647952food_18.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Cake"
          }, {
             
              name: "Butterscotch Cake",
              image: "1722866694357food_19.png",
              price: 20,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Cake"
          }, {
              name: "Sliced Cake",
              image: "1722866729053food_20.png",
              price: 15,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Cake"
          }, {
             name: "Garlic Mushroom ",
              image: "1722866777756food_21.png",
              price: 14,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pure Veg"
          }, {
         
              name: "Fried Cauliflower",
              image: "1722866830901food_22.png",
              price: 22,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pure Veg"
          }, {
             
              name: "Mix Veg Pulao",
              image: "1722866871307food_23.png",
              price: 10,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pure Veg"
          }, {
             
              name: "Rice Zucchini",
              image: "1722866909328food_24.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pure Veg"
          },
          {
            
              name: "Cheese Pasta",
              image: "1722866948105food_25.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pasta"
          },
          {
           
              name: "Tomato Pasta",
              image: "1722867018540food_26.png",
              price: 18,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pasta"
          }, {
            
              name: "Creamy Pasta",
              image: "1722867053413food_27.png",
              price: 16,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pasta"
          }, {
            
              name: "Chicken Pasta",
              image: "1722867110108food_28.png",
              price: 24,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Pasta"
          }, {
             
              name: "Buttter Noodles",
              image: "1722867144188food_29.png",
              price: 14,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Noodles"
          }, {
              name: "Veg Noodles",
              image: "1722867222977food_30.png",
              price: 12,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Noodles"
          }, {
              name: "Somen Noodles",
              image: "1722867254829food_31.png",
              price: 20,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Noodles"
          }, {
            
              name: "Cooked Noodles",
              image: "1722867630288food_32.png",
              price: 15,
              description: "Food provides essential nutrients for overall health and well-being",
              category: "Noodles"
          }
      ];
      

async function seed() {
  await mongoose.connect("mongodb+srv://Arshia:Zwiggy@cluster0.aiemvo9.mongodb.net/food-del");
  await FoodModel.deleteMany({});
  await FoodModel.insertMany(seedFoods);
  console.log("Seeded foods!");
  mongoose.disconnect();
}

seed();