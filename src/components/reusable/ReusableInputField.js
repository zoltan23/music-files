import React, { useState } from 'react'

export default function ReusableInputField(props) {

    const [isInputValid, setIsInputValid] = useState(null)

    const getInput = (e) => {
        props.onUpdateInput(e.target.value, props.name)
        e.target.value.length > 0 ? setIsInputValid(true) : setIsInputValid(false)
        }

    const getValidString = (stateBool) => {
        if (stateBool === null)
            return "form-control"
        return stateBool ? "form-control is-valid" : "form-control is-invalid"
    }

    return (
        <div>
            <label for={props.for}>{props.label}</label>
            <input type={props.text} name={props.name} value={props.value} className={getValidString(isInputValid)} placeholder={props.placeholder} onChange={getInput} />
            <div className="invalid-feedback">
                Please provide a valid {props.label.toLowerCase()}.
            </div>
        </div>
    )
}