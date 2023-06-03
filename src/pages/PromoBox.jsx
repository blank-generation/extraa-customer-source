import OtpInput from "react18-otp-input";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Stack, Fade } from "@mui/material";
import { PhoneInTalk, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import { useApolloClient } from "@apollo/client";
import axios from "axios";
// import { useCookies } from 'react-cookie'
// import BottomCoupon from "../components/BottomCoupon";
import "./Feedback.css";
import ComeBackLater from "../components/ComeBackLater";
import Countdown from "react-countdown";

// import GetQRForm from "../queries/GetFormQuestions";
import { useQuery } from "@apollo/client";
import GetBoxes from "../queries/GetBox";

// let qAndA = [];
function PromoBox() {
  const params = useParams();
  const [boxData, setBoxData] = useState("");
  const [phNum, SetphNum] = useState("");
  const [errMsg, SetErrMsg] = useState("");
  const [otpScreen, setOtpScreen] = useState(false);

  const [otpId, setOtpId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, SetOtpError] = useState(false);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [otpValid, SetOtpValid] = useState(false);
  const [resetCounter, SetResetCounter] = useState(0);

  const [loading, SetLoading] = useState(false);
  const navigate = useNavigate();

  const resendOTP = () => {
    let rc = resetCounter;
    rc += 1;
    SetResetCounter(rc);

    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      phone_number: phNum,
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

  function handleOtpChange(val) {
    setOtp(val);
    SetErrMsg(null);
    SetOtpError(false);

    if (/^\d{4}$/.test(val)) {
      SetOtpValid(true);
    } else {
      SetOtpValid(false);
    }
  }
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
  const handleChange = (event) => {
    SetphNum(event.target.value);
  };

  function getOTP(num) {
    console.log(num);
    let headers = new Headers();
    setOtpScreen(true);
    SetphNum(num);
    SetLoading(true);
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      phone_number: num,
      qr_id: 1,
      dataFilter: boxData.data_filter,
      redeemFilter: boxData.redeem_filter,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/box/get-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        // localStorage.setItem("otp_id",response.data.insert_otp.id);
        setOtpId(response.data.insert_otp.id);
        setUserId(response.data.user.id);
        if (response.data.user.name) {
          setUserName(response.data.user.name);
        }
        SetLoading(false);

        // navigate("/verify-otp", {
        //   state: {
        //     otp_id: response.data.insert_otp.id,
        //     user_id: response.data.user.id,
        //     phone_number: num,
        //   },
        // });
      })
      .catch(function (error) {
        SetLoading(false);
        SetErrMsg("Phone number doesn't match");
      });
  }

  function verifyOTP(otp) {
    SetLoading(true);
    let Otpdata = JSON.stringify({
      otp: otp,
      id: otpId,
      user_id: userId,
      coupons: boxData.box_coupons,
      redeemFilter: boxData.redeem_filter,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/box/verify-otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: Otpdata,
    };

    axios(config)
      .then(function (response) {
        SetLoading(false);
        console.log(response.data);
        if (response.data.status) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", userId);
          navigate("/user-home", {
            state: {
              couponNum: response.data.coupons,
            },
          });
        } else {
          SetOtpError(true);
        }
      })
      .catch(function (error) {
        SetLoading(false);
        // SetOtpError(true);
        SetOtpError(true);
        console.log(error);
      });
  }

  function setInitalHeaders() {
    if (localStorage.token) {
      return {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.token,
      };
    }

    return {
      "Content-Type": "application/json",
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikd1ZXN0IiwiaHR0cHM6Ly9oYXN1cmEuaW8vand0L2NsYWltcyI6eyJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImd1ZXN0Il0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6Imd1ZXN0In19.dFW-ZzED-qnnoWVb0r9oZIcmn2gSsBxqBp30BuUz1wk",
    };
  }
  const { Boxesloading, error, data } = useQuery(GetBoxes, {
    variables: { url: params.box_url },
    context: {
      headers: setInitalHeaders(),
    },
  });

  useEffect(() => {
    if (data) {
      // console.log(couponData.user_coupons);
      console.log(data.boxes[0]);
      setBoxData(data.boxes[0]);
    }
  }, [Boxesloading, error, data]);

  return (
    <>
      {!loading ? (
        <div>
          {boxData && (
            <Fade in>
              <Stack alignItems="center" justifyContent="center">
                <div className="splash" style={{ maxWidth: "600px" }}>
                  <div className="splash-title">
                    <h2>{boxData.title} </h2>
                  </div>
                  <div className="splash-logo">
                    <img src={boxData.logo} alt="" />
                  </div>

                  {!otpId && !loading ? (
                    <Stack alignItems="center">
                      <div className="splash-content">
                        <p>{boxData.message}</p>
                      </div>
                      <ValidatorForm onSubmit={() => getOTP(phNum)}>
                        <TextValidator
                          label="Phone Number*"
                          onChange={handleChange}
                          name="phNum"
                          type="tel"
                          size="small"
                          value={phNum}
                          validators={[
                            "required",
                            "isNumber",
                            "matchRegexp:^[0-9]{10}$",
                          ]}
                          errorMessages={[
                            "This field is required",
                            "Please enter a vaild number",
                            "Please enter a vaild number",
                          ]}
                          sx={{
                            backgroundColor: "#ffffff",
                            "& .MuiInputBase-root": {
                              backgroundColor: "#ffffff",
                            },
                          }}
                          InputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            startAdornment: (
                              <InputAdornment position="start">
                                <PhoneInTalk />
                              </InputAdornment>
                            ),
                          }}
                          style={{ marginTop: "2em" }}
                        />

                        {errMsg && (
                          <p
                            style={{
                              color: "red",
                              marginBottom: 0,
                              textAlign: "center",
                            }}
                          >
                            {" "}
                            Sorry, something went wrong 😞. <br /> {errMsg}{" "}
                          </p>
                        )}
                        <Button
                          style={{ marginTop: "2em" }}
                          className="y-btn"
                          type="submit"
                          fullWidth
                          variant="contained"
                          endIcon={<ChevronRightRounded />}
                        >
                          Enter
                        </Button>
                      </ValidatorForm>
                    </Stack>
                  ) : (
                    <div className={otpError ? "otp-cont wrong" : "otp-cont"}>
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
                      {otpError && (
                        <p className="otpText"> OTP doesn not match </p>
                      )}

                      <Button
                        disabled={!otpValid}
                        onClick={() => verifyOTP(otp)}
                        endIcon={<ChevronRightRounded />}
                        className="p-btn"
                        size="large"
                      >
                        Get Coupons
                      </Button>

                      <div className="otp-resend" style={{ marginTop: "2em" }}>
                        <span>Didn't receive it?</span>
                        <Countdown
                          date={Date.now() + 25000}
                          key={resetCounter}
                          renderer={renderer}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Stack>
            </Fade>
          )}

          {Boxesloading && (
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
          )}
          <Fade in={boxData ? true : false}>
            <div className="footer" style={{ marginTop: "2em" }}>
              <div
                className="powered"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  bottom: 12,
                }}
              >
                powered by
                <img src="../assets/extraa_logo.png" alt="" />
              </div>
            </div>
          </Fade>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default PromoBox;
