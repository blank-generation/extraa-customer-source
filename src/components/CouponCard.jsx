import {
  Card,
  Box,
  CardContent,
  Divider,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Stack,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState, useCallback } from "react";
import {
  ChevronRight,
  Close,
  LocationCity,
  LocationOn,
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import downloadjs from "downloadjs";
import { Download, Check } from "@mui/icons-material";
import parse from "html-react-parser";

export function CouponCard(props) {
  const [open, setOpen] = useState(props.dialogOpen);
  const [logoError, SetlogoError] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ---------------------------------------------- Download Coupon -------------------------------------------
  const handleDownloadCoupon = useCallback(async () => {
    const coupon1 = document.querySelector("#coupon-dw > div > div > div");

    const canvas = await html2canvas(coupon1, {
      useCORS: true,
      allowTaint: true,
    });
    const dataURL = canvas.toDataURL("image/jpg");
    downloadjs(dataURL, "Extraa Coupon.jpg", "image/jpg");
  }, []);

  return (
    <div className="coupon">
      <Card
        sx={{ borderRadius: 8, width: 300, position: "relative" }}
        elevation={4}
        onClick={handleClickOpen}
      >
        {/* <Box sx={{ color: 'white', paddingLeft: 2, height: 32, textTransform: 'lowercase' }}>
                        <h2 style={{ fontSize: '1.2em', textTransform: 'capitalize' }}> {props.industry_name}</h2>
                    </Box> */}

        <Box
          sx={{
            display: "flex",
            background: "#ffffba",
            alignItems: "start",
            height: "100%",
          }}
        >
          {/* ------------------------------ Left Column ---------------------------- */}

          <Stack
            sx={{
              background: props.coupon_color,
              color: "white",
              height: "100%",
            }}
            alignItems="center"
            justifyContent="center"
          >
            {/* -------------------------- Brand Logo ------------------------------------- */}
            <Box
              sx={{
                width: 80,
                paddingTop: 2,
                paddingLeft: 2,
                paddingRight: 2,
                height: 80,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!logoError ? (
                <img
                  src={props.brandLogo}
                  onError={() => SetlogoError(true)}
                  alt="brand logo"
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    background: "white",
                    height: "100%",
                    objectFit: "contain",
                    padding: 4,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    color: props.coupon_color,
                    borderRadius: 12,
                    background: "white",
                    height: "100%",
                  }}
                >
                  <h4
                    style={{
                      marginTop: 32,
                      overflowWrap: "anywhere",
                      fontSize: "0.6em",
                      fontFamily: "rota-black",
                      textAlign: "center",
                    }}
                  >
                    {props.brandName.toUpperCase()}
                  </h4>
                </div>
              )}
            </Box>
            {/* --------------------- Industry Name ----------------------------------------- */}
            <h4
              style={{
                fontSize: ".65em",
                textTransform: "capitalize",
                marginBottom: 0,
                marginTop: 8,
                color: "white",
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              {" "}
              {props.industry_name.replace("and", "&")}
            </h4>

            {/* ------------------------------- Coupon Code -------------------------------- */}
            <p style={{}}>
              {/* <span style={{ fontSize: '0.5em' }}>Code: </span>  */}
              <span
                style={{
                  background: "white",
                  color: "black",
                  fontSize: "0.7em",
                  fontFamily: "rota-black",
                  padding: "6px 8px",
                  borderRadius: 24,
                  marginLeft: "8px",
                  marginRight: "8px",
                }}
              >
                {props.code}
              </span>
            </p>
            {/* <img src={props.industry_icon} alt={props.industry_name} style={{ width: 32, height: 32 }} /> */}
          </Stack>

          {/* ------------------------------------ Right Column ------------------------------------- */}

          {/* ------------------------------------------ Brand Name ------------------------------------ */}
          <Stack sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <h3
              style={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: "0.8em",
              }}
            >
              {props.brandName}
            </h3>
            {/* ------------------------------------ Offer title -------------------------- */}
            <h2
              style={{
                marginBottom: 0,
                marginTop: 4,
                fontFamily: "rota-black",
                fontSize: "1.4em",
                textTransform: "uppercase",
              }}
            >
              {props.offerType}
            </h2>
            {/* ----------------------- Offer Details --------------------------------- */}
            <p
              style={{
                margin: 0,
                textTransform: "capitalize",
                fontSize: "0.7em",
              }}
            >
              {props.offerDetails && props.offerDetails.length > 24
                ? `${props.offerDetails.substring(0, 18)}...`
                : props.offerDetails}
            </p>
            {/* ----------------------- Validity --------------------------------- */}
            <p style={{ marginTop: 8, fontSize: "0.8em" }}>
              <span style={{ fontSize: "0.9em", fontFamily: "rota-black" }}>
                valid till:{" "}
              </span>
              {props.validity}
            </p>
            <Divider />
            {/* ----------------------- Powered --------------------------------- */}
            <div
              style={{
                marginTop: 8,
                fontSize: "0.7em",
                verticalAlign: "middle",
                color: "#4F3084",
              }}
            >
              {" "}
              Powered by{" "}
              <img
                style={{ height: 18, verticalAlign: "middle" }}
                src="./assets/extraa_logo.png"
                alt=""
              />{" "}
            </div>
            <p
              style={{
                margin: 0,
                color: "#4F3084",
                marginTop: 6,
                fontSize: "0.55em",
                fontFamily: "rota-black",
                textAlign: "center",
              }}
            >
              www.extraa.in
            </p>
          </Stack>

          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: 10,
            }}
          >
            <ChevronRight color="primary" />
          </div>
        </Box>
      </Card>

      {/* ---------------------------- Full Dialog coupon --------------------------------------- */}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        className="couponFull"
        fullWidth
        id="coupon-dw"
      >
        <DialogContent sx={{}}>
          <Card
            sx={{ borderRadius: 8, marginBottom: 2, marginTop: 2 }}
            elevation={4}
          >
            <Box
              sx={{
                display: "flex",
                background: "#ffffba",
                position: "relative",
              }}
            >
              {/* ------------------------------ Left Column ---------------------------- */}
              <Stack
                sx={{
                  background: props.coupon_color,
                  color: "white",
                  flex: { xs: 1, lg: 0, md: 0, sm: 0 },
                }}
                alignItems="center"
                justifyContent="center"
              >
                {/* -------------------------- Brand Logo ------------------------------------- */}

                <Box
                  sx={{
                    width: 120,
                    paddingTop: 2,
                    paddingLeft: 2,
                    paddingRight: 2,
                    height: 120,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {!logoError ? (
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "white",
                        borderRadius: 4,
                      }}
                    >
                      <img
                        src={props.brandLogo}
                        onError={() => SetlogoError(true)}
                        alt="brand logo"
                        style={{
                          width: "auto",
                          height: "auto",
                          maxHeight: 120,
                          maxWidth: 120,
                          borderRadius: 12,
                          background: "white",
                        }}
                      />
                    </Box>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        color: props.coupon_color,
                        borderRadius: 12,
                        background: "white",
                        height: "100%",
                      }}
                    >
                      <h4
                        style={{
                          marginTop: 56,
                          overflowWrap: "anywhere",
                          fontSize: "1em",
                          fontFamily: "rota-black",
                          textAlign: "center",
                        }}
                      >
                        {props.brandName.toUpperCase()}
                      </h4>
                    </div>
                  )}
                </Box>
                {/* --------------------- Industry Name ----------------------------------------- */}
                <h4
                  style={{
                    fontSize: ".6em",
                    textTransform: "capitalize",
                    marginBottom: 0,
                    marginTop: 4,
                  }}
                >
                  {" "}
                  {props.industry_name.replace("and", "&")}
                </h4>

                {/* ------------------------------- Coupon Code -------------------------------- */}
                <p style={{}}>
                  {/* <span style={{ fontSize: '0.5em' }}>Code: </span>  */}
                  <span
                    style={{
                      background: "white",
                      color: "black",
                      fontSize: "0.8em",
                      fontFamily: "rota-black",
                      padding: "6px 8px",
                      borderRadius: 24,
                    }}
                  >
                    {props.code}
                  </span>
                </p>
                {/* <img src={props.industry_icon} alt={props.industry_name} style={{ width: 32, height: 32 }} /> */}
              </Stack>

              {/* ------------------------------------ Right Column ------------------------------------- */}
              <IconButton
                onClick={handleClose}
                sx={{ flex: 0, margin: 0, position: "absolute", right: 6 }}
              >
                {" "}
                <Close />{" "}
              </IconButton>

              {/* ------------------------------------------ Brand Name ------------------------------------ */}
              <Stack sx={{ paddingLeft: 2, paddingTop: 2, paddingRight: 3 }}>
                <h3
                  style={{
                    margin: 0,
                    textTransform: "capitalize",
                    fontSize: "0.7em",
                  }}
                >
                  {props.brandName}
                </h3>
                {/* ------------------------------------ Offer title -------------------------- */}
                <h2
                  style={{
                    marginBottom: 0,
                    marginTop: 4,
                    fontFamily: "rota-black",
                    fontSize: "1.6em",
                  }}
                >
                  {props.offerType}
                </h2>
                {/* ----------------------- Offer Details --------------------------------- */}
                <p
                  style={{
                    margin: 0,
                    textTransform: "capitalize",
                    fontSize: "0.8em",
                  }}
                >
                  {props.offerDetails}
                </p>
                {/* ----------------------- Validity --------------------------------- */}
                <p style={{ marginTop: 8, fontSize: "0.8em" }}>
                  <span style={{ fontSize: "0.9em", fontFamily: "rota-black" }}>
                    valid till:{" "}
                  </span>
                  {props.validity}
                </p>
                <Divider />
                {/* ----------------------- Powered --------------------------------- */}
                <div
                  style={{
                    marginTop: 8,
                    fontSize: "0.7em",
                    verticalAlign: "middle",
                    color: "#4F3084",
                  }}
                >
                  {" "}
                  Powered by{" "}
                  <img
                    style={{ height: 18, verticalAlign: "middle" }}
                    src="./assets/extraa_logo.png"
                    alt=""
                  />{" "}
                </div>
                <p
                  style={{
                    margin: 0,
                    color: "#4F3084",
                    marginTop: 6,
                    fontSize: "0.6em",
                    fontFamily: "rota-black",
                  }}
                >
                  www.extraa.in
                </p>
              </Stack>
            </Box>
          </Card>

          {/* ----------------------------- Terms and Conditions --------------------------- */}
          <Card
            sx={{ borderRadius: 8, marginBottom: 2, background: "#ffffba" }}
            elevation={4}
          >
            <Box
              sx={{
                paddingLeft: 2,
                marginTop: 2,
                marginLeft: 2,
                height: 32,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: "1.2em" }}> Terms & Conditions</h2>
              {logoError ? (
                <h4
                  style={{
                    paddingRight: 24,
                    textTransform: "uppercase",
                    fontSize: "0.5em",
                  }}
                >
                  {" "}
                  {props.brandName}
                </h4>
              ) : (
                <img
                  src={props.brandLogo}
                  alt="brand logo"
                  style={{
                    paddingRight: 24,
                    paddingTop: 12,
                    height: "auto",
                    width: "auto",
                    maxHeight: 60,
                    maxWidth: 60,
                    background: "#ffffba",
                  }}
                />
              )}
            </Box>
            <Divider sx={{ borderWidth: 2, background: props.coupon_color }} />
            <Box sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }} className="terms">
                  {parse(props.terms.replace("<p>&nbsp;</p>", ""))}

                  {/*-----------------  location --------------------------------- */}

                  {props.location && (
                    <div style={{ marginLeft: 12 }}>
                      <h4
                        style={{
                          margin: 0,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        <LocationOn
                          sx={{ width: 16, height: 16 }}
                          color="primary"
                        />
                        Locations:
                      </h4>
                      <p
                        style={{
                          marginTop: 0,
                          fontSize: ".8em",
                          marginLeft: 18,
                        }}
                      >
                        {" "}
                        {props.location}{" "}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Box>
            </Box>
          </Card>
        </DialogContent>
        <DialogActions>
          {/* <Button className="y-btn" onClick={handleClose} startIcon={<Check />}>Mark as Redeemed</Button> */}
          <Button
            className="p-btn"
            onClick={handleDownloadCoupon}
            startIcon={<Download />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
