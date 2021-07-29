import React, {  Fragment } from 'react'
import { IMovie } from '../interfaces/movie'
import Input from '../components/form-components/Input'
import Textarea from '../components/form-components/TextArea'
import Select from '../components/form-components/Select'
import {IOption} from '../components/form-components/Select'
import Alert from '../components/ui-components/Alert'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export interface IAlert {
    type: string,
    message: string
}

interface IState{
    movie: IMovie,
    isLoaded: boolean,
    error:any,
    errors: any[],
    alert: IAlert,
    mpaaOptions :IOption[],
}

export interface IEditMovieProps {
    jwt: string
}


export default class EditMovie extends React.Component<IEditMovieProps ,IState>{
    constructor(props: IEditMovieProps){
        super(props)
        this.state = {
            movie :{
                id: 0,
                title: "",
                release_date: "",
                runtime: 0,
                mpaa_rating: "",
                rating: 0,
                description: ""
            },
            isLoaded: false,
            error: null,
            errors: [],
            alert:{
                type: "hidden",
                message: ""
            },
            mpaaOptions :[
                {id: "G", value: "G"},
                {id: "PG", value: "PG"},
                {id: "PG13", value: "PG13"},
                {id: "R", value: "R"},
                {id: "NC17", value: "NC17"},
            ],
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    

    handleSubmit =  (evt:any) => {
        evt.preventDefault()

        // client side validation
        let errors = [];
        if(this.state.movie.title === ""){
            errors.push("title")
        }
        this.setState({errors:errors})

        if (errors.length > 0){
            return false
        }


        const data = new FormData(evt.target)
        const payload  = Object.fromEntries(data.entries());
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append("Authorization", "Bearer "+ this.props.jwt)

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
            .then((response) => response.json())
            .then((data:any)=>{
               if (data.error){
                   this.setState({
                       alert:{
                           type: "red",
                           message: data.error.message
                       }
                   })
               }else{
                this.setState({
                    alert:{
                        type: "green",
                        message: "Changes saved."
                    }
                });
                 // @ts-ignore
                 this.props.history.push({
                    pathname: "/admin"
                })
               }
            })
    }

    handleChange =  (evt:any) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState:any) =>({
            movie:{
                ...prevState.movie,
                [name]: value
            }
        }));
    }

    hasError(key:any){
        return this.state.errors.indexOf(key) !== -1
    }

    confirmDelete = (e:any) =>{
        confirmAlert({
            title: 'Delete Movie',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const myHeaders = new Headers()
                    myHeaders.append("Content-Type", "application/json")
                    myHeaders.append("Authorization", "Bearer "+ this.props.jwt)
                    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/`+this.state.movie.id, {
                        method: "GET",
                        headers: myHeaders,
                    }).then((response)=> response.json())
                    .then((data)=>{
                        if (data.error){
                            this.setState({alert:{type: "red", message: data.error.message}})
                        }else{
                            // @ts-ignore
                            this.props.history.push({
                                pathname: "/admin"
                            })
                        }
                    })
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
        
    }



    componentDidMount(){
        if (this.props.jwt === ""){
            // @ts-ignore
            this.props.history.push({
                pathname: "/login"
            })
            return
        }
        // @ts-ignore
       const id = this.props.match.params.id
       if (id > 0){
        fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+ id)
        .then((response:any) =>{
            if (response.status !== '200'){
                let err:any = Error;
                err.message= "Invalid response code: " + response.status
                this.setState({error: err})
            }
            return response.json()
        })
        .then((json)=>{
            const releaseDate= new Date(json.movie.release_date)
            this.setState({
                //@ts-ignore
                movie: {
                    id:id,
                    title: json.movie.title,
                    release_date: releaseDate.toISOString().split("T")[0],
                    runtime: json.movie.runtime,
                    rating: json.movie.rating,
                    mpaa_rating: json.movie.mpaa_rating,
                    description: json.movie.description,

                },
                isLoaded:true
            }, 
            //@ts-ignore
            (error) => {
                this.setState({
                    isLoaded:true,
                    error
                })
            })
        })
       }else{
        this.setState({
            isLoaded:true,
        })
       }
    }
   


    render(){
       
        let {movie, mpaaOptions, isLoaded, error} = this.state
        if (error) {
            return <div>Error: {
                 //@ts-ignore
                error.message
                }</div>
        }
        if(!isLoaded){
            return <p>Loading...</p>
        }
        return(
           <Fragment>
               <h2 className="text-md">Add/Edit Movie</h2>
               <Alert alertType={this.state.alert.type} alertMessage={this.state.alert.message} />
               <form onSubmit={this.handleSubmit} className="space-y-4 text-gray-700">
                   <input type="hidden" name="id" id="id" value={movie?.id} onChange={this.handleChange} />
  <div className="flex flex-wrap">
    <Input customClass="px-2" name={`title`} title={`Title`} type="text" value={movie?.title} 
    handleChange={this.handleChange} className={this.hasError("title") ? "border-red-700": ""} errorDiv={this.hasError("title") ? "text-red-700": "hidden"}
    errorMsg={"Please enter a title"}
    />
  </div>

  <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
    <Input customClass="px-2 md:w-1/2" name={`release_date`} title={`Release Date`} type="date" value={movie?.release_date} handleChange={this.handleChange} />
    <Input customClass="px-2 md:w-1/2" name={`runtime`} title={`Runtime`} type="text" value={movie?.runtime} handleChange={this.handleChange} />
  </div>

  <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
    <Select customClass="px-2 md:w-1/2" name={`mpaa_rating`} title={`MPAA Rating`} placeholder="Choose" value={movie?.mpaa_rating} handleChange={this.handleChange} options={mpaaOptions} />
    <Input customClass="px-2 md:w-1/2" name={`rating`} title={`Rating`} type="text" value={movie?.rating} handleChange={this.handleChange} />
  </div>

  <div className="flex flex-wrap">
        <Textarea customClass="px-2" name={`description`} title={`Description`} rows={3} value={movie?.description} handleChange={this.handleChange} />
  </div>
 <hr />
    
    <button className="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 rounded-lg focus:shadow-outline hover:bg-green-800">Save</button>
    <Link to={`/admin`}>
        <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-b;ue-800">Cancel</button>
    </Link>
    { movie?.id !== undefined && movie?.id > 0 && (
          <button onClick={()=> this.confirmDelete('e')} type="button" className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800">Delete</button>
    ) }
  
    
  </form>


{/* <div className="mt-3">
    <pre>{JSON.stringify(this.state, null, 3)}</pre>
</div> */}
           </Fragment>
        )
    }
}