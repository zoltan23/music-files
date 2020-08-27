import React, { useState } from 'react'

export default function DropDown({ dropArr, name, onUpdateInput, placeholder }) {

    console.log('placeholder', placeholder)

    const [experience, setExperience] = useState(dropArr[dropArr.indexOf(placeholder)])
    const [isInputValid, setIsInputValid] = useState(null)

    const setExperienceLevel = (num) => {
        onUpdateInput(dropArr[num], name)
        setExperience(dropArr[num])
        setIsInputValid(num >= 1)
    }

    const getValidString = (stateBool) => {
        if (stateBool === null)
            return "form-control"
        return stateBool ? "form-control is-valid" : "form-control is-invalid"
    }

    const dropDown = (arr) => {
        return (
            <>
                {arr.map((exp, index) =>
                    <a className="dropdown-item" href="#!" onClick={e => setExperienceLevel(index)}>{exp}</a>)}
            </>
        )
    }

    return (
        <div className="dropdown">
            <button name={name} className={`btn btn-primary dropdown-toggle w-100 ${getValidString(isInputValid)}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {experience}
            </button>
            <div className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                {dropArr ? dropDown(dropArr) : 'null'}
            </div>
        </div>
    )
}
