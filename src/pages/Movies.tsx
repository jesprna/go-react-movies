import React, { useEffect, useState, Component, Fragment} from 'react'
import { Link } from 'react-router-dom';
import { IMovie } from '../interfaces/movie';


export const Movies = () =>{

    const [movies, setMovies] = useState<IMovie[]>([]);
    const [error, setError] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
        .then((response:any) =>{
            if (response.status !== 200){
                setError("Invalid response code: "+ response.status)
            }else{
                setError(null)
            }
            return response.json()
        })
        .then((json)=>{
            setMovies(json.movies);
            setIsLoaded(true);
        })
    }, [])
    
    if (error !== null) {
        return <div>Error: { error}</div>
    }else{
        if(!isLoaded){
            return <p>Loading...</p>
        }
        return (
            <Fragment>
            <h2 className=" text-xl sm:block ml-2">Choose a movie</h2>
            <div className="flex p-3">
            {movies.map((m:any)=>(
                 <Link key={m.id} to={`/movies/${m.id}`} >
                <div  className="max-w-xs overflow-hidden rounded-lg shadow-lg h-48 mr-4">
                <div className="px-6 py-4">
                  <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">{m.title}</h4>
                  <p className="leading-normal text-gray-700">{m.description}</p>
                </div>
              </div>
              </Link>
            ))}
            </div>
        </Fragment>
        );
    }
    
    
}



