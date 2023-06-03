/** @jsxImportSource @emotion/react */
import LinearProgress from '@mui/material/LinearProgress';
import { css } from '@emotion/react'


function Footer(props) {
    return (
        <div className='footer' css={css`
            position:absolute;
            width:100%;
            bottom:0;
        `}>
            {props.FooterContent &&
                <div>

                    <div className="powered">powered by
                        <img src="../assets/extraa_logo.png" alt="" />
                    </div>
                    {props.Counter ?

                        <div style={{ textAlign: 'center' }}>
                            {props.Questions > 1 ?
                                <span>
                                    {props.Questions} questions left
                                </span>
                                :
                                <span>
                                    Almost there!
                                </span>
                            }

                        </div>

                        :
                        <div style={{ textAlign: 'center' }}> Your coupon is just <span>{props.Questions}</span> taps away!</div>
                    }
                </div>}
            {props.progress <= 100 &&
                <LinearProgress
                    sx={{
                        height: 10,
                        backgroundColor: 'white',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#4F3084'
                        }
                    }}
                    variant="determinate" value={props.progress} />
            }
        </div>
    );
}

export default Footer;