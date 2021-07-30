import React, { useEffect, Component , useState, Fragment } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { IMovie } from '../interfaces/movie';


export interface IAdminProps {
    jwt: string
}

interface IAdminState{
    movies: IMovie[],
    isLoaded: boolean,
    error: any,
}

export const Admin:React.FC<IAdminProps> = ({jwt})=> {
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [error, setError] = useState<any>("");
    const history = useHistory()

    useEffect(()=>{
        if (jwt === ""){
            history.push({ pathname: "/login"})
            return
        }
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
                setMovies(json.movies)
            })
    },[])
    return (
        <Fragment>
            <h2 className=" text-xl sm:block ml-2">Manage Catalogue</h2>
            <div className="flex p-3">
                {movies.map((m:any)=>(
                <Link to={`/admin/movie/${m.id}`}>
                <div key={m.id} className="max-w-xs overflow-hidden rounded-lg shadow-lg h-48 mr-4">
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

