
export default function PageNotFound(props) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            paddingRight: "1em",
            paddingLeft: "1em"
        }}>

            <img style={{
                maxWidth: "800px"
            }} src="./assets/404.svg" alt="" />
            <h2>{props.message}</h2>
            {props.errorDetails &&
                <p> {props.errorDetails}</p> 
            }
        </div>


    );
}