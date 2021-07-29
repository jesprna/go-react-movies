import React, { Component, Fragment } from 'react'
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

export default class Login extends React.Component<ILoginProps, ILoginState>{
    constructor(props: ILoginProps){
        super(props)
        
        this.state = {
            email: "",
            password: "",
            error: null,
            errors: [],
            alert : {
                type:"hidden",
                message: ""
            }
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange = (evt:any)=>{
        // @ts-ignore
        let value = evt.target.value
         // @ts-ignore
        let name = evt.target.name
        this.setState((prevState) =>({
            ...prevState,
            [name]: value
        }))
    }

    handleSubmit = (evt:any) => {
        evt.preventDefault();
        
        
        // client side validation
        let errors = [];
        if(this.state.email === ""){
            errors.push("email")
        }
        if(this.state.password === ""){
            errors.push("password")
        }
        this.setState({errors:errors})

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
                    this.setState({alert:{type:"red", message: data.error.message}})
                }else{
                    // @ts-ignore
                    this.handleJWTChange(Object.values(data)[0]);
                    window.localStorage.setItem("jwt",JSON.stringify(Object.values(data)[0]))
                      // @ts-ignore
                    this.props.history.push({
                        pathname: "/admin"
                    })
                }
            })

    }

    handleJWTChange(jwt:string){
        this.props.handleJWTChange(jwt);
        
    }

    hasError(key:any){
        return this.state.errors.indexOf(key) !== -1;
    }

    render(){
        return (
            <Fragment>
                <h2>Login</h2>
                <hr />
                <Alert alertMessage={this.state.alert.message} alertType={this.state.alert.type} />

                <form onSubmit={this.handleSubmit} className="space-y-4 text-gray-700">
                    <div className="flex flex-wrap">
                        <Input customClass="px-2" name={`email`} title={`Email`} type="email"  placeholder="Email"
                        handleChange={this.handleChange} className={this.hasError("email") ? "border-red-700": ""} errorDiv={this.hasError("email") ? "text-red-700": "hidden"}
                        errorMsg={"Please enter a email"}
                        />
                    </div>

                    <div className="flex flex-wrap">
                        <Input customClass="px-2" name={`password`} title={`Password`} type="password"  placeholder="Password"
                        handleChange={this.handleChange} className={this.hasError("password") ? "border-red-700": ""} errorDiv={this.hasError("email") ? "text-red-700": "hidden"}
                        errorMsg={"Please enter a password"}
                        />
                    </div>
                    <hr />
                    <button className="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800">Login</button>
                </form>
            </Fragment>
        );
    }
}