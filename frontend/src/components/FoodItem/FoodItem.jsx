import  { useContext} from "react";
import PropTypes from "prop-types";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets.js";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const {cartItems,addToCart,removeFromCart}=useContext(StoreContext); 
 const url = "http://localhost:4000"; // or your backend URL
  console.log("Image prop:", image); 
  return (
    <div className="food-item">
      <div className="food-item-img-container">
      
      {/* <img src={image} alt={name} className="food-item-image" /> */}
      <img src={`${url}/uploads/${image}`} alt={name} className="food-item-image" />

        {!cartItems?.[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};
FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
   image: PropTypes.string.isRequired,
};


export default FoodItem;
