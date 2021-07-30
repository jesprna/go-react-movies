import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { IMovie } from '../interfaces/movie';

interface IOneMovieProps{
    id: string,
}
export const OneGenre = ()=>{
    let [movies, setMovies] = useState<IMovie[]>([])
    const [error, setError] = useState<any>(null)
    const location = useLocation()
    const [genreName, setGenreName] = useState<string>("")
    const {id} = useParams<IOneMovieProps>()

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies/`+id)
            .then((response:any) =>{
                if (response.status !== 200){
                    setError("Invalid response code: " + response.status)
                }else{
                    setError(null)
                }
                return response.json()
            })
            .then((json)=>{
                setMovies(json.movies);
                // @ts-ignore
                setGenreName(location.genreName)
            })
    },[id, location])
    
    if (!movies){
        movies = []
    }

    if(error !== null){
        return <div>Error: {error}</div>
    }
    return (
        <Fragment>
            <h2 className=" text-xl sm:block ml-2">Genre: {genreName}</h2>
            <div className="flex p-3">
                {movies.map((m:any)=>(
                <Link key={m.id} to={`/movies/${m.id}`}>
                <div className="max-w-xs overflow-hidden rounded-lg shadow-lg">
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