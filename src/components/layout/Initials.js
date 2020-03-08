import React, { Fragment } from 'react'
import { useSelector } from "react-redux";
import ReactToolTip from 'react-tooltip'

const Initials = () => {
    const firstName = useSelector(state => state.userInfoReducer.firstName)
    const lastName = useSelector(state => state.userInfoReducer.lastName)

    return (
        <div id="userIDToolTip" style={{color: "pink"}}>
            {firstName && lastName ? `${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}` : ''}
            <ReactToolTip id="userIDToolTip" place="bottom">
                <p>You are logged in as: <br/>{firstName} {lastName}</p>
            </ReactToolTip>
        </div>
    )
}


export default Initials