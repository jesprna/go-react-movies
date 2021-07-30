import React, {  Fragment, useEffect, useState } from 'react'
import { IMovie } from '../interfaces/movie'
import Input from '../components/form-components/Input'
import Textarea from '../components/form-components/TextArea'
import Select from '../components/form-components/Select'
import {IOption} from '../components/form-components/Select'
import Alert from '../components/ui-components/Alert'
import { Link, useHistory, useParams } from 'react-router-dom'
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

interface IEditMovieParams {
    id: string,
}

export interface IEditMovieProps {
    id: string,
    jwt: string,
}

export const EditMovie:React.FC<IEditMovieProps> = ({jwt})=>{
    const [movie, setMovie] = useState<IMovie>({id:0});
    const [error, setError] = useState<any>(null);
    const [errors, setErrors] = useState<any[]>([]);
    const [alert, setAlert] =useState<IAlert>({type:"hidden", message:""})
    const {id} = useParams<IEditMovieParams>();
    let history = useHistory();
    const mpaaOptions = [
        {id: "G", value: "G"},
        {id: "PG", value: "PG"},
        {id: "PG13", value: "PG13"},
        {id: "R", value: "R"},
        {id: "NC17", value: "NC17"},
    ];

    

    useEffect(()=>{
        if (jwt === ""){
           history.push({ pathname: "/login"})
            return
        }
        if (+id > 0){
            fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+ id)
            .then((response:any) =>{
                if (response.status !== 200){
                    setError("Invalid response code: "+ response.status)
                }else{
                    setError(null)
                }
                return response.json()
            })
            .then((json)=>{
                const releaseDate= new Date(json.movie.release_date)
                setMovie({
                    id:+id,
                    title: json.movie.title,
                    release_date: releaseDate.toISOString().split("T")[0],
                    runtime: json.movie.runtime,
                    rating: json.movie.rating,
                    mpaa_rating: json.movie.mpaa_rating,
                    description: json.movie.description,
                })
            })
           }

    }, [jwt,history, id])

    const handleChange =(evt:any) => {
        let value = evt.target.value;
        let name = evt.target.name;
        setMovie({
            ...movie,
            [name]: value
        })
    }

    const handleSubmit = (evt:any) => {
        evt.preventDefault()

        // client side validation
        if(movie.title === ""){
            errors.push("title")
        }
        setErrors(errors)
        if (errors.length > 0){
            return false
        }



        const data = new FormData(evt.target)
        const payload  = Object.fromEntries(data.entries());
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append("Authorization", "Bearer "+ jwt)

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: myHeaders,
        }

        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
            .then((response) => response.json())
            .then((data:any)=>{
               if (data.error){
                   setAlert({type: "red",message: data.error.message})
               }else{
                    setAlert({type: "green",message: "Changes saved."})
                    history.push({pathname: "/admin"})
               }
            })
    }

    const confirmDelete = (e:any) =>{
        confirmAlert({
            title: 'Delete Movie',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    const myHeaders = new Headers()
                    myHeaders.append("Content-Type", "application/json")
                    myHeaders.append("Authorization", "Bearer "+ jwt)
                    fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/`+movie.id, {
                        method: "GET",
                        headers: myHeaders,
                    }).then((response)=> response.json())
                    .then((data)=>{
                        if (data.error){
                            setAlert({type: "red", message: data.error.message})
                        }else{
                            setAlert({type: "green",message: "Movie deleted."})
                            history.push({pathname: "/admin"})
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

    const hasError=(key:any)=>{
        return errors.indexOf(key) !== -1
    }

    if (error !== null) {
        return <div>Error: { error}</div>
    }

    return (
        <Fragment>
            <h2 className="text-md">Add/Edit Movie</h2>
            <Alert alertType={alert.type} alertMessage={alert.message} />
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
                <input type="hidden" name="id" id="id" value={movie?.id } onChange={handleChange} />
                <div className="flex flex-wrap">
                    <Input customClass="px-2" name={`title`} title={`Title`} type="text" value={movie?.title}
                        handleChange={handleChange} className={hasError("title") ? "border-red-700" : "" }
                        errorDiv={hasError("title") ? "text-red-700" : "hidden" } errorMsg={"Please enter a title"} />
                </div>

                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    <Input customClass="px-2 md:w-1/2" name={`release_date`} title={`Release Date`} type="date"
                        value={movie?.release_date} handleChange={handleChange} />
                    <Input customClass="px-2 md:w-1/2" name={`runtime`} title={`Runtime`} type="text"
                        value={movie?.runtime} handleChange={handleChange} />
                </div>

                <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
                    <Select customClass="px-2 md:w-1/2" name={`mpaa_rating`} title={`MPAA Rating`} placeholder="Choose"
                        value={movie?.mpaa_rating} handleChange={handleChange} options={mpaaOptions} />
                    <Input customClass="px-2 md:w-1/2" name={`rating`} title={`Rating`} type="text"
                        value={movie?.rating} handleChange={handleChange} />
                </div>

                <div className="flex flex-wrap">
                    <Textarea customClass="px-2" name={`description`} title={`Description`} rows={3}
                        value={movie?.description} handleChange={handleChange} />
                    </div>
 <hr />
    
    <button className="h-10 px-5 m-2 text-green-100 transition-colors duration-150 bg-green-700 rounded-lg focus:shadow-outline hover:bg-green-800">Save</button>
    <Link to={`/admin`}>
        <button className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-b;ue-800">Cancel</button>
    </Link>
    { movie?.id !== undefined && movie?.id > 0 && (
          <button onClick={()=> confirmDelete('e')} type="button" className="h-10 px-5 m-2 text-red-100 transition-colors duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800">Delete</button>
    ) }
  
    
  </form>


<div className="mt-3">
    <pre>{JSON.stringify(movie, null, 3)}</pre>
</div>
           </Fragment>
    )
}


