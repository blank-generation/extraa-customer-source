/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, SetMealOutlined } from '@mui/icons-material';
import { decremented } from '../store/store';
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';


function Header(props) {
    const dispatch = useDispatch();

    const pageIndex = useSelector((state) => state.pageIndex);
    const decrement = () => {
        dispatch(decremented());
    }

    const [imgError, SetImgError] = useState(false);

    function handleImgError() {
        const headerImg = document.getElementById('hlogo');
        headerImg.style.display = 'none';
        SetImgError(true);
    }


    return (
        <div className="logo-container" css={css`
        background-color: white;`}>
            {imgError ? 
            
            <div css={css`
            padding: 1em;
            text-align: center;
            font-size:1.6em;
            font-family:rota-bold;
            `} >{props.brand_name} </div> 
            
            : 
            
            <img css={css`
            padding: 1em;
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-height: 100px;
            `}
                src={props.logo} alt={props.brand_name} onError={handleImgError} id="hlogo" />}

            {pageIndex > 0 &&
                <IconButton css={css`
            position:absolute;
            top:1em;
            left:0.5em;
            `}
                    onClick={decrement}
                    aria-label="back" component="label">
                    <ChevronLeft></ChevronLeft>
                </IconButton>}

        </div>);
}

export default Header;