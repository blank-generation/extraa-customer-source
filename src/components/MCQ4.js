import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { incremented } from '../store/store';
import { useNavigate } from "react-router-dom";
import { Fade } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

function MCQ4(props, { disable }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fading, setFading] = useState(true);
    const [disablePointer, setDisablePointer] = useState(false);
    const pageIndex = useSelector((state) => state.pageIndex);

    function increment(oIndex, qIndex) {
        navigate('');
        setDisablePointer(true);
        props.SetAnswer(oIndex + 1, qIndex + 1);
        setTimeout(() => dispatch(incremented()), 600);
        setTimeout(() => setFading(false), 400);
        setTimeout(() => setFading(true), 600);
        setTimeout(() => setDisablePointer(false), 600);
    }
    return (
        <Fade in={fading}>
            <div style={{display:"flex",justifyContent:"center"}}>
                <div className={props.questionType == "SCALE5" ? "oplist scale5" : "oplist"} >
                    {props.options ?

                        props.options.map((option, i) => (
                            <Button size='large'
                                style={{ pointerEvents: disablePointer ? 'none' : 'auto' }}
                                key={option+pageIndex}
                                variant='contained'
                                disabled={disable}
                                className="option"
                                onClick={() => increment(i, pageIndex - 1)}
                            >
                                {option}
                            </Button>
                        ))

                        : console.log('no options')}


                    {/* {options.map(option =>(
                <Button variant="contained" key={option} className="option"> {option}</Button>
            ))} */}
                </div>
            </div>
        </Fade>
    );
}

export default MCQ4;