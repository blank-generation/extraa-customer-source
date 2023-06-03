import { Button, Stack, Fade, CircularProgress } from "@mui/material";
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
  const [otpLoading, SetOtpLoading] = useState(false);
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

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      phone_number: location.state.phone_number,
      qr_id: 1,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/get-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // localStorage.setItem("otp_id",response.data.insert_otp.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // function CheckOTP(otp) {
  //   const formData = new FormData();
  //   formData.append("phone_number", location.state.phone_number);
  //   formData.append("login_otp", otp);

  //   axios.post(pathURL + "/verify-otp", formData).then(
  //     (response) => {
  //       console.log(response.data);
  //       let res = response.data;
  //       // let d = new Date();
  //       // d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));

  //       if (res.MESSAGE.success === "true") {
  //         if (res.MESSAGE.parameters.access_token) {
  //           localStorage.setItem("token", res.MESSAGE.parameters.access_token);
  //         }
  //         if (res.MESSAGE.parameters.phone_number) {
  //           localStorage.setItem(
  //             "phone_number",
  //             res.MESSAGE.parameters.phone_number
  //           );
  //         }

  //         if (res.MESSAGE.parameters.gender) {
  //           localStorage.setItem("user_name", res.MESSAGE.parameters.user_name);

  //           navigate("/user-home");
  //         } else {
  //           navigate("/user-signup");
  //         }
  //       } else {
  //         SetOtpError(true);
  //       }
  //     },
  //     (error) => {
  //       console.log(error);
  //       SetOtpError(true);
  //     }
  //   );
  // }

  function verifyOTP(otp) {
    SetOtpLoading(true);
    let data = JSON.stringify({
      otp: otp,
      id: location.state.otp_id,
      user_id: location.state.user_id,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/verify-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        SetOtpLoading(false);
        console.log(response.data);
        if (response.data.status) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", location.state.user_id);
          if (
            response.data.user &&
            response.data.user.gender &&
            response.data.user.name
          ) {
            navigate("/user-home");
          } else {
            navigate("/user-signup");
          }
        } else {
          SetOtpError(true);
        }
      })
      .catch(function (error) {
        SetOtpLoading(false);
        SetOtpError(true);
        console.log(error);
      });
  }

  return (
    <div style={{ background: "#FFF7C0" }}>
      {otpLoading ? (
        <Fade in>
          <div
            style={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </div>
        </Fade>
      ) : (
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
              onClick={() => verifyOTP(otp)}
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
      )}
    </div>
  );
}

export default Otp;
