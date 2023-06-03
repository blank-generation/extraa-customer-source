import Footer from "../components/Footer";
import Header from "../components/Header";
import Question from "../components/Question";
import MCQ4 from "../components/MCQ4";
import Splash from "../components/Splash";
import UserForm from "../components/UserForm";
import Coupon from "../components/Coupon";
import OtpInput from "react18-otp-input";
import PageNotFound from "../components/PageNotFound";
import { useSelector, useDispatch } from "react-redux";
import { Fade } from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { decremented, incremented } from "../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Stack } from "@mui/material";
import { Phone, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useApolloClient } from "@apollo/client";
import axios from "axios";

import BottomCoupon from "../components/BottomCoupon";
import "./Feedback.css";
import ComeBackLater from "../components/ComeBackLater";
import Countdown from "react-countdown";

import GetQRForm from "../queries/GetFormQuestions";
import UserOtpActivity from "../mutations/UserOtpRequestActivity";
import getUserFeedbackTimes from "../queries/GetUserSubmitTimes";
import { useQuery } from "@apollo/client";

// let qAndA = [];
function SmFeedback() {
  //.................... Normal JS ........................\\
  const [couponCooldown, SetCouponCooldown] = useState(false);
  const [dataLoaded, SetDataLoaded] = useState(false);
  const [fetchError, SetFetchError] = useState(false);
  const [questions, SetQuestions] = useState([]);
  const [qAndA, SetqAndA] = useState([]);
  const [apiResponse, SetApiResponse] = useState({});
  const [brandLogo, SetBrandLogo] = useState("");
  const [brandName, SetBrandName] = useState("");
  const [submitObj, SetSubmitObj] = useState({});
  const [userLogged, SetUserLoggedIn] = useState(0);
  const [newUser, SetNewUser] = useState(false);
  const [phNum, SetphNum] = useState("");
  const [userId, SetUserId] = useState("");
  const [otpId, SetOtpId] = useState("");
  const [errMsg, SetErrMsg] = useState("");
  const [otpLoading, SetOtpLoading] = useState(false);
  const [otpError, SetOtpError] = useState(false);
  const [merchantIndustry, SetMerchantIndustry] = useState(0);
  const [userDoneThis, setUserDoneThis] = useState({});
  const [userComeBackLater, setUserComeBackLater] = useState(false);
  const [randomCoupons, setRandomCoupons] = useState(0);
  const [spaceLocation, setSpaceLocation] = useState({});

  const pageIndex = useSelector((state) => state.pageIndex);

  const client = useApolloClient();
  // const commonQuestion = "Rate your overall experience";
  // const [rating, setRating] = useState(0);
  // const [cookies, setCookie] = useCookies(['extraaUserID', 'couponLock']);

  let progress = (pageIndex * 100) / (questions.length + 2 - userLogged * 2);

  const [otp, setOtp] = useState("");
  const [otpValid, SetOtpValid] = useState(false);
  const dispatch = useDispatch();
  // const [disablePointer, setDisablePointer] = useState(false);
  const [resetCounter, SetResetCounter] = useState(0);

  const handlePhChange = (event) => {
    SetphNum(event.target.value);
  };
  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <Button
          variant="text"
          onClick={() => getOTP(phNum, data.qr[0].id, true)}
        >
          Resend
        </Button>
      );
    } else {
      // Render a countdown
      return <span>Resend in... {seconds}</span>;
    }
  };

  let answers = [];

  // ------------- URL Params
  let params = useParams();

  let pathURL = process.env.REACT_APP_ENDPOINT;

  function responseToQuestion(apiResponse, merchant, qrLogo) {
    console.log(apiResponse);
    if (qrLogo) {
      SetBrandLogo(qrLogo);
    } else {
      SetBrandLogo(merchant.logo);
    }
    SetMerchantIndustry(merchant.industry || 0);
    SetBrandName(merchant.name);
    let qs = [];
    apiResponse.forEach((qObj) => {
      let q = qObj.question.label;
      let type = qObj.question.type;
      let qOptions = [];
      if (qObj.question.question_options.length > 0) {
        qObj.question.question_options.forEach((aObj) => {
          qOptions.push(aObj.option.label);
        });
      } else if (qObj.question.type === "SCALE5") {
        for (let i = 1; i < 6; i++) {
          qOptions.push(i.toString());
        }
      }

      qs.push({ label: q, type: type, options: qOptions });
    });
    let qa = qAndA;
    if (qa === []) {
      for (let i = 0; i < apiResponse.length; i++) {
        answers.push("");
        qa.push("");
      }
    }
    SetqAndA([...qa]);
    // console.log(answers);
    SetQuestions(qs);
  }

  async function AsyncGetUserFeedbackTimes() {
    const resp = await getUserFeedbackTimes(
      client,
      {
        qrId: data.qr[0].id,
        userId: localStorage.getItem("user_id"),
        lastDate: new Date().toISOString().slice(0, 10),
      },
      localStorage.getItem("token")
    );
    // console.log(resp);
    setUserDoneThis(resp);
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
  const { loading, error, data } = useQuery(GetQRForm, {
    variables: { qr_code: params.qr_code },
    context: {
      headers: setInitalHeaders(),
    },
  });

  useEffect(() => {
    if (data) {
      setRandomCoupons(data.qr[0].dist_coupon_amount);
      setSpaceLocation(data.qr[0].spaces_qrs[0].space.location);

      // console.log(data.qr[0].dist_coupon_amount, "coupons AMount");
      // console.log(data.qr[0].spaces_qrs[0].space.location, "space Location");

      // console.log(data.qr[0].qr_forms_accounts[0].form.form_questions);
      if (data.qr.length > 0) {
        responseToQuestion(
          data.qr[0].qr_forms_accounts[0].form.form_questions,
          data.qr[0].spaces_qrs[0]
            ? data.qr[0].spaces_qrs[0].space.merchant_spaces[0].merchant
            : {
                name: "Extraa",
                logo: "../assets/extraa_logo.png",
              },
          data.qr[0].logo && data.qr[0].logo
        );

        SetDataLoaded(true);
        if (userLogged > 0) {
          AsyncGetUserFeedbackTimes();
        }
      }
    }
  }, [data, loading, error]);

  useEffect(() => {
    // console.log(data);

    if (localStorage.getItem("token")) {
      SetUserLoggedIn(1);
    }
  }, []);

  useEffect(() => {
    if (userDoneThis.users_activity_aggregate) {
      if (userDoneThis.users_activity_aggregate.aggregate.count > 0) {
        console.log(userDoneThis.users_activity_aggregate.aggregate.count);
        setUserComeBackLater(true);
      }
    }
  }, [userDoneThis]);

  function SetAnswer(ans, qIndex) {
    console.log(ans);
    if (ans && qIndex) {
      let qId =
        data.qr[0].qr_forms_accounts[0].form.form_questions[qIndex - 1].question
          .id;
      let qType =
        data.qr[0].qr_forms_accounts[0].form.form_questions[qIndex - 1].question
          .type;
      // console.log("question type: " + qType);
      // console.log("answer: " + ans-1);
      let qa = qAndA;
      qa[qIndex - 1] = {
        question_id: qId,
        question_type: qType,
        answer: ans,
        user_id: localStorage.user_id,
        qr_id: data.qr[0].id,
        form_id: data.qr[0].qr_forms_accounts[0].form.id,
      };
      answers[qIndex - 1] = ans;

      console.log(qa);

      SetqAndA([...qa]);
    }
  }

  function getOTP(phNum, qr_id, resend) {
    let headers = new Headers();
    SetphNum(phNum);
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      phone_number: phNum,
      qr_id: qr_id,
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

    if (!resend) {
      increment();
    }

    axios(config)
      .then(function (response) {
        console.log(response.data);
        SetUserId(response.data.user.id);
        SetOtpId(response.data.insert_otp.id);
        initSubmitObj(response.data.user.id);
        // UpdateUserOtpActivity(response.data.user.id, qr_id);
        if (response.data.user.name && response.data.user.gender) {
          localStorage.setItem("gender", response.data.user.gender);
          SetNewUser(response.data.newUser);
        } else {
          SetNewUser(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function verifyOTP(otp) {
    SetOtpLoading(true);
    let data = JSON.stringify({
      otp: otp,
      id: otpId,
      user_id: userId,
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
          localStorage.setItem("user_id", userId);

          increment();
        } else {
          SetOtpError(true);
          SetErrMsg(response.data.message);
        }
      })
      .catch(function (error) {
        SetOtpLoading(false);
        console.log(error);
      });
  }

  function initSubmitObj(usr_id) {
    let qa = qAndA;
    if (usr_id) {
      qa.forEach((item) => {
        item.user_id = usr_id;
      });
    }
    let subObj = {
      qr_id: data.qr[0].id,
      form_id: data.qr[0].qr_forms_accounts[0].form.id,
      user_id: usr_id ? usr_id : localStorage.getItem("user_id"),
      merchant_id:
        data.qr[0].spaces_qrs[0].space.merchant_spaces[0].merchant.id,
      questions_and_ans: qa,
      action: "SUBMIT_FEEDBACK",
      location: spaceLocation,
      randomCoupons: randomCoupons,
    };
    SetSubmitObj({ ...subObj });
    // localStorage.setItem("sub_obj", JSON.stringify(subObj));
  }

  // --------------------React JS -------------------------------------------

  // console.log(cookies.extraaUserID);

  const decrement = () => {
    dispatch(decremented());
  };
  const increment = () => {
    dispatch(incremented());

    // console.log("Cookies set")
  };
  onpopstate = () => {
    decrement();
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

  return (
    <div className="feedback-screen">
      {dataLoaded ? (
        <div>
          {/*------------------- Header------------------- */}
          {pageIndex < questions.length + 3 && (
            <Header brand_name={brandName} logo={brandLogo}></Header>
          )}
          {/* ----------------- Splash ----------------------- */}
          {/* {pageIndex === 0 && couponCooldown === false && <Splash></Splash>}
          {couponCooldown && <ComeBackLater />} */}

          {/* ---------------- Questions and Answers -------------------- */}
          {pageIndex < questions.length && !userComeBackLater && (
            <Fade in>
              <div>
                <Question question={questions[pageIndex].label}></Question>
                <MCQ4
                  options={questions[pageIndex].options}
                  questionType={questions[pageIndex].type}
                  SetAnswer={SetAnswer}
                  initSubmitObj={initSubmitObj}
                  offset={2}
                  ans={qAndA}
                ></MCQ4>
              </div>
            </Fade>
          )}
          {userComeBackLater && (
            <Fade in>
              <div>
                <ComeBackLater
                  msg={
                    "Looks like you've already done this. Come back tomorrow."
                  }
                />
              </div>
            </Fade>
          )}

          {/*---------------- Mobile number form ------------- */}
          {pageIndex === questions.length && userLogged <= 0 && (
            <Fade in>
              {/* <div>
                                <UserForm SetUserData={setUserData}></UserForm>
                                <BottomCoupon></BottomCoupon>
                            </div> */}

              <div className="user-login">
                <Stack alignItems={"center"} mt={4}>
                  <img
                    src="../assets/extraa_logo.png"
                    alt=""
                    className="home-logo"
                    style={{
                      width: "200px",
                      height: "auto",
                    }}
                  />

                  <ValidatorForm
                    onSubmit={() => getOTP(phNum, data.qr[0].id, false)}
                  >
                    <TextValidator
                      label="Phone Number*"
                      onChange={handlePhChange}
                      variant="filled"
                      name="phNum"
                      type="tel"
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
                            <Phone />
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
                      className="p-btn"
                      type="submit"
                      fullWidth
                      variant="contained"
                      endIcon={<ChevronRightRounded />}
                    >
                      Get OTP
                    </Button>
                  </ValidatorForm>
                </Stack>
              </div>
            </Fade>
          )}
          {/* ----------------------- OTP -------------------- */}
          {pageIndex === questions.length + 1 && userLogged <= 0 && (
            <Fade in>
              {otpLoading ? (
                <Fade in>
                  <div
                    style={{
                      width: "100%",
                      height: "90vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                </Fade>
              ) : (
                <div
                  className={otpError ? "otp-container wrong" : "otp-container"}
                >
                  <div className="otp-text">Please enter your OTP</div>

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
                    variant="contained"
                  >
                    Verify
                  </Button>
                  <div className="otp-resend" style={{ marginTop: "0" }}>
                    <span>Didn't receive it?</span>
                    <Countdown
                      date={Date.now() + 25000}
                      key={resetCounter}
                      renderer={renderer}
                    />
                  </div>
                </div>
              )}
            </Fade>
          )}

          {/* /* ------------------ User Sign up --------------------  */}
          {pageIndex === questions.length + 2 - userLogged * 2 && newUser ? (
            <div>
              <UserForm userId={userId} SetNewUser={SetNewUser}></UserForm>
            </div>
          ) : (
            <div></div>
          )}
          {/* ------------------------- Common Question -------------------------- */}
          {/* {pageIndex === questions.length + 2 - userLogged * 2 && (
            <div>
              <Question question={commonQuestion}></Question>
              
              </div>
              {userLogged > 0 && <BottomCoupon></BottomCoupon>}
            </div>
          )} */}
          {/* ------------------------------- Coupon ------------------------------------ */}
          {pageIndex ===
            questions.length + 2 - userLogged * 2 + (newUser ? 1 : 0) && (
            <Fade in>
              <div className="coupon-screen">
                <Coupon
                  formData={submitObj}
                  gender={localStorage.getItem("gender")}
                  industryId={merchantIndustry}
                />
              </div>
            </Fade>
          )}
          {/* ---------------------- Foooter --------------------------- */}
          {pageIndex < questions.length + 2 - userLogged * 2 &&
            !userComeBackLater && (
              <Footer
                progress={progress}
                FooterContent={
                  pageIndex < questions.length + 2 - userLogged &&
                  !couponCooldown
                }
                Questions={questions.length + 2 - pageIndex - userLogged * 2}
                Counter={pageIndex > 0}
              />
            )}
        </div>
      ) : (
        <Fade in>
          <div
            style={{
              width: "100%",
              height: "90vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {fetchError ? (
              <PageNotFound message="Oops.. Something went wrong" />
            ) : (
              <CircularProgress />
            )}
          </div>
        </Fade>
      )}
    </div>
  );
}

export default SmFeedback;
