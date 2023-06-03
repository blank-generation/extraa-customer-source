import { Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { ChevronRight } from "@mui/icons-material";
import { Slide } from "@mui/material";
import ComeBackLater from "./ComeBackLater";
import PageNotFound from "./PageNotFound";
import { useNavigate } from "react-router-dom";
import SubmitAnswer from "../mutations/SubmitFeedback";
import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import axios from "axios";
import getUserFeedbackTimes from "../queries/GetUserSubmitTimes";

function Coupon(props) {
  const navigate = useNavigate();

  //  COUPON STUFF _----------------------------------------

  const [success, SetSuccess] = useState(false);
  const [apiError, SetApiError] = useState("");
  const [noCoupon, SetNoCoupon] = useState(false);
  const [comeback, SetComeBack] = useState(false);
  const [comebackMsg, SetComeBackMsg] = useState("");
  const [userDoneThis, setUserDoneThis] = useState(null);
  const [loading, SetLoading] = useState(true);

  let pathURL = process.env.REACT_APP_ENDPOINT;

  let called = false;

  const ans = props.formData;
  const gender = props.gender;

  async function AsyncGetUserFeedbackTimes() {
    const resp = await getUserFeedbackTimes(
      client,
      {
        qrId: ans.qr_id,
        userId: ans.user_id,
        lastDate: new Date().toISOString().slice(0, 10),
      },
      localStorage.getItem("token")
    );
    // const resp = 0;
    // console.log(resp);
    setUserDoneThis(resp);
    if (resp && resp.users_activity_aggregate) {
      if (resp.users_activity_aggregate.aggregate.count > 0) {
        // if (resp > 0) {
        SetComeBack(true);
        SetComeBackMsg(
          "Looks like you've already done this. Come back tommorrow."
        );
        SetLoading(false);
      } else {
        sumbitQRFeedback();

        axios
          .post(
            "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/dist-coupon",
            {
              qr_id: ans.qr_id,
              user_id: ans.user_id,
              gender: gender,
              industry: props.industryId,
              location: ans.location,
              randomCoupons: ans.randomCoupons,
            }
          )
          .then(function (response) {
            console.log(response);
            if (response.data.insert_user_coupons) {
              navigate("/user-home", {
                state: {
                  couponNum: response.data.insert_user_coupons.returning.length,
                },
              });
            } else if (response.data.comebacklater) {
              SetComeBack(true);
              SetComeBackMsg("Looks like you've already got these coupons");
              SetLoading(false);
            } else if (
              response.data.insert_user_coupons.returning.length === 0
            ) {
              SetNoCoupon(true);
              SetLoading(false);
            }
          });
      }
    }
  }

  // useEffect(() => {
  //   if (userDoneThis && userDoneThis.users_activity_aggregate) {
  //     if (userDoneThis.users_activity_aggregate.aggregate.count > 0) {
  //       console.log(userDoneThis.users_activity_aggregate.aggregate.count);

  //       SetLoading(false);
  //     }
  //   }
  // }, [userDoneThis]);

  //   const [loading, error, data] = useMutation(SubmitAnswer, {
  //     variables: {
  //       objects: props.questions_and_ans,
  //       qr_id: props.qr_id,
  //       form_id: props.form_id,
  //       user_id: props.user_id,
  //       action: props.action,
  //       merchant_id: props.merchant_id,
  //     },
  //     context: {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-hasura-admin-secret": "aseraadmin@1234",
  //       },
  //     },
  //   });

  const client = useApolloClient();

  const sumbitQRFeedback = useCallback(async () => {
    try {
      await client.mutate({
        mutation: SubmitAnswer,
        variables: {
          objects: ans.questions_and_ans,
          qr_id: ans.qr_id,
          form_id: ans.form_id,
          user_id: ans.user_id,
          action: ans.action,
          merchant_id: ans.merchant_id,
        },
        context: {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.token,
          },
        },
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }, [client]);

  useEffect(() => {
    console.log(props);
    AsyncGetUserFeedbackTimes();

    //   .then(async function () {
    //   let udt = await userDoneThis;
    //   if (userDoneThis && !comeback) {
    //     axios
    //       .post(
    //         "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/dist-coupon",
    //         {
    //           qr_id: ans.qr_id,
    //           user_id: ans.user_id,
    //           gender: gender,
    //           location: ans.location,
    //           randomCoupons: ans.randomCoupons,
    //         }
    //       )
    //       .then(function (response) {
    //         console.log(response);
    //         if (response.data.insert_user_coupons) {
    //           navigate("/user-home", {
    //             state: {
    //               couponNum: response.data.insert_user_coupons.returning.length,
    //             },
    //           });
    //         } else if (response.data.comebacklater) {
    //           SetComeBack(true);
    //           SetComeBackMsg("Looks like you've already got these coupons");
    //           SetLoading(false);
    //         } else {
    //           SetNoCoupon(true);
    //           SetLoading(false);
    //         }
    //       });
    //   }
    // });
  }, []);

  // useEffect(() => {
  //   let modfd = props.formData;
  //   if (userDoneThis && !comeback) {
  //     axios
  //       .post(
  //         "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/dist-coupon",
  //         {
  //           qr_id: ans.qr_id,
  //           user_id: ans.user_id,
  //           gender: gender,
  //           location: ans.location,
  //           randomCoupons: ans.randomCoupons,
  //         }
  //       )
  //       .then(function (response) {
  //         console.log(response);
  //         if (response.data.insert_user_coupons) {
  //           navigate("/user-home", {
  //             state: {
  //               couponNum: response.data.insert_user_coupons.returning.length,
  //             },
  //           });
  //         } else if (response.data.comebacklater) {
  //           SetComeBack(true);
  //           SetComeBackMsg("Looks like you've already got these coupons");
  //           SetLoading(false);
  //         } else {
  //           SetNoCoupon(true);
  //           SetLoading(false);
  //         }
  //       });
  //   }
  //   // navigate("/user-home", {
  //   //     state: {
  //   //       couponNum: res.MESSAGE.parameters.coupon_details.length,
  //   //     },
  //   //   });

  //   if (!called) {
  //   }
  // }, [userDoneThis, comeback]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading === true ? (
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {comeback ? (
            <ComeBackLater msg={comebackMsg} />
          ) : success && noCoupon === false ? (
            <Slide in direction="up" timeout={1000}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className={`coupon-container card }`} id="flipz"></div>
              </div>
            </Slide>
          ) : noCoupon ? (
            <div
              className="nocoupons"
              style={{
                textAlign: "center",
              }}
            >
              <img
                style={{ maxWidth: "200px" }}
                src="../assets/extraa_logo.png"
                alt=""
              />
              <h2>Sorry! There are no coupons available right now.</h2>
              <Button
                className="y-btn"
                endIcon={<ChevronRight />}
                onClick={() => navigate("/user-home")}
                fullWidth
                sx={{ marginTop: 4 }}
              >
                {" "}
                View your coupons
              </Button>
            </div>
          ) : (
            <PageNotFound
              message="Sorry. There seems to be have been an error."
              errorDetails={apiError.message}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Coupon;
