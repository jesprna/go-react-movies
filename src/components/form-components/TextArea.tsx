
import React from "react";

interface ITextAreaProps {
    name: string,
    title: string,
    value?: any,
    rows?: number,
    placeholder?:string,
    customClass?: string,
    handleChange?: (evt:any)=>void
}

const Textarea:React.FC<ITextAreaProps> = ({handleChange, name, title, rows, value, placeholder, customClass}) => {
    return (
        <div className={`w-full ${customClass}`}>
        <label className="block mb-1 font-bold"  htmlFor={name}    >{title}</label>
        <textarea onChange={handleChange} value={value}  placeholder={placeholder} 
        className="w-full h-16 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline" 
        id={name} 
        name={name}
        rows={rows? rows : 3}/>
      </div>
    );
}

export default Textarea