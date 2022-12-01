import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './pages/Login';
import Otp from './pages/Otp';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import Feedback from './pages/Feedback';
import PageNotFound from './components/PageNotFound'
import UserForm from './components/UserForm';
import SignUp from './pages/SignUp';


const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4F3084',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#F9B61F',
    }


  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Router basename={process.env.PUBLIC_URL}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/verify-otp" element={<Otp />} />
          <Route path="/user-home" element={<Home />} />
          <Route path="/user-profile" element={<Profile />} />
          <Route path="/user-signup" element={<SignUp />} />
          <Route path="/:branch_id" element={<Feedback />} />

          <Route path="*" element={<PageNotFound message="Oops.. We can't find that" />} />
          {/* <Route path="*" element={<PageNotFound message="Oops.. We can't find that" />} /> */}
        </Routes>
      </Provider>
    </ThemeProvider>
  </Router>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
