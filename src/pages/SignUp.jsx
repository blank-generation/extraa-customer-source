import { TextField, Autocomplete, CircularProgress, Fade } from "@mui/material";
import {
  WhatsApp,
  AccountCircle,
  ChevronRightRounded,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
// import React from "react";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { incremented } from "../store/store";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useState, useCallback, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import UserSignUp from "../mutations/UserSignUp";
import { GetAllLocations } from "../queries/GetAllLocations";
import useGetLocation from "../queries/GetAllLocations";
import GetUserStats from "../queries/GetUserStats";
import { useQuery } from "@apollo/client";
function SignUp() {
  const navigate = useNavigate();
  // const pathURL = process.env.REACT_APP_ENDPOINT;

  const [userName, SetUserName] = useState("");
  const [ageGroup, SetAgeGroup] = useState(0);
  // const [location, SetLocation] = useState({});
  const [gender, SetGender] = useState("MALE");
  const [pageLoading, SetPageLoading] = useState(true);

  //  Auto complete stuff
  // const [open, setOpen] = useState(false);
  // const [options, setOptions] = useState([]);
  // const loading = open && options.length === 0;

  const [searchResults, setSearchResults] = useState([]);

  const [searchQuery, { loading: searchLoading }] = useLazyQuery(
    GetAllLocations,
    {
      context: {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.token,
        },
      },
      onCompleted: (data) => {
        console.log(data.misc_location, "Search Data");
        if (data.misc_location.length > 0) {
          let a = data.misc_location.map(function (element) {
            return {
              label: `${element.pincode} ${element.area} ${element.city}`,
              value: element,
            };
          });
          setSearchResults(a);
        } else {
          setSearchResults([]);
        }
      },
    }
  );

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    if (searchTerm.length > 2) {
      // console.log("ret");
      searchQuery({
        variables: { _like: `${searchTerm}%` },
      });
    } else {
      setSearchResults([]);
    }

    // console.log(searchResults);
  };

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const handleNameChange = (event) => {
    SetUserName(event.target.value);
  };

  const client = useApolloClient();
  const location = ["ALL"];

  //  ---------------------------- Get User Stats -------------------------------
  const {
    cnLoading,
    cnError,
    data: userStats,
  } = useQuery(GetUserStats, {
    context: {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.token,
      },
    },
  });

  useEffect(() => {
    if (userStats) {
      // console.log(userStats.users[0]);
      if (userStats.users[0].name && userStats.users[0].gender) {
        navigate("/user-home");
      } else {
        SetPageLoading(false);
      }
    }
  }, [cnLoading, cnError, userStats]);

  // function handleSubmit(name, age, gender) {
  //   // props.SetUserData(name, num, age, gender);
  //   const formData = new FormData();
  //   formData.append("age_rage", age);
  //   formData.append("gender", gender);
  //   localStorage.setItem("gender", gender);
  //   formData.append("user_name", name);

  //   axios
  //     .post(pathURL + "/set-user-profile", formData, config)
  //     .then((response) => {
  //       console.log(response.data);
  //       // window.location.reload(false);
  //       localStorage.setItem("user_name", name);
  //       navigate("/user-home");
  //     });
  // }

  const submitUserForm = useCallback(
    async (name, age, userGender) => {
      try {
        await client.mutate({
          mutation: UserSignUp,
          variables: {
            id: localStorage.user_id,
            name: name,
            gender: userGender,
            age_range: age.toString(),
          },
          context: {
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": "aseraadmin@1234",
            },
          },
        });
      } catch (e) {
        console.log(JSON.stringify(e));
      } finally {
        // props.SetNewUser(false);
        axios
          .post(
            "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/dist-coupon",
            {
              qr_id: 2,
              user_id: localStorage.getItem("user_id"),
              gender: gender,
              industry: 100,
              location: location,
              randomCoupons: 2,
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
            } else if (
              response.data.insert_user_coupons.returning.length === 0
            ) {
              //  SetNoCoupon(true);
              //  SetLoading(false);
            }
          });
      }
    },
    [client]
  );

  return (
    <div>
      {pageLoading ? (
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
        <div className="user-details">
          <ValidatorForm
            onSubmit={() => submitUserForm(userName, ageGroup, gender)}
          >
            <img
              src="./assets/extraa_logo.png"
              alt="extraa logo"
              height={80}
              style={{ paddingTop: 64, paddingBottom: 32 }}
            />

            <TextField
              variant="filled"
              label="Name"
              required
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
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              style={{ marginTop: "1em" }}
              value={userName}
              onChange={handleNameChange}
            ></TextField>
            <div className="gender-container ">
              Select your gender
              <div className="gender-selector">
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    className="selector-item_radio"
                    defaultChecked={gender === "MALE" ? true : false}
                  />
                  <label
                    onClick={() => SetGender("MALE")}
                    htmlFor="male"
                    className="selector-item_label gender-label"
                  >
                    Male
                  </label>
                </div>
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    className="selector-item_radio"
                  />
                  <label
                    onClick={() => SetGender("FEMALE")}
                    htmlFor="female"
                    className="selector-item_label gender-label"
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="age-container ">
              Select your age group
              <div className="age-selector">
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="age-1"
                    name="selector"
                    className="selector-item_radio"
                    defaultChecked={ageGroup === 0 ? true : false}
                  />
                  <label
                    onClick={() => SetAgeGroup(0)}
                    htmlFor="age-1"
                    className="selector-item_label"
                  >
                    5-20
                  </label>
                </div>
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="age-2"
                    name="selector"
                    className="selector-item_radio"
                  />
                  <label
                    onClick={() => SetAgeGroup(1)}
                    htmlFor="age-2"
                    className="selector-item_label"
                  >
                    21-40
                  </label>
                </div>
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="age-3"
                    name="selector"
                    className="selector-item_radio"
                  />
                  <label
                    onClick={() => SetAgeGroup(2)}
                    htmlFor="age-3"
                    className="selector-item_label"
                  >
                    41-60
                  </label>
                </div>
                <div className="selecotr-item">
                  <input
                    type="radio"
                    id="age-4"
                    name="selector"
                    className="selector-item_radio"
                  />
                  <label
                    onClick={() => SetAgeGroup(3)}
                    htmlFor="age-4"
                    className="selector-item_label"
                  >
                    60+
                  </label>
                </div>
              </div>
            </div>

            {/* <div className="age-container">
          Select your pincode
          <Autocomplete
            id="pincode"
            sx={{ width: 300, marginTop: 2 }}
            getOptionLabel={(option) => (option ? option.label : "")}
            options={searchResults}
            // loading={searchLoading}
            // renderInput={(params) => (
            //   <TextField
            //     {...params}
            //     label="Pincode"
            //     onChange={handleSearchChange}
            //     InputProps={{
            //       endAdornment: (
            //         <React.Fragment>
            //           {searchLoading ? (
            //             <CircularProgress color="inherit" size={20} />
            //           ) : null}
            //           {params.InputProps.endAdornment}
            //         </React.Fragment>
            //       ),
            //     }}
            //   />
            // )}
            renderInput={(params) => (
              <TextField
                onChange={handleSearchChange}
                {...params}
                label="Pincode"
              />
            )}
          />
        </div> */}

            <div className="terms">
              By submitting you agree to the{" "}
              <a
                rel="noreferrer"
                target="_blank"
                href="https://www.extraa.in/terms.html"
              >
                Terms & Conditions & Privacy Policy
              </a>
            </div>

            <Button
              className="submit"
              type="submit"
              fullWidth
              variant="contained"
              endIcon={<ChevronRightRounded />}
            >
              Sign Up
            </Button>
          </ValidatorForm>
        </div>
      )}
    </div>
  );
}

export default SignUp;
