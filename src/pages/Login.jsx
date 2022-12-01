
import { WhatsApp, ChevronRightRounded } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment'
import { Button, Stack } from "@mui/material";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login(props) {



    const navigate = useNavigate();
    const [phNum, SetphNum] = useState('');
    const [errMsg, SetErrMsg] = useState('');
    const handleChange = (event) => {
        SetphNum(event.target.value);
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/user-home");
        }
    }, []);



    function handleSubmit(num) {

        // navigate("/verify-otp");

        const formData = new FormData();
        formData.append('phone_number', num);



        axios.post('https://extraa.in/go-api/public/api/check-login', formData)
            .then(response => {
                console.log(response.data)
                if (response.data.RESULT) {
                    navigate("/verify-otp", { state: { phone_number: num } });
                } else {
                    SetErrMsg(response)
                }

            })
            .catch(err => {
                SetErrMsg(err.code)
            });
    }

    return (
        <div className="user-login">



            <Stack alignItems={"center"} pt={24}>

                <img src="./assets/extraa_logo.png" alt="" className="home-logo" style={{
                    width: "200px"
                }} />


                <ValidatorForm
                    onSubmit={() => handleSubmit(phNum)}

                >
                    <TextValidator
                        label="Whatsapp Number*"
                        onChange={handleChange}
                        variant='filled'
                        name="phNum"
                        type="tel"
                        value={phNum}
                        validators={['required', 'isNumber', 'matchRegexp:^[0-9]{10}$']}
                        errorMessages={['This field is required', 'Please enter a vaild number', 'Please enter a vaild number']}
                        sx={{
                            backgroundColor: '#ffffff',
                            '& .MuiInputBase-root': {
                                backgroundColor: '#ffffff'
                            }
                        }} InputProps={{
                            inputMode: 'numeric', pattern: '[0-9]*',
                            startAdornment: (
                                <InputAdornment position="start">
                                    <WhatsApp />
                                </InputAdornment>
                            ),
                        }} style={{ marginTop: '2em' }}
                    />

                    {errMsg && <p style={{ color: 'red', marginBottom: 0, textAlign: 'center' }}> Sorry, something went wrong 😞. <br /> {errMsg} </p>}
                    <Button style={{ marginTop: '2em' }} className="p-btn" type="submit" fullWidth variant='contained' endIcon={<ChevronRightRounded />}>Get OTP</Button>
                </ValidatorForm>


            </Stack>
        </div>
    );
}

export default Login;