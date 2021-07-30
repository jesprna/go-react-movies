import React, { Component, Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { IMovie } from '../interfaces/movie';

interface IOneMovieProps{
    id: string
}

export const OneMovie = ()=> {
    const [movie, setMovie] = useState<IMovie>({})
    const [error, setError] = useState<any>(null);
    const {id} = useParams<IOneMovieProps>();


    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+ id)
        .then((response:any) =>{
            if (response.status !== 200){
                setError("Invalid response code: " + response.status)
            }else{
                setError(null)
            }
            return response.json()
        })
        .then((json)=>{
            setMovie(json.movie)
        })
    },[id]);

    if(movie.genres){
        movie.genres = Object.values(movie.genres)
   }else{
        movie.genres = []
   }

   if(error !== null){
    return <div>Error: {error}</div>
    }

    return (
        <Fragment>
            <div className="max-w-xl overflow-hidden rounded-lg shadow-lg">
                <div className="px-6 py-4">
                    <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">Movie: {movie.title}</h4>
                    <div>
                        <div className="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg" role="alert">
                            <p>Rating: {movie.mpaa_rating}</p>
                        </div>
                        <small><span className="mr-6"> Genres: </span>
                            {movie.genres.map((m:any, index:number)=>(
                            <span key={index}
                                className="mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded">{m}</span>
                            ))}
                        </small>
                    </div>
                    <h5 className="mb-3 text-md font-semibold tracking-tight text-gray-800">Runtime: {movie.runtime } minutes</h5>
                    <p className="leading-normal text-gray-700">{movie.description}</p>
                </div>
            </div>
        </Fragment>
    );
}
