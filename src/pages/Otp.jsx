import { Button, Stack, Fade } from "@mui/material";
import { useState, useEffect } from "react";
import OtpInput from "react18-otp-input";
import { ChevronRightRounded } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import axios from "axios";

function Otp() {
  const [resetCounter, SetResetCounter] = useState(0);
  const [otpError, SetOtpError] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpValid, SetOtpValid] = useState(false);
  const pathURL = process.env.REACT_APP_ENDPOINT;
  const navigate = useNavigate();
  const location = useLocation();

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Button variant="text" onClick={resendOTP}>
          Resend
        </Button>
      );
    } else {
      // Render a countdown
      return <span>Resend in... {seconds}</span>;
    }
  };

  function handleOtpChange(val) {
    setOtp(val);
    SetOtpError(false);
    if (/^\d{4}$/.test(val)) {
      SetOtpValid(true);
    } else {
      SetOtpValid(false);
    }
  }

  const resendOTP = () => {
    let rc = resetCounter;
    rc += 1;
    SetResetCounter(rc);
    const otpData = new FormData();
    otpData.append("phone_number", location.state.phone_number);
    axios
      .post(pathURL + "/check-login", otpData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function CheckOTP(otp) {
    const formData = new FormData();
    formData.append("phone_number", location.state.phone_number);
    formData.append("login_otp", otp);

    axios.post(pathURL + "/verify-otp", formData).then(
      (response) => {
        console.log(response.data);
        let res = response.data;
        // let d = new Date();
        // d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));

        if (res.MESSAGE.success === "true") {
          if (res.MESSAGE.parameters.access_token) {
            localStorage.setItem("token", res.MESSAGE.parameters.access_token);
          }
          if (res.MESSAGE.parameters.phone_number) {
            localStorage.setItem(
              "phone_number",
              res.MESSAGE.parameters.phone_number
            );
          }

          if (res.MESSAGE.parameters.gender) {
            localStorage.setItem("user_name", res.MESSAGE.parameters.user_name);

            navigate("/user-home");
          } else {
            navigate("/user-signup");
          }
        } else {
          SetOtpError(true);
        }
      },
      (error) => {
        console.log(error);
        SetOtpError(true);
      }
    );
  }

  return (
    <div className={otpError ? "otp-container wrong" : "otp-container"}>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <img
          src="./assets/extraa_logo.png"
          alt=""
          className="home-logo"
          style={{
            width: "200px",
          }}
        />

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
        {otpError && <p className="otpText"> OTP does not match!</p>}

        <Button
          disabled={!otpValid}
          onClick={() => CheckOTP(otp)}
          endIcon={<ChevronRightRounded />}
          className="p-btn"
          size="large"
        >
          Login
        </Button>

        <div className="otp-resend" style={{ marginTop: "2em" }}>
          <span>Didn't receive it?</span>
          <Countdown
            date={Date.now() + 25000}
            key={resetCounter}
            renderer={renderer}
          />
        </div>
      </Stack>
    </div>
  );
}

export default Otp;
