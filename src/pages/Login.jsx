import { PhoneInTalk, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { Button, Stack } from "@mui/material";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Fade, CircularProgress } from "@mui/material";

function Login(props) {
  const pathURL = process.env.REACT_APP_ENDPOINT;

  const navigate = useNavigate();
  const [phNum, SetphNum] = useState("");
  const [errMsg, SetErrMsg] = useState("");
  const [loading, SetLoading] = useState(false);
  const handleChange = (event) => {
    SetphNum(event.target.value);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/user-home");
    }
  }, []);

  // function handleSubmit(num) {
  //   // navigate("/verify-otp");

  //   const formData = new FormData();
  //   formData.append("phone_number", num);

  //   axios
  //     .post(pathURL + "/check-login", formData)
  //     .then((response) => {
  //       console.log(response.data);
  //       if (response.data.RESULT) {
  //         navigate("/verify-otp", { state: { phone_number: num } });
  //       } else {
  //         SetErrMsg(response);
  //       }
  //     })
  //     .catch((err) => {
  //       SetErrMsg(err.code);
  //     });
  // }

  function getOTP(num) {
    let headers = new Headers();
    SetphNum(num);
    SetLoading(true);
    headers.append("Content-Type", "application/json");

    let data = JSON.stringify({
      phone_number: num,
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
        navigate("/verify-otp", {
          state: {
            otp_id: response.data.insert_otp.id,
            user_id: response.data.user.id,
            phone_number: num,
          },
        });
      })
      .catch(function (error) {
        SetLoading(false);
        SetErrMsg(error);
      });
  }

  return (
    <div style={{ background: "#FFF7C0" }}>
      {loading ? (
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
        <div className="user-login">
          <Stack alignItems={"center"} pt={24}>
            <img
              src="./assets/extraa_logo.png"
              alt=""
              className="home-logo"
              style={{
                width: "200px",
              }}
            />

            <ValidatorForm onSubmit={() => getOTP(phNum)}>
              <TextValidator
                label="Phone Number*"
                onChange={handleChange}
                variant="filled"
                name="phNum"
                type="tel"
                value={phNum}
                validators={["required", "isNumber", "matchRegexp:^[0-9]{10}$"]}
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
                  style={{ color: "red", marginBottom: 0, textAlign: "center" }}
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
      )}
    </div>
  );
}

export default Login;
