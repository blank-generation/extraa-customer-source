import TopAppBar from "../components/TopAppBar";
import {
  Stack,
  Box,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  Slide,
  Divider,
  Card,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CloseRounded,
  SentimentDissatisfied,
} from "@mui/icons-material";

import { CouponCard } from "../components/CouponCard";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";

import { useDraggable } from "react-use-draggable-scroll";

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef();
  const cSection = useRef();
  const { events } = useDraggable(ref); // Now we pass the reference to the useDraggable hook:
  const pathURL = process.env.REACT_APP_ENDPOINT;

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const [userName, SetUserName] = useState("");
  const [totalCoupons, SetTotalCoupons] = useState("");
  const [noCoupons, SetNoCoupons] = useState(false);
  const [totalFeedbacks, SetTotalFeedbacks] = useState("");
  const [coupons, SetCoupons] = useState([]);
  const [industries, SetIndustries] = useState([]);
  const [selectedIndustries, SetSelectedIndustries] = useState([]);
  const [couponWon, SetCouponsWon] = useState(0);
  const [msgOpen, SetMsgOpen] = useState(false);
  const [couponOpen, SetCouponOpen] = useState(false);
  const [profileComp, SetProfileComp] = useState(0);

  const handleMsgOpen = () => {
    SetMsgOpen(true);
  };

  const handleMsgClose = () => {
    SetMsgOpen(false);
  };

  const handleClearFilter = () => {
    SetSelectedIndustries([]);
  };

  const scrollToCoupons = () => {
    cSection.current.scrollIntoView();
  };

  const couponStats = [
    {
      img: "./assets/cwon.png",
      text: "Coupons won",
      num: totalCoupons.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    },
    {
      img: "./assets/fbgiven.png",
      text: "Feedbacks Given",
      num: totalFeedbacks.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    },
  ];
  //  ----------------------------------------------- API Calls -------------------------------------
  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);

      SetCouponsWon(location.state.couponNum);
      if (location.state.couponNum === 1) {
        SetCouponOpen(true);
      } else {
        SetMsgOpen(true);
      }
    }

    if (localStorage.getItem("token")) {
      // ----------- Get User coupons

      axios
        .post(pathURL + "/user-coupon-details", "", config)
        .then((response) => {
          console.log(response.data.Data);
          if (response.data.RESULT) {
            SetTotalCoupons(response.data.Data.length);
            localStorage.setItem("total_coupons", response.data.Data.length);
            SetCoupons(
              response.data.Data.sort(function (a, b) {
                return (
                  new Date(b.coupon_created_at) - new Date(a.coupon_created_at)
                );
              })
            );
          } else {
            SetNoCoupons(true);
            SetTotalCoupons(0);
            localStorage.setItem("total_coupons", 0);
          }
        })
        .catch((err) => {
          console.log(err.request.status);
          if (err.request.status === 401) {
            localStorage.clear();
            navigate("//");
          }
        });

      // ----------- Get User feedback details

      axios
        .post(pathURL + "/user-feedback-details", "", config)
        .then((response) => {
          // console.log(response.data)
          if (response.data.RESULT) {
            SetTotalFeedbacks(response.data.Data.length);
            localStorage.setItem("total_feedbacks", response.data.Data.length);
          } else {
            SetTotalFeedbacks(0);
            localStorage.setItem("total_feedbacks", 0);
          }

          // SetCoupons(response.data.Data);
        });

      // ----------- Get User profile

      axios.get(pathURL + "/get-user-profile",  config).then((response) => {
        console.log(response.data.Data);
        let profComp = 0;
        if (response.data.Data.dob) {
          profComp += 1;
        }
        if (response.data.Data.email_id) {
          profComp += 1;
        }
        if (response.data.Data.pincode) {
          profComp += 1;
        }
        SetProfileComp(profComp);
      });

      // ----------- Get all industries

      axios.get(pathURL + "/get-all-industries").then((response) => {
        // console.log(response.data['Industry List'])
        SetIndustries(response.data["Industry List"]);
        localStorage.setItem(
          "all_industries",
          JSON.stringify(response.data["Industry List"])
        );
      });
    } else {
      navigate("//");
    }
    SetUserName(localStorage.getItem("user_name"));
  }, []);

  //  ------------------------------------- Fitler by industry ----------------------------------------

  const getUserCouponsbyIndustry = (ind_id, event) => {
    let sind = selectedIndustries;
    if (event.target.checked) {
      sind.push(ind_id);
    } else {
      let index = sind.indexOf(ind_id);
      if (index > -1) {
        sind.splice(index, 1);
      }
    }

    SetSelectedIndustries(sind);

    // console.log(selectedIndustries);

    let indData = { industry_id: sind.join(", ") };

    let indconfig = {
      method: "post",
      url: pathURL + "/user-coupon-details",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      data: indData,
    };
    // let couponfd = new FormData();
    // couponfd.append('industry_id', ind_id);

    axios(indconfig).then((response) => {
      // console.log(response.data)

      if (response.data.Data) {
        SetCoupons(
          response.data.Data.sort(function (a, b) {
            return (
              new Date(b.coupon_created_at) - new Date(a.coupon_created_at)
            );
          })
        );
        SetNoCoupons(false);
      } else {
        SetNoCoupons(true);
      }
    });
  };

  return (
    <div className="home">
      <TopAppBar home={true} />
      {/* ------------------------------------- Background Images -------------------------- */}
      <div style={{ position: "relative" }}>
        <img
          className="bgImgs floating"
          id="bcircle-1"
          src="./assets/Asset 7.png"
          alt=""
        />
        <img
          className="bgImgs floating"
          id="halo-1"
          src="./assets/Asset 5.png"
          alt=""
        />
        <img
          className="bgImgs floating"
          id="halo-2"
          src="./assets/Asset 5.png"
          alt=""
        />

        <img
          className="bgImgs floating"
          id="bcircle-2"
          src="./assets/Asset 7.png"
          alt=""
        />
        <img
          className="bgImgs floating"
          id="halo-3"
          src="./assets/Asset 5.png"
          alt=""
        />
        <img
          className="bgImgs floating"
          id="halo-4"
          src="./assets/Asset 5.png"
          alt=""
        />

        <img
          className="bgImgs floating"
          id="bcircle-3"
          src="./assets/Asset 7.png"
          alt=""
        />
        <img
          className="bgImgs floating"
          id="halo-5"
          src="./assets/Asset 5.png"
          alt=""
        />
      </div>
      {/* ------------------------------------------- Dialog ------------------------------------------ */}

      <Dialog
        open={msgOpen}
        keepMounted
        onClose={handleMsgClose}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="xs"
        fullWidth
      >
        <Confetti run={msgOpen} height={300} width={300} numberOfPieces={60} />
        <DialogTitle
          sx={{
            fontFamily: "rota-bold",
            textAlign: "center",
            background: "#F9B61F",
          }}
        >
          {" "}
          Congratulations!{" "}
          <IconButton
            onClick={handleMsgClose}
            sx={{ position: "absolute", right: 6, top: 0 }}
          >
            {" "}
            <CloseRounded />{" "}
          </IconButton>{" "}
        </DialogTitle>

        <Stack alignItems="center">
          <img src="./assets/gift.png" alt="" style={{ marginTop: 32 }} />
          <img
            src="./assets/extraa_logo.png"
            alt=""
            style={{ height: 32, marginTop: 8 }}
          />

          {couponWon > 1 ? (
            <p>
              You've won{" "}
              <span style={{ fontFamily: "rota-black" }}> {couponWon} </span>{" "}
              coupons!
            </p>
          ) : (
            <p>
              You've won{" "}
              <span style={{ fontFamily: "rota-black" }}> {couponWon} </span>{" "}
              coupon!
            </p>
          )}
        </Stack>
      </Dialog>

      {/* -------------------------- Welcome Section -------------------------- */}

      <Stack justifyContent={"center"} alignItems="center" pt={6}>
        <h3
          style={{
            color: "#4F3084",
            fontSize: "1.6em",
            margin: 0,
            paddingLeft: "1em",
            paddingRight: "1em",
            textAlign: "center",
          }}
        >
          Welcome! {userName}
        </h3>
        <Divider sx={{ background: "red" }} />
        {/* -------------------------- Stats -------------------------- */}

        <Stack
          justifyContent={"center"}
          alignItems="center"
          pt={4}
          direction="row"
          gap={4}
          pb={4}
        >
          {couponStats.map((item) => (
            <Card style={{ borderRadius: 24 }} key={item.text}>
              <Stack
                p={4}
                alignItems="center"
                width={100}
                justifyContent="space-between"
                sx={{ textAlign: "center" }}
              >
                <img src={item.img} alt="" />
                <h3 style={{}}> {item.text}</h3>
                <h2
                  style={{
                    margin: 0,
                    color: "#4F3084",
                    lineHeight: 0,
                    fontFamily: "rota-black",
                  }}
                >
                  {item.num}
                </h2>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>

      {/* -------------------------- Complete your profile -------------------------- */}

      <Stack
        style={{ background: "#4F3084", color: "white" }}
        p={4}
        alignItems="center"
      >
        <p> Complete your profile to get better coupons</p>
        <p
          style={{
            textAlign: "right",
            width: "100%",
            maxWidth: "800px",
            margin: 0,
            lineHeight: 1,
          }}
        >
          <span>{profileComp}</span>/3
        </p>

        <Box sx={{ width: "100%", maxWidth: "800px" }} mb={4}>
          <LinearProgress
            variant="determinate"
            value={profileComp * 33.33}
            color="secondary"
          />
        </Box>

        <Button
          variant="contained"
          className="y-btn"
          onClick={() => navigate("/user-profile")}
        >
          Go to Profile
        </Button>
      </Stack>

      {/* -------------------------- Search-------------------------- */}

      {/* <Stack alignItems='center' mt={2}>
                <SearchBar></SearchBar>
            </Stack> */}

      {/* -------------------------- Filter by industries -------------------------- */}
      <h3
        ref={cSection}
        style={{
          marginBottom: 0,
          color: "#4F3084",
          textAlign: "center",
          fontSize: "1.4em",
          marginTop: 56,
        }}
      >
        Your Coupons
      </h3>

      <Stack alignItems="center">
        <div style={{ maxWidth: 1000, paddingLeft: 24, width: "100vw" }}>
          <h4
            style={{
              marginBottom: 0,
              color: "#4F3084",
              textAlign: "left",
              fontSize: "1em",
            }}
          >
            Filter by industries:
          </h4>
        </div>
      </Stack>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "100%", maxWidth: 1000, position: "relative" }}>
          <div
            style={{ position: "absolute", right: -24, top: 24, zIndex: 100 }}
          >
            <ChevronRight
              sx={{ width: 40, height: 40, opacity: 0.7 }}
              color="primary"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 1000,
            overflowX: "scroll",
            paddingTop: 8,
            paddingBottom: 8,
          }}
          className="filter-scroll"
          {...events}
          ref={ref}
        >
          {industries.map((ind) => (
            <div key={ind.id}>
              <input
                type="checkbox"
                id={"inudstry" + ind.id}
                onClick={(event) => getUserCouponsbyIndustry(ind.id, event)}
              />
              <label htmlFor={"inudstry" + ind.id}>
                <img
                  style={{
                    width: 48,
                    height: 48,
                    marginRight: 12,
                    marginLeft: 12,
                  }}
                  src={
                    "https://shops.extraa.in/web/uploads/industry/" +
                    ind.industry_logo
                  }
                  alt=""
                />
              </label>
              <p
                style={{
                  textAlign: "center",
                  margin: 0,
                  fontSize: "0.6em",
                  textTransform: "capitalize",
                  paddingRight: 8,
                  paddingLeft: 8,
                }}
              >
                {ind.industry_name.toLowerCase().replace("and", "&")}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Stack alignItems="center">
        <div style={{ maxWidth: 1000, width: "100vw" }}>
          {/* <SeletedFiltersList
                        selectedIndustries={() => { let sind = selectedIndustries; return sind; }}
                        industries={industries}
                    /> */}

          {/* <div>
                        <p style={{ textAlign: 'left', textTransform: 'capitalize', fontSize: '0.8em', paddingLeft: 24, marginBottom: 0, opacity: selectedIndustries.length > 0 ? 1 : 0, transition: '0.4s' }}>
                            Filters:
                            {selectedIndustries.length > 0 &&
                                <span>
                                    {
                                        selectedIndustries.map((selInd, index) => (

                                            <span key={selInd}>
                                                {(index === 0 ? ' ' : ', ') + industries.find((e) => e.id === selInd).industry_name.toLowerCase().replace('and', '&')}
                                            </span>
                                        ))

                                    }</span>}</p>
  
                    </div> */}
        </div>
      </Stack>
      {/* --------------------------  Coupons  -------------------------- */}

      <Stack
        direction="row"
        justifyContent="center"
        onLoad={msgOpen || couponOpen ? scrollToCoupons : console.log("")}
      >
        {noCoupons ? (
          <Stack mt={4} mb={8} alignItems="center">
            <SentimentDissatisfied
              sx={{ width: 100, height: 100, opacity: 0.8 }}
              color="primary"
            />
            <p style={{ textAlign: "center" }}>
              {" "}
              Sorry, we couldn't find any coupons. <br />
              Try clearing your filters
            </p>
          </Stack>
        ) : (
          <Slide in direction="up">
            <Stack
              mt={4}
              mb={8}
              direction={{ sm: "column", lg: "row" }}
              gap={4}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ maxWidth: 1200 }}
            >
              {coupons.map((obj, index) => (
                <CouponCard
                  key={obj.user_form_id}
                  brandName={obj.brand.brand_name.toLowerCase()}
                  offerType={obj.coupon.offer_details}
                  offerDetails={obj.coupon.offer_subtitle}
                  code={obj.coupon.coupon_code}
                  validity={obj.coupon.expiry_date}
                  brandLogo={
                    "https://shops.extraa.in/web/uploads/retailer/" +
                    obj.brand.brand_logo
                  }
                  industry_name={obj.coupon.industry_name.toLowerCase()}
                  industry_icon={
                    "https://shops.extraa.in/web/uploads/industry/" +
                    obj.coupon.industry_logo
                  }
                  terms={obj.coupon.terms_and_conditions}
                  coupon_color={obj.coupon.color_code}
                  dialogOpen={couponOpen === true && index === 0 ? true : false}
                  location={obj.coupon.location}
                />
              ))}
            </Stack>
          </Slide>
        )}
      </Stack>
    </div>
  );
}
