import React from 'react'


export interface IOption {
    id: any,
    value:any

}

interface ISelectProps {
    name: string,
    title: string,
    value?: any,
    options: IOption[],
    placeholder?: string,
    customClass?: string,
    handleChange?: (evt:any) => void
}

const Select:React.FC<ISelectProps> = ({customClass,handleChange, name, title, value, placeholder, options}) =>{
    return (
        <div className={`w-full ${customClass}`}>
        <label className="block mb-1  font-bold" htmlFor={name}  >{" "} {title}{" "} </label>
        <select onChange={handleChange} value={value} name={name} id={name} 
            className="w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:shadow-outline" placeholder="Regular input">
          <option >{placeholder}</option>
        {options.map((option:IOption)=>{
            return (
                <option key={option.id} value={option.value} label={option.value}> {option.value}</option>
            )
        })}
      </select>
      </div>
    );

}
export default Select;