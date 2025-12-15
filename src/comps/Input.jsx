import React from 'react'

const Input = ({label,required,placeholder,type,value,name,onChange,onBlur}) => {
  return (
    <>
         <div className="flex flex-col w-full">
        <label
          htmlFor={name}
          className="text-[0.85rem] font-medium ml-2 !text-yellow-600 flex items-center gap-1"
        >
          {label} {required && <span className="!text-red-500">*</span>}
        </label>
        <input
          id={name}
          placeholder={placeholder || ""}
          type={type || "text"}
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(e)}
          onBlur={onBlur}
          required={required}
        />
      </div>
    </>
  )
}

export default Input
