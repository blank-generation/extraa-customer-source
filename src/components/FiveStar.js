import { Rating, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incremented } from "../store/store";

function FiveStar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fading, setFading] = useState(true);
  const [rating, setRating] = useState(0);
  const [disablePointer, setDisablePointer] = useState(false);
  const pageIndex = useSelector((state) => state.pageIndex);

  function increment(option, qIndex) {
    navigate("");
    setDisablePointer(true);

    setTimeout(() => dispatch(incremented()), 600);
    setTimeout(() => setFading(false), 400);
    setTimeout(() => setFading(true), 600);
    setTimeout(() => setDisablePointer(false), 600);
    props.initSubmitObj();
  }
  return (
    <Fade in={fading}>
      <div className="fiveStar">
        <Rating
          style={{ pointerEvents: disablePointer ? "none" : "auto" }}
          name="star-rating"
          size="large"
          value={props.rating}
          onChange={(event, newValue) => {
            if (newValue > 0) {
              initSubmitObj(newValue);
              setDisablePointer(true);
            }
            setRating(newValue);
            if (newValue > 0) {
              setTimeout(() => increment(), 600);
              setTimeout(() => setDisablePointer(false), 600);
            }
          }}
        />
      </div>
    </Fade>
  );
}

export default FiveStar;
