import { Button } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { incremented } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Fade, Rating } from "@mui/material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

function MCQ4(props, { disable }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(-1);
  const [shortAns, SetShortAns] = useState("");
  const [fading, setFading] = useState(true);
  const [disablePointer, setDisablePointer] = useState(false);
  const pageIndex = useSelector((state) => state.pageIndex);

  function increment(option, qIndex) {
    props.SetAnswer(option, qIndex + 1);
    navigate("");
    setDisablePointer(true);

    setTimeout(() => dispatch(incremented()), 600);
    setTimeout(() => setFading(false), 400);
    setTimeout(() => setFading(true), 600);
    setTimeout(() => { setDisablePointer(false); SetShortAns("") }, 600)
    props.initSubmitObj();

  }

  const handleShortChange = (event) => {
    const short = event.target.value;
    SetShortAns(short);
    // console.log(userName);
  };

  useEffect(() => {
    // console.log(props.ans)
    if (props.ans[pageIndex - 2 + props.offset] && props.ans[pageIndex - 2 + props.offset].question_type === 'SHORT') {
      SetShortAns(props.ans[pageIndex - 2 + props.offset].answer)
    }
  }, [props, pageIndex]);

  return (
    <Fade in={fading}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className={
            props.questionType === "SCALE5" ? "oplist scale5" : "oplist"
          }
        >
          {props.options
            ? props.options.map((option, i) => (
              <Button
                size="large"
                style={{ pointerEvents: disablePointer ? "none" : "auto" }}
                key={option + pageIndex}
                variant="contained"
                disabled={disable}
                className="option"
                onClick={() =>
                  increment(option, pageIndex - 2 + props.offset)
                }
              >
                {option}
              </Button>
            ))
            : console.log("no options")}
          {props.questionType === "FIVESTAR" && (
            <div>
              <div className="fiveStar">
                <Rating
                  style={{ pointerEvents: disablePointer ? "none" : "auto" }}
                  name="star-rating"
                  size="large"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                    // console.log(newValue, "Star");
                    props.SetAnswer(newValue, pageIndex - 1 + props.offset);
                    props.initSubmitObj();
                  }}
                />
                {rating >= 1 ? (
                  <Fade in>
                    <Button
                      className="p-btn"
                      endIcon={<ChevronRight />}
                      onClick={() => {
                        increment(
                          rating.toString(),
                          pageIndex - 2 + props.offset
                        );
                      }}
                    >
                      Rate
                    </Button>
                  </Fade>
                ) : (
                  <div style={{ height: 51.5 }}></div>
                )}
              </div>
            </div>
          )}

          {props.questionType === "SHORT" && (
            <div>
              <div className="short">
                <ValidatorForm
                  onSubmit={() => console.log("Submit")}
                  onError={(errors) => console.log(errors)}
                >
                  <TextValidator
                    variant="outlined"
                    label="Answer"
                    required
                    sx={{

                      "& .MuiInputBase-root": {
                        backgroundColor: "#ffffff",
                      },
                    }}

                    style={{ marginTop: "1em" }}
                    value={shortAns}
                    onChange={handleShortChange}
                    validators={[
                      "required",

                    ]}
                  >

                  </TextValidator>
                </ValidatorForm>
                {shortAns ? (
                  <Fade in>
                    <Button
                      className="p-btn"
                      type="submit"

                      endIcon={<ChevronRight />}
                      onClick={() => {
                        increment(
                          shortAns.toString(),
                          pageIndex - 2 + props.offset
                        );

                      }}
                    >
                      Next
                    </Button>
                  </Fade>
                ) : (
                  <div style={{ height: 51.5 }}></div>
                )}
              </div>
            </div>
          )}

          {/* {options.map(option =>(
                <Button variant="contained" key={option} className="option"> {option}</Button>
            ))} */}
        </div>
      </div>
    </Fade>
  );
}

export default MCQ4;
