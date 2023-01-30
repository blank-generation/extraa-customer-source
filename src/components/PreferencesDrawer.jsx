import { useState, forwardRef, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Stack } from "@mui/material";
import { AddBox, Edit } from "@mui/icons-material";
import axios from "axios";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PreferencesDrawer(props) {
  const config = {
    headers: {
      Authorization: localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };
  const allIndRefs = {};
  const [open, setOpen] = useState(false);
  const [industries, SetIndustries] = useState([]);
  const [selectedIndustries, SetSelectedIndustries] = useState([]);
  const [err, SetErr] = useState(false);
  const [prefsChecked, SetPrefsChecked] = useState(false);
  const pathURL = process.env.REACT_APP_ENDPOINT;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //  --------------------------------------- Save Preferences ---------------------------------------------------
  const handleSave = () => {
    if (selectedIndustries.length > 2) {
      console.log("Saving");
      let data = JSON.stringify({ preferences: selectedIndustries });

      axios
        .post(pathURL + "/set-user-profile", data, config)
        .then((response) => {
          console.log(response.data);
          // window.location.reload(false);
          if (response.data.RESULT) {
            handleClose();
            window.location.reload(false);
          }
        });
    } else {
      SetErr(true);
    }
  };

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

    if (sind.length > 2) {
      SetErr(false);
    }
  };
  //  -------------------------------------------- Use effect ---------------------------------------------
  useEffect(() => {
    // axios.get('https://extraa.in/go-api/public/api/get-all-industries').then(response => {
    // console.log(response.data['Industry List'])
    SetIndustries(JSON.parse(localStorage.getItem("all_industries")));
    console.log(props.sind);
  }, []);

  const CheckActivePrefs = () => {
    if (!prefsChecked) {
      let selInd = [];

      props.sind.forEach((si) => {
        allIndRefs[si.id].checked = true;
        selInd.push(si.id);
      });

      SetSelectedIndustries(selInd);
    }
  };

  return (
    <div onLoad={CheckActivePrefs}>
      {props.edit ? (
        <Button
          onClick={handleClickOpen}
          className="p-btn"
          size="small"
          variant="contained"
          startIcon={<Edit />}
        >
          {" "}
          Edit
        </Button>
      ) : (
        <Stack direction="row" justifyContent="center">
          <IconButton
            color="primary"
            sx={{ width: 72 }}
            onClick={handleClickOpen}
          >
            {" "}
            <AddBox sx={{ width: 64, height: 64 }} />
          </IconButton>
        </Stack>
      )}

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <h3>Preferences</h3>
          </Toolbar>
        </AppBar>

        <Stack alignItems="center" justifyContent="center">
          <Stack alignItems="center" sx={{ textAlign: "center" }} mt={4}>
            <h3 style={{ margin: 0 }}>Preferences</h3>
            <p style={{ margin: 0, fontSize: "0.8em" }}>
              Choose upto 10 industries you would like coupons from
            </p>
          </Stack>
          <Stack
            direction="row"
            flexWrap="wrap"
            className="filter-scroll"
            mt={4}
            justifyContent="center"
            sx={{ maxWidth: 600 }}
          >
            {/* ------------------------------------------------------- Map --------------------------------------------------------- */}

            {industries.map((ind) => (
              <Stack alignItems="center" key={ind.id}>
                <input
                  type="checkbox"
                  id={"inudstry" + ind.id}
                  onClick={(event) => getUserCouponsbyIndustry(ind.id, event)}
                  ref={(ref) => (allIndRefs[ind.id] = ref)}
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
                    width: 48,
                    margin: 0,
                    fontSize: "0.6em",
                    textTransform: "capitalize",
                    paddingRight: 8,
                    paddingLeft: 8,
                  }}
                >
                  {ind.industry_name.toLowerCase().replace("and", "&")}
                </p>
              </Stack>
            ))}
          </Stack>
          {err && (
            <div>
              {" "}
              <p style={{ color: "red", marginBottom: 0, textAlign: "center" }}>
                {" "}
                Please select atleast 3 industries
              </p>
            </div>
          )}
          <Button
            autoFocus
            color="inherit"
            onClick={handleSave}
            className="p-btn"
            sx={{ margin: 12, marginTop: 4 }}
          >
            Save
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
}
