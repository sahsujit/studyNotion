import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"


const RequirementsField = ({
    name,
    label,
    register,
    setValue,
    errors,
    getValues,
}) => {

    const [requirement, setRequirement] = useState("");
    const { editCourse, course } = useSelector((state) => state.course)

    const [requirementsList, setRequirementsList] = useState([]);

    useEffect(() => {
        if (editCourse) {
          setRequirementsList(course?.instructions)
        }
        register(name, { required: true, validate: (value) => value.length > 0 })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    
      useEffect(() => {
        setValue(name, requirementsList)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [requirementsList])

    const handleAddRequirement = ()=>{
        if(requirement){
            setRequirementsList([...requirementsList, requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index)=>{
        const list = [...requirementsList];
        list.splice(index, 1);
        setRequirementsList(list);

    }

  return (
    <div className="flex flex-col space-y-2">
  <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      <div className="flex flex-col items-start space-y-2">
        <input
        id={name}
        name={name}
        type="text"
        onChange={(e)=>setRequirement(e.target.value)}
        value={requirement}
        style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full form-style rounded-[0.5rem] bg-richblack-800 p-[12px] text-richblack-5"
        />
         <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {
        requirementsList.length > 0 && (
            <ul className="mt-2 list-inside list-disc">
                {
                requirementsList.map((requirement, index)=>(
                    <li key={index} className="flex items-center text-richblack-5">
                    <span>{requirement}</span>
                    <button
                      type="button"
                      className="ml-2 text-xs text-pure-greys-300 "
                      onClick={() => handleRemoveRequirement(index)}
                    >
                      clear
                    </button>
                  </li>
                ))
                }
            </ul>
        )
      }
        {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}

export default RequirementsField