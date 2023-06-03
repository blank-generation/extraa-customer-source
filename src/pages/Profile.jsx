import {
  Avatar,
  Stack,
  TextField,
  Divider,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Edit, AddBox, Save, Logout } from "@mui/icons-material";
import TopAppBar from "../components/TopAppBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PreferencesDrawer from "../components/PreferencesDrawer";

export function Profile() {
  const navigate = useNavigate();
  const [userProf, SetUserProf] = useState({});
  const [editable, SetEditable] = useState(false);
  const [email, SetEmail] = useState("");
  const [emailErr, SetEmailErr] = useState(false);
  const [pincode, SetPincode] = useState("");
  const [pincodeErr, SetPincodeErr] = useState(false);
  const [dob, SetDob] = useState("");
  const [gender, SetGender] = useState("");
  const [userName, SetUserName] = useState("");
  const [preferences, SetPreferences] = useState([]);
  const pathURL = process.env.REACT_APP_ENDPOINT;

  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEmailChange = (event) => {
    const eml = event.target.value;
    SetEmail(eml);
    SetEmailErr(!ValidateEmail(eml));
  };

  const handleGenderChange = (event) => {
    SetGender(event.target.value);
  };

  const handleNameChange = (event) => {
    SetUserName(event.target.value);
  };

  const handleDobChange = (event) => {
    const db = event.target.value;
    SetDob(db);
  };

  const handlePincodeChange = (event) => {
    const pincd = event.target.value;
    SetPincode(pincd);
    SetPincodeErr(!ValidatePincode(pincd));
  };

  function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  function ValidatePincode(pin) {
    if (/^[1-9][0-9]{5}$/.test(pin)) {
      return true;
    }
    return false;
  }

  function handleEdit() {
    let ed = editable;
    SetEditable(!ed);
  }

  function saveProfile() {
    if (!emailErr && !pincodeErr) {
      console.log("Saving");
      SetEditable(false);
      const formData = new FormData();
      if (email) {
        formData.append("email_id", email);
      }
      if (pincode) {
        formData.append("pincode", pincode);
      }

      if (dob) {
        formData.append("dob", dob);
      }

      if (gender) {
        formData.append("gender", gender);
      }
      if (userName) {
        formData.append("user_name", userName);
      }
      axios
        .post(pathURL + "/set-user-profile", formData, config)
        .then((response) => {
          console.log(response.data);
          window.location.reload(false);
        });
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("user")) {
        SetUserProf(JSON.parse(localStorage.getItem("user")));
      }

      // axios.get(pathURL + "/get-user-profile", config).then((response) => {
      //   console.log(response.data.Data);
      //   let userData = response.data.Data;
      //   SetUserProf(userData);
      //   localStorage.setItem("user_name", userData.user_name);
      //   if (response.data.Data.preferences) {
      //     SetPreferences(response.data.Data.preferences);
      //   }
      // });
    } else {
      navigate("/");
    }
  }, []);

  const couponStats = [
    {
      img: "./assets/cwon.png",
      text: "Coupons won",
      num: localStorage.getItem("coupons_won")?.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    },
    {
      img: "./assets/fbgiven.png",
      text: "Feedbacks Given",
      num: localStorage.getItem("feedback_count")?.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }),
    },
  ];

  return (
    <div>
      <TopAppBar />
      {/* ---------------------------  Avatar ----------------------------------*/}
      <Stack sx={{ height: 256 }} alignItems="center" justifyContent="center">
        {userProf?.name && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar sx={{ width: 64, height: 64, background: "#4F3084" }}>
              {" "}
              {userProf?.name.slice(0, 1)}
            </Avatar>
            <h4 style={{ fontSize: "1.4em", margin: "0.4em" }}>
              {" "}
              {userProf?.name}
            </h4>
          </div>
        )}
        <Button className="y-btn" startIcon={<Logout />} onClick={handleLogout}>
          {" "}
          Logout{" "}
        </Button>
      </Stack>

      <Divider />
      {/* ---------------------------------------Stats --------------------------------------- */}
      <Stack
        direction="row"
        justifyContent="center"
        gap={{ md: 12, xs: 4 }}
        pt={4}
        pb={4}
        sx={{ background: "#F8F2FF" }}
      >
        {couponStats.map((item) => (
          <Stack
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: 80, textAlign: "center" }}
            key={item.text}
          >
            <img src={item.img} alt="" />
            <h4 style={{}}> {item.text}</h4>
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
        ))}
      </Stack>
      {/* ---------------------------------------Profile --------------------------------------- */}
      <Stack direction="row" justifyContent="center">
        {userProf.phone_number && (
          <Stack gap={4} p={4} sx={{ width: 800 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <h2>Profile Details</h2>
              <div>
                {editable && (
                  <Button
                    onClick={saveProfile}
                    className="y-btn"
                    size="small"
                    variant="contained"
                    style={{ marginRight: 12 }}
                    startIcon={<Save />}
                  >
                    {" "}
                    Save
                  </Button>
                )}
                {/* <Button
                  onClick={handleEdit}
                  className="p-btn"
                  size="small"
                  variant="contained"
                  startIcon={<Edit />}
                >
                  {" "}
                  Edit
                </Button> */}
              </div>
            </Stack>

            <TextField
              label="Phone Number"
              value={userProf.phone_number}
              type="tel"
              disabled
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Name"
              defaultValue={userProf.name}
              onChange={handleNameChange}
              focused={editable}
              InputProps={{
                readOnly: !editable,
              }}
            />
            <TextField
              label="Email"
              defaultValue={userProf.email_id}
              helperText={emailErr ? "Please enter a valid Email ID" : ""}
              error={emailErr}
              focused={editable}
              onChange={handleEmailChange}
              InputProps={{
                readOnly: !editable,
              }}
            />
            <FormControl focused={editable}>
              <InputLabel id="user_gender">Gender</InputLabel>
              <Select
                labelId="user_gender"
                label="Gender"
                defaultValue={userProf.gender}
                onChange={handleGenderChange}
                readOnly={!editable}
              >
                <MenuItem value="MALE"> Male </MenuItem>
                <MenuItem value="FEMALE"> Female </MenuItem>
              </Select>
            </FormControl>

            {userProf.dob ? (
              <TextField
                label="Date of Birth"
                type="date"
                defaultValue={userProf.dob}
                focused={editable}
                onChange={handleDobChange}
                InputProps={{
                  readOnly: !editable,
                }}
              />
            ) : (
              <TextField
                label="Date of Birth"
                type={editable ? "date" : "string"}
                placeholder="dd-mm-yyyy"
                focused={editable}
                onChange={handleDobChange}
                InputProps={{
                  readOnly: !editable,
                }}
              />
            )}
            <TextField
              label="Area Pincode"
              defaultValue={userProf.pincode}
              onChange={handlePincodeChange}
              type="tel"
              helperText={pincodeErr ? "Please enter a valid pincode" : ""}
              error={pincodeErr}
              focused={editable}
              InputProps={{
                readOnly: !editable,
              }}
            />
          </Stack>
        )}
      </Stack>
      {/* ------------------------------------------- Preferences ----------------------------------------------- */}
      <Divider />
      {/* <Stack
        direction="row"
        justifyContent="center"
        sx={{ background: "#F8F2FF" }}
        mb={2}
        p={4}
        pb={12}
      >
        <Stack sx={{ width: 800 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <h2> Preferences</h2>
            {preferences.length > 1 && (
              <div style={{ marginLeft: 64 }}>
                {" "}
                <PreferencesDrawer edit={true} sind={preferences} />{" "}
              </div>
            )}
          </Stack>

          {preferences.length > 1 ? (
            <Stack direction="row" flexWrap="wrap">
              {preferences.map((ind) => (
                <div key={ind.id}>
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

                  <p
                    style={{
                      textAlign: "center",
                      width: 48,
                      margin: 0,
                      fontSize: "0.6em",
                      textTransform: "capitalize",
                      paddingRight: 8,
                      paddingLeft: 8,
                    }}
                  >
                    {ind?.industry_name.toLowerCase().replace("and", "&")}
                  </p>
                </div>
              ))}
            </Stack>
          ) : (
            <div>
              {" "}
              <PreferencesDrawer />
              <p style={{ textAlign: "center" }}>
                {" "}
                Add industries that you would like coupons from
              </p>
            </div>
          )}
        </Stack>
      </Stack> */}
    </div>
  );
}
