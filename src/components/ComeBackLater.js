import { Button } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function ComeBackLater() {
    const navigate = useNavigate();
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            height: '70vh',
            alignItems: "center",
            flexDirection: "column",
            paddingRight: '2em',
            paddingLeft: '2em'
        }}>
            <h2 style={{ textAlign: "center" }}> Looks like you've already done this...</h2>

            <img style={{ maxWidth: '120px' }} src="./assets/calendar.png" alt="" />
            <h3 style={{ textAlign: "center" }}>Thanks for your feedback.</h3>
            <div className="powered">powered by
                <img src="./assets/extraa_logo.png" alt="" />
            </div>
            <Button className='y-btn' endIcon={<ChevronRight />} onClick={()=>navigate('/user-home')} fullWidth sx={{marginTop:4}}> View your coupons</Button>
        </div >
    );
}