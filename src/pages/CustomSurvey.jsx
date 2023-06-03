import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import GetSurvey from "../queries/GetSurvey";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
// import "survey-core/modern.min.css";
import "survey-core/defaultV2.min.css";
import "./CustomSurvey.scss";
import { Box, Button, Stack } from "@mui/material";
import { useRef } from "react";
import axios from "axios";

function CustomSurvey() {
  const [formDetails, SetFormDetails] = useState([]);
  const [coupons, SetCoupons] = useState([]);
  const couponsRef = useRef([]);
  const qrIdRef = useRef(0);
  const surveyIdRef = useRef(0);
  const [formComplete, SetFormComplete] = useState(false);
  const [loading, SetLoading] = useState(true);
  const [alreadyDone, SetAlreadyDone] = useState(false);
  const [msg, SetMsg] = useState("");
  const params = useParams();
  const navigate = useNavigate();

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

  // const formComplete = useRef(0);
  function submitAPI(phone, gender, name, email, dob, ageRange, results) {
    axios
      .post(
        "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/survey/submit",
        {
          qr_id: qrIdRef.current,
          phone_number: phone,
          gender: gender,
          name: name,
          email: email,
          dob: dob,
          age_range: ageRange,
          survey_id: surveyIdRef.current,
          response_details: results,
          coupons: couponsRef.current,
        }
      )
      .then(function (response) {
        window.scrollTo(0, 0);
        console.log(response);
        if (response.data.alreadyDone) {
          SetAlreadyDone(true);
        }
        SetLoading(false);
      })
      .catch(function (error) {
        SetMsg(error.message);
        SetLoading(false);
      });

    SetFormComplete(true);
  }

  const submitSurvey = useCallback((sender) => {
    const results = sender.data;
    // alert(results);

    const name = results.name;
    const phone = results.mobile;
    const gender = results.gender;
    const email = results.email;
    const dob = results.dob;

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

    console.log(name, ageRange, gender, dob, phone, email);
    // console.log(survey2);
    submitAPI(phone, gender, name, email, dob, ageRange, results);

    // formComplete.current++;
  }, []);

  useEffect(() => {
    if (data && data.surveys[0] && data.surveys[0].form_details) {
      // console.log(data.surveys[0]?.form_details);

      // SetBanner(data.surveys[0]?.banner);
      // SetMsg(data.surveys[0]?.message);
      // SetMsgTitle(data.surveys[0]?.message_title);

      SetCoupons(data.surveys[0].survey_coupons);
      couponsRef.current = data.surveys[0].survey_coupons;
      // console.log(data.surveys[0].survey_coupons);
      qrIdRef.current = data.surveys[0].qr_id;
      surveyIdRef.current = data.surveys[0].id;
      // console.log(data.surveys[0]?.form_details);
      // console.log(fd.pages[0].elements[0], "hhh");
      SetFormDetails(data.surveys[0]?.form_details);
      SetLoading(false);
      console.log(coupons);
      // console.log(getColor("https://storage.extraa.in/files/jito_Banner.png"));

      //   setBoxData(data.boxes[0]);
    }
  }, [surveyLoading, error, data]);

  // let fd = formDetails;

  const survey2 = new Model(formDetails);

  useEffect(() => {
    if (formComplete) {
      survey2.doComplete();
    }
  }, [formComplete]);

  // ----------------- SET API VALUES // NOT PRODUCTION READY --------------------
  survey2.setValue("name", "MY NAME");
  survey2.setValue("mobile", "8056299487");
  survey2.setValue("gender", "Item 1");
  survey2.setValue("dob", "1994-08-23");
  survey2.setValue("email", "email@email.com");

  // ---------------------------------------------------------
  survey2.showProgressBar = "top";
  console.log(formDetails);
  const ThankYouPage = () => {
    return (
      <Stack alignItems="center">
        <Box maxWidth="600px" width="90%" marginY="36px">
          <div style={{ textAlign: "center" }}>
            <h1>Thank You</h1>
            <p> Your feedback is valuable </p>
            <h3>Celebrate with these cool coupons!</h3>
          </div>
          {coupons.length > 0 && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              gap="24px"
              flexWrap="wrap"
            >
              {coupons.map((obj, index) => {
                return (
                  <Stack alignItems="center" key={index}>
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
                        src={obj.coupon?.brand_logo}
                        alt={obj.coupon?.brand_name}
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
    );
  };

  // survey2.completedHtml = thankYouPage;

  return (
    <div className="csv-survey">
      {formDetails && (
        <Survey
          model={survey2}
          showCompletedPage={false}
          onComplete={submitSurvey}
        />
      )}
      {formComplete && <ThankYouPage />}

      <div
        className="powered"
        style={{
          marginBottom: 0,
          paddingBottom: "12px",
          paddingTop: "12px",
        }}
      >
        powered by
        <img src="../assets/extraa_logo.png" alt="" />
      </div>
    </div>
  );
}

export default CustomSurvey;
