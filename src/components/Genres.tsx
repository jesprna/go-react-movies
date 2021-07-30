import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

export const Genres = ()=> {
    const [genres, setGenres] = useState<any>([])
    const [error, setError] = useState<any>(null)

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
        // .then((response) =>response.json())
        .then((response:any) =>{
            if (response.status !== 200){
                setError("Invalid response code: " + response.status)
            }else{
                setError(null)
            }
            return response.json()
        })
        .then((json)=>{
            setGenres(json.genres)
        })
    }, []);
    if(error !== null){
        return <div>Error: {error}</div>
    }
    return (
        <Fragment>
            <h2>Genres</h2>
            {genres.map((m:any, index:number)=>(
            <Link key={index} to={{
                                    // @ts-ignore
                                   pathname: `/genres/${m.id}`, genreName: m.genre_name
                                }}>
            <span
                className="mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded">{//@ts-ignore
                m.genre_name}</span>
            </Link>

            ))}
        </Fragment>
    );
}