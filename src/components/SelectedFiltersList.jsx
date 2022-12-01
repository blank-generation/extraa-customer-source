import { useState, useEffect } from "react"

export default function SeletedFiltersList(props) {
    const [sindustries, SetSIndutries] = useState([]);

   
    useEffect(() => {
        SetSIndutries(props.selectedIndustries);
        console.log('calleme')
    }, [JSON.stringify(props.selectedIndustries)]);


    return (

        <div>
            <p style={{ textAlign: 'left', textTransform: 'capitalize', fontSize: '0.8em', paddingLeft: 24, marginBottom: 0, opacity: sindustries.length > 0 ? 1 : 0, transition: '0.4s' }}>
                Filters:
                {sindustries.length > 0 &&
                    <span>
                        {
                            sindustries.map((selInd, index) => (

                                <span key={selInd}>
                                    {(index === 0 ? ' ' : ', ') + props.industries.find((e) => e.id === selInd).industry_name.toLowerCase().replace('and', '&')}
                                </span>
                            ))

                        }</span>}</p>
            {/* <Chip label="Clear Filters" onDelete={handleClearFilter} /> */}
        </div>
    )
}