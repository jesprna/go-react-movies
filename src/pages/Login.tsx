import React, { Component, useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import Input from '../components/form-components/Input'
import Alert from '../components/ui-components/Alert'
import { IAlert } from './EditMovie'



export interface ILoginProps {
    handleJWTChange: (jwt:any) => void
}

interface ILoginState{
    email: string,
    password: string,
    error: any,
    errors: any[],
    alert : IAlert,
}

export const Login:React.FC<ILoginProps> = ({handleJWTChange}) =>{
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [errors, setErrors] = useState<any[]>([])
    const [alert, setAlert] = useState<IAlert>({type:"hidden", message:""});
    const history = useHistory();


    const handleSubmit = (evt:any) => {
        evt.preventDefault();
        // client side validation
        if(email === ""){
            errors.push("email")
        }
        if(password === ""){
            errors.push("password")
        }
        setErrors(errors)
        if (errors.length > 0){
            return false
        }
        const data = new FormData(evt.target)
        const payload = Object.fromEntries(data.entries())
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(payload)
        }
        fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, requestOptions)
            .then((response)=>response.json())
            .then((data)=>{
                if (data.error){
                   setAlert({type:"red", message: data.error.message})
                }else{
                    handleJWTChange(Object.values(data)[0]);
                    window.localStorage.setItem("jwt",JSON.stringify(Object.values(data)[0]))
                   history.push({pathname: "/admin"})
                }
            })

    }

    const hasError =(key:any) =>{
        return errors.indexOf(key) !== -1;
    }

    const handleEmail = (evt:any)=> {
        setEmail(evt.target.value)
    }

    const handlePassword = (evt:any)=> {
        setPassword(evt.target.value)
    }

    return (
        <Fragment>
            <h2>Login</h2>
            <hr />
            <Alert alertMessage={alert.message} alertType={alert.type} />
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                <div className="flex flex-wrap">
                    <Input customClass="px-2" name={`email`} title={`Email`} type="email" placeholder="Email"
                        handleChange={handleEmail} className={hasError("email") ? "border-red-700" : "" }
                        errorDiv={hasError("email") ? "text-red-700" : "hidden" } errorMsg={"Please enter a email"} />
                </div>
                <div className="flex flex-wrap">
                    <Input customClass="px-2" name={`password`} title={`Password`} type="password"
                        placeholder="Password" handleChange={handlePassword} className={hasError("password")
                        ? "border-red-700" : "" } errorDiv={hasError("email") ? "text-red-700" : "hidden" }
                        errorMsg={"Please enter a password"} />
                </div>
                <hr />
                <button
                    className="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800">Login</button>
            </form>
        </Fragment>
    );
}

