import { Paper } from '@mui/material';


function Question(props) {
    return(
        <Paper elevation={1} className="qText">
            {props.question}
        </Paper>
    );
}

export default Question;