import { TextField } from "@mui/material";
import { AccountCircle, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { Button } from "@mui/material";

import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { useState, useCallback } from "react";
import UserSignUp from "../mutations/UserSignUp";
import { useApolloClient } from "@apollo/client";

function UserForm(props) {
  const [dob, SetDob] = useState("");
  const [userName, SetUserName] = useState("");
  const [ageGroup, SetAgeGroup] = useState(0);
  const [gender, SetGender] = useState("MALE");

  const handleDobChange = (event) => {
    const db = event.target.value;
    SetDob(db);
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    SetUserName(name);
    console.log(userName);
  };

  const client = useApolloClient();

  const submitUserForm = useCallback(
    async (uName, gndr, db) => {
      try {
        await client.mutate({
          mutation: UserSignUp,
          variables: {
            id: props.userId,
            name: uName,
            gender: gndr,
            age_range: db.toString(),
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
        props.SetNewUser(false);
      }
    },
    [client]
  );

  function handleSubmit(userName, gender, age_range) {
    localStorage.setItem("gender", gender);
    submitUserForm(userName, gender, age_range);
    // console.log(userName, gender, age_range);
    // props.SetUserData(name, num, age, gender);
  }

  return (
    <div className="user-details" style={{ marginTop: "2em" }}>
      <ValidatorForm
        onSubmit={() => handleSubmit(userName, gender, ageGroup)}
        onError={(errors) => console.log(errors)}
      >
        <TextValidator
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
          validators={[
            "required",
            "matchRegexp:^[a-zA-Z ]+$",
            "minStringLength:1",
          ]}
        ></TextValidator>
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
                21-30
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
                31-40
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
                41-50
              </label>
            </div>
            <div className="selecotr-item">
              <input
                type="radio"
                id="age-5"
                name="selector"
                className="selector-item_radio"
              />
              <label
                onClick={() => SetAgeGroup(4)}
                htmlFor="age-5"
                className="selector-item_label"
              >
                50+
              </label>
            </div>
          </div>
        </div>

        {/* <TextValidator
          style={{ marginTop: 36 }}
          sx={{ background: "#fff" }}
          label="Date of Birth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          variant="filled"
          onChange={handleDobChange}
          required
        /> */}

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
          type="submit"
          fullWidth
          variant="contained"
          endIcon={<ChevronRightRounded />}
        >
          Sign Up
        </Button>
      </ValidatorForm>
    </div>
  );
}

export default UserForm;
