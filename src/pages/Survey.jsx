import OtpInput from "react18-otp-input";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// import getColor from "colorthief";
import Color from "color-thief-react";

import {
  Stack,
  Box,
  Button,
  Fade,
  CircularProgress,
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useQuery } from "@apollo/client";
import GetSurvey from "../queries/GetSurvey";
import { ReactFormGenerator } from "react-form-builder2";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "react-form-builder2/dist/app.css";
import "./Survey.scss";

// let qAndA = [];
function Survey() {
  const params = useParams();

  const [loading, SetLoading] = useState(true);

  const navigate = useNavigate();

  const [formDetails, SetFormDetails] = useState([]);
  const [banner, SetBanner] = useState("");
  const [bgColor, SetBgColor] = useState("");
  const [formComplete, SetFormComplete] = useState(false);
  const [msg, SetMsg] = useState("");
  const [msgTitle, SetMsgTitle] = useState("");
  const [coupons, SetCoupons] = useState([]);
  const [emailError, SetEmailError] = useState(false);

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

  const { surveyLoading, error, data } = useQuery(GetSurvey, {
    variables: { url: params.survey_url },
    context: {
      headers: setInitalHeaders(),
    },
  });

  useEffect(() => {
    if (data) {
      // console.log(data.surveys[0]?.form_details);
      SetFormDetails(data.surveys[0]?.form_details);
      SetBanner(data.surveys[0]?.banner);
      SetMsg(data.surveys[0]?.message);
      SetMsgTitle(data.surveys[0]?.message_title);
      SetCoupons(data.surveys[0].survey_coupons);
      SetLoading(false);
      // console.log(getColor("https://storage.extraa.in/files/jito_Banner.png"));

      //   setBoxData(data.boxes[0]);
    }
  }, [surveyLoading, error, data]);

  const formSubmit = (values) => {
    // console.log(values);
    SetLoading(true);

    let formValues = values;

    formValues.forEach((element) => {
      if (element.name.startsWith("radio")) {
        element.stringValue = formDetails
          .filter((el) => {
            return el.field_name === element.name;
          })[0]
          .options.filter((option) => {
            return option.key === element.value[0];
          })[0].value;
      }

      element.label = formDetails.filter((el) => {
        return el.field_name === element.name;
      })[0].label;
    });

    // console.log(formValues);

    const name = values[0].value;

    const phone = values
      .filter((p) => String(p.name).startsWith("phone"))[0]
      .value.replaceAll(" ", "")
      .replaceAll("+", "");

    // const email = values.filter((p) => String(p.name).startsWith("email"))[0]
    //   .value;

    // const compareEmail = values.filter((p) =>
    //   String(p.name).startsWith("email")
    // )[1].value;

    // if (email !== compareEmail) {
    //   console.log("Emails dont match");
    //   SetEmailError(true);
    //   SetLoading(false);
    //   return;
    // }

    const date = moment(
      values
        .filter((p) => String(p.name).startsWith("date"))[0]
        .value.toString(),
      "DD/MM/YYYY"
    );

    const dob = date.format("YYYY-MM-DD");

    const gender = values.filter((p) => String(p.name).startsWith("radio"))[0]
      .stringValue;

    const age = moment().diff(dob, "years");

    let ageRange;

    if (age < 20) {
      ageRange = 0;
    } else if (age >= 20 && age < 40) {
      ageRange = 1;
    } else if (age >= 40 && age < 60) {
      ageRange = 2;
    } else {
      ageRange = 3;
    }

    // console.log(
    //   name,
    //   phone,
    //   email,
    //   date,
    //   dob,
    //   gender,
    //   ageRange,
    //   data.surveys[0].qr_id,
    //   data.surveys[0].id,
    //   data.surveys[0].survey_coupons
    // );

    axios
      .post(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/survey/submit",
        {
          qr_id: data.surveys[0].qr_id,
          phone_number: phone,
          gender: gender,
          name: name,
          // email: email,
          dob: dob,
          age_range: ageRange,
          survey_id: data.surveys[0].id,
          response_details: formValues,
          coupons: data.surveys[0].survey_coupons,
        }
      )
      .then(function (response) {
        console.log(response);
        SetFormComplete(true);
        SetLoading(false);
      })
      .catch(function (error) {
        SetMsg(error.message);
        SetLoading(false);
      });
  };

  return (
    <div className="survey-page">
      {/* <Collapse in={emailError}>
        <Alert
          severity="warning"
          color="error"
          style={{
            position: "fixed",
            zIndex: 1000,
            width: "100%",
            padding: 8,
            alignItems: "center",
          }}
          action={
            <Button
              aria-label="close"
              variant="contained"
              color="error"
              disableRipple
              size="small"
              sx={{ marginRight: 6, alignItems: "end" }}
              style={{
                borderRadius: "0.2rem",
                textTransform: "none",
                fontFamily: "Lexend",
              }}
              onClick={() => {
                SetEmailError(false);
              }}
            >
              Dismiss
            </Button>
          }
        ></Alert>
      </Collapse> */}
      {formDetails && !formComplete && !loading && (
        <Stack alignItems="center">
          {banner && (
            <div style={{ width: "100%" }}>
              <Color src={banner} crossOrigin="anonymous" format="hex">
                {({ data, loading }) => {
                  if (loading) return <div>loading...</div>;
                  return (
                    <Stack
                      alignItems="center"
                      style={{ width: "100%", background: data }}
                    >
                      <Box maxWidth="600px" width="100%">
                        <img style={{ width: "100%" }} src={banner} alt="" />
                      </Box>
                    </Stack>
                  );
                }}
              </Color>
            </div>
          )}

          <Box
            maxWidth="600px"
            width="90%"
            marginY="36px"
            className="bootstrap"
          >
            <ReactFormGenerator
              // form_action="/path/to/form/submit"
              // form_method="POST"

              onSubmit={formSubmit}
              task_id={12} // Used to submit a hidden variable with the id to the form from the database.
              // answer_data={JSON_ANSWERS} // Answer data, only used if loading a pre-existing form with values.
              // authenticity_token={AUTH_TOKEN} // If using Rails and need an auth token to submit form.
              data={formDetails} // Question data
              submitButton={
                <Button variant="contained" type="submit" className="p-btn">
                  Submit
                </Button>
              }
            />
          </Box>
        </Stack>
      )}
      {formComplete && !loading && (
        <Stack alignItems="center" minHeight="94vh">
          {banner && (
            <div style={{ width: "100%" }}>
              <Color src={banner} crossOrigin="anonymous" format="hex">
                {({ data, loading }) => {
                  if (loading) return <div>loading...</div>;
                  return (
                    <Stack
                      alignItems="center"
                      style={{ width: "100%", background: data }}
                    >
                      <Box maxWidth="600px" width="100%">
                        <img style={{ width: "100%" }} src={banner} alt="" />
                      </Box>
                    </Stack>
                  );
                }}
              </Color>
            </div>
          )}
          <Box maxWidth="600px" width="90%" marginY="36px">
            {msg && msgTitle && (
              <div style={{ textAlign: "center" }}>
                <h2>{msgTitle}</h2>
                <p>{msg}</p>
                <h3>Celebrate with these cool coupons!</h3>
              </div>
            )}
            {coupons.length > 0 && (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="end"
                gap="24px"
                flexWrap="wrap"
              >
                {coupons.map((obj, index) => {
                  return (
                    <Stack alignItems="center">
                      <div
                        style={{
                          background: "#FFF",
                          padding: "8px",
                          borderRadius: "12px",
                          boxShadow:
                            "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
                        }}
                      >
                        <img
                          style={{
                            maxWidth: "120px",
                            maxHeight: "80px",
                            borderRadius: "12px",
                          }}
                          src={obj.coupon.brand_logo}
                          alt={obj.coupon.brand_name}
                        />
                      </div>
                      <p
                        style={{
                          textAlign: "center",
                        }}
                      >
                        {obj.coupon.offer_title}
                      </p>
                    </Stack>
                  );
                })}
              </Stack>
            )}
            <Stack alignItems="center">
              <Button
                variant="contained"
                onClick={() => navigate("/")}
                className="p-btn"
              >
                Claim now!
              </Button>
            </Stack>
          </Box>
        </Stack>
      )}
      {loading && (
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
      )}
      <div className="powered">
        powered by
        <img src="../assets/extraa_logo.png" alt="" />
      </div>
    </div>
  );
}

export default Survey;
