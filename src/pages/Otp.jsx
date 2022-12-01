import { Button, Stack, Container } from "@mui/material";
import { useState } from "react";
import OtpInput from "react18-otp-input";
import { ChevronRightRounded } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Otp() {
    const [otpError, SetOtpError] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpValid, SetOtpValid] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    function handleOtpChange(val) {
        setOtp(val);
        SetOtpError(false);
        if (/^\d{4}$/.test(val)) {
            SetOtpValid(true);

        } else {
            SetOtpValid(false);
        }
    }

    function CheckOTP(otp) {
        const formData = new FormData();
        formData.append('phone_number', location.state.phone_number);
        formData.append('login_otp', otp);


        axios.post('https://extraa.in/go-api/public/api/verify-otp', formData)
            .then(response => {
                console.log(response.data);
                let res = response.data;
                // let d = new Date();
                // d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));

                if (res.MESSAGE.success === 'true') {


                    if (res.MESSAGE.parameters.access_token) {
                        localStorage.setItem('token', res.MESSAGE.parameters.access_token);
                    }
                    if (res.MESSAGE.parameters.phone_number) {
                        localStorage.setItem('phone_number', res.MESSAGE.parameters.phone_number);
                    }

                    if (res.MESSAGE.parameters.gender) {
                        localStorage.setItem('user_name', res.MESSAGE.parameters.user_name);


                        navigate("/user-home");
                    } else {
                        navigate("/user-signup");
                    }



                } else {
                    SetOtpError(true)
                }

            }, (error) => {
                console.log(error);
                SetOtpError(true)
            })

    }

    return (
        <div className={otpError ? "otp-container wrong" : "otp-container"} >
            <Stack justifyContent={"center"} alignItems={"center"}>

                <img src="./assets/extraa_logo.png" alt="" className="home-logo" style={{
                    width: "200px"
                }} />

                <div className="otp-text" style={{ marginTop: "2em" }}>
                    Please enter your OTP

                </div>

                <OtpInput
                    inputStyle="inputStyle"
                    numInputs={4}
                    onChange={(value) => handleOtpChange(value)}
                    isInputNum={true}
                    shouldAutoFocus
                    value={otp}

                />
                {otpError &&
                    <p className="otpText"> OTP does not match!</p>
                }

                <Button disabled={!otpValid} onClick={() => CheckOTP(otp)} endIcon={<ChevronRightRounded />} className="p-btn" size="large">Login</Button>

                {/* <Fade >
                <div className="otp-resend">
                    <span>Didn't receive it?</span>
                    <Button variant="text" onClick={() => RsendOTP()}>Resend</Button>
                </div>
            </Fade> */}
            </Stack>
        </div>
    )
}

export default Otp