import React from "react";

interface IInputProps {
    name: string,
    title: string,
    value?: any,
    type: string,
    placeholder?:string,
    customClass?: string,
    errorDiv?: string,
    className?: string,
    errorMsg?: string,
    handleChange?: (evt:any)=>void
}

const Input:React.FC<IInputProps> = ({handleChange, name, title, type, value, placeholder, customClass, errorDiv, errorMsg, className}) => {
    return (
        <div className={`w-full ${customClass}`}>
        <label className="block mb-1 font-bold" htmlFor={name}   >{title}</label>
        <input onChange={handleChange} 
            className={`w-full h-10 px-3 text-base placeholder-gray-600 border ${className} rounded-lg focus:shadow-outline`} 
            type={type} 
            id={name} 
            name={name}
            placeholder={placeholder}
            value={value}/>

            <span className={`text-md ${errorDiv}`} id={`${name}-help`}>{errorMsg}</span>
        </div>
    );
}

export default Input