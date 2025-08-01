import  { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  console.log("Food List:", food_list);
  return (
            
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
      {food_list
      .filter(
  item =>
    category?.toLowerCase() === "all" ||
    category?.toLowerCase() === item.category?.toLowerCase()
)
  .map((item, index) => (
    <FoodItem
      key={index}
      id={item._id}
      name={item.name}
      description={item.description}
      price={item.price}
      image={item.image}
    />
))}

      </div>
    </div>
  );
};

export default FoodDisplay;
