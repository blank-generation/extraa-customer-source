import { Button } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import { incremented } from "../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Splash() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const increment = () =>{
        navigate('');
        dispatch(incremented());
    }
    return (
        <div className="splash">
            <div className="splash-content">
                <p> Give your feedback and <br />
                    grab a coupon from us!
                </p>
            </div>
            <div className="gift-container">
                <img src="./assets/gift.png" alt="" />
            </div>
            <div className="btn-container">
            <Button  onClick={increment} variant="contained" endIcon={<ChevronRightRounded/>}>Give Feedback </Button>
            </div>
        </div>
    );
}

export default Splash;

