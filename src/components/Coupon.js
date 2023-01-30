import { Button, CircularProgress } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { Slide } from "@mui/material";
import parse from 'html-react-parser';
import ComeBackLater from "./ComeBackLater";
import PageNotFound from "./PageNotFound";
import { useNavigate } from "react-router-dom";


function Coupon(props) {
    const navigate = useNavigate();
  


    //  COUPON STUFF _----------------------------------------
    const [couponData, SetCouponData] = useState(null);
    const [success, SetSuccess] = useState(false);
    const [apiError, SetApiError] = useState("");
    const [noCoupon, SetNoCoupon] = useState(false);
    let pathURL = process.env.REACT_APP_ENDPOINT;

    let called = false;



    const [flip, SetFlipState] = useState(false);
    const [loading, SetLoading] = useState(true);


    const handleCaptureClick = useCallback(async () => {
        const coupon1 = document.getElementById('cp-1');
        const backTerms = document.getElementById('cp-bck');
        const termsBtn = document.getElementById('terms-btn');
        const cpBacksBtn = document.getElementById('cp-bck-btn');
        const flip = document.getElementById('flipz');

        if (flip.classList.contains("flip")) {
            flip.classList.remove("flip");
        }

        termsBtn.style.display = 'none';
        cpBacksBtn.style.display = 'none';
        backTerms.classList.remove("back");
        const canvas = await html2canvas(coupon1, { useCORS: true, allowTaint: true });
        const dataURL = canvas.toDataURL('image/jpg');
        downloadjs(dataURL, 'Extraa Coupon.jpg', 'image/jpg');
        backTerms.classList.add("back");
        termsBtn.style.display = 'flex';
        cpBacksBtn.style.display = 'block';

    }, []);

    useEffect(() => {

        let modfd = props.formData;
        // console.log(modfd);
        // navigate('/user-home', { state: { couponNum: 1 } });

        if (!called) {
            fetch(pathURL + '/submit-feedBack', {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(modfd),

            })
                .then(data => {
                    called = true;
                    // console.log(data.json());
                    data.json().then(res => {
                        // console.log(res);
                        if (res.MESSAGE.success === 'true') {
                            SetSuccess(true);
                            if (res.MESSAGE.message === 'Coupon Details') {
                                // localStorage.setItem('token', res.parameters.access_token);
                           
                                navigate('/user-home', { state: { couponNum: res.MESSAGE.parameters.coupon_details.length } });
                                // let cdata = {};
                                // cdata.coupounBrandImage = res.parameters.coupon_details.logo;
                                // cdata.couponDetails = res.parameters.coupon_details.offer_details;
                                // cdata.validity = res.parameters.coupon_details.expiry_date;
                                // cdata.terms = res.parameters.coupon_details.terms_and_conditions;
                                // cdata.couponCode = res.parameters.coupon_details.coupon_code;
                                // cdata.brandColor = res.parameters.coupon_details.color_code;
                                // cdata.industryIcon = res.parameters.industry_detail.industry_logo;
                                // cdata.industry = res.parameters.industry_detail.industry_name;
                                // console.log("SEt Coupon")
                                // 
                                // SetCouponData(cdata);

                            } else {
                                let cdata = {};
                                cdata.coupounBrandImage = "";
                                cdata.couponDetails = "";
                                cdata.validity = "";
                                cdata.terms = "";
                                cdata.couponCode = "";
                                cdata.brandColor = "";
                                cdata.industryIcon = "";
                                cdata.industry = "";

                                SetCouponData(cdata);
                                SetNoCoupon(true);
                                // localStorage.setItem('token', res.parameters.access_token);
                                console.log("noCoupon")
                            }

                        } else {
                            let cdata = {};
                            cdata.coupounBrandImage = "";
                            cdata.couponDetails = "";
                            cdata.validity = "";
                            cdata.terms = "";
                            cdata.couponCode = "";
                            cdata.brandColor = "";
                            cdata.industryIcon = "";
                            cdata.industry = "";
                            console.log(res)

                            SetCouponData(cdata);
                        }
                        SetLoading(false);
                    })


                })
                .catch(err => {
                    called = true;
                    // Catch and display errors
                    SetLoading(false);
                    console.log(err);
                    SetApiError(err);

                });
        }
    }, []);



    return (
        <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loading == true ?
                <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    < CircularProgress />
                </div>
                :
                <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {!success && apiError === '' ? <ComeBackLater /> :
                        success && noCoupon === false ?
                            <Slide in direction="up" timeout={1000}>
                                <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>

                                    <div className={`coupon-container card ${flip ? 'flip' : ''}`} id="flipz">
                                        <div className="coupon-content" id="cp-1">
                                            <div className="coupon-details front" >
                                                <div className="coupon-row1">
                                                    <div className="coupon-industry">
                                                        <img src={couponData.industryIcon} alt="industry-icon" />
                                                        <p>{couponData.industry} </p>
                                                    </div>
                                                    <div className="coupon-logo">
                                                        <img src={couponData.coupounBrandImage} alt="logo" />
                                                    </div>

                                                </div>
                                                <div className="coupon-row2">
                                                    <div className="code-container">
                                                        <div className="coupon-code-container">

                                                            <p>Coupon Code</p>
                                                            <p className="coupon-code">{couponData.couponCode}</p>

                                                        </div>
                                                        <div className="validity">
                                                            Validity <span> {couponData.validity}</span>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="coupon-text-container" style={{
                                                    backgroundColor: couponData.brandColor,

                                                }}>
                                                    <div className="coupon-text" style={{ textAlign: 'center' }}>
                                                        {couponData.couponDetails}
                                                        <div className="terms-btn" id="terms-btn">
                                                            <Button variant="text" onClick={() => SetFlipState(!flip)}>Terms & Conditions</Button>
                                                        </div>
                                                        <div className="coupon-powered">
                                                            powered by <img src="./assets/extraa_logo.png" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="coupon-terms back" id="cp-bck">
                                                <div className="terms-logo"> <img src={couponData.coupounBrandImage} alt="" />
                                                    <p>Terms & Conditions</p>
                                                    <div className="back-btn" id="cp-bck-btn">
                                                        <IconButton style={{
                                                            position: 'absolute',
                                                            top: '1em',
                                                            left: '0.5em'
                                                        }}
                                                            onClick={() => SetFlipState(false)}
                                                            aria-label="back" component="label">
                                                            <ChevronLeft></ChevronLeft>
                                                        </IconButton>
                                                    </div>
                                                </div>
                                                <div className="terms-text">
                                                    {parse(couponData.terms)}
                                                </div>
                                            </div>
                                        </div >
                                        <div className="download-container" id="dwn-cp">
                                            <div className="download-coupon">
                                                <div className="download-text">
                                                    <p>Here's your Coupon! Use the download button to save your coupon.</p>
                                                </div>
                                                <div className="download-buttons">
                                                    <Button variant="contained" onClick={handleCaptureClick} endIcon={<Download />}>Download Coupon</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div >

                                </div>
                            </Slide>
                            : noCoupon && success ?
                                <div className="nocoupons" style={{

                                    textAlign: "center"
                                }
                                }>
                                    <img style={{ maxWidth: "200px" }} src="./assets/extraa_logo.png" alt="" />
                                    <h2>Sorry! There are no coupons available right now.</h2>
                                    <Button className='y-btn' endIcon={<ChevronRight />} onClick={() => navigate('/user-home')} fullWidth sx={{ marginTop: 4 }}> View your coupons</Button>

                                </div>
                                :


                                <PageNotFound message="Sorry. There seems to be have been an error." errorDetails={apiError.message} />

                    }
                </div>

            }

        </div>
    );
}

export default Coupon;