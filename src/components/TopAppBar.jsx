import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ChevronLeft } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function TopAppBar(props) {
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event) => {
    navigate("/user-profile");
  };

  const menuId = "primary-search-account-menu";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={0}
        position="static"
        style={{ backgroundColor: "#F9B61F", color: "#4F3084" }}
      >
        <Toolbar>
          {!props.home ? (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => navigate("/user-home")}
            >
              <ChevronLeft />
            </IconButton>
          ) : (
            <Box sx={{ width: 52 }}></Box>
          )}

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <img
              src="./assets/extraa_logo.png"
              alt=""
              className="appbar-logo"
              style={{
                height: "42px",
                paddingRight: 16,
              }}
            />
          </Box>
          <Box sx={{ display: "flex" }}>
            {/* <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
