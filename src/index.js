import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// import App from './App';
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Login from "./pages/Login";
import Otp from "./pages/Otp";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
// import Feedback from "./pages/Feedback";
import SmFeedback from "./pages/SmFeedback";
import PageNotFound from "./components/PageNotFound";
// import UserForm from './components/UserForm';
import SignUp from "./pages/SignUp";
import PromoBox from "./pages/PromoBox";
import Survey from "./pages/Survey";
import CustomSurvey from "./pages/CustomSurvey";

const client = new ApolloClient({
  uri: "https://backend.extraa.in/v1/graphql",
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#4F3084",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#F9B61F",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <Router basename={process.env.PUBLIC_URL}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/verify-otp" element={<Otp />} />
            <Route path="/user-home" element={<Home />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/user-signup" element={<SignUp />} />
            <Route path="qr/:qr_code" element={<SmFeedback />} />
            <Route path="sm/:qr_code" element={<SmFeedback />} />
            <Route path="p/:box_url" element={<PromoBox />} />
            <Route path="sv/:survey_url" element={<Survey />} />
            <Route path="csv/:survey_url" element={<CustomSurvey />} />
            <Route
              path="*"
              element={<PageNotFound message="Oops.. We can't find that" />}
            />
            {/* <Route path="*" element={<PageNotFound message="Oops.. We can't find that" />} /> */}
          </Routes>
        </Provider>
      </ThemeProvider>
    </Router>
  </ApolloProvider>
  /* </React.StrictMode> */
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
