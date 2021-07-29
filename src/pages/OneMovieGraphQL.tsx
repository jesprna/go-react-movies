import React, { Component, Fragment } from 'react'
import { IMovie } from '../interfaces/movie';


interface IOneMovieGraphQLProps{
}

interface IOneMovieGraphQLState{
    movie: IMovie,
    isLoaded: boolean,
    error : any,

}

export default class OneMovieGraphQL extends Component<IOneMovieGraphQLProps, IOneMovieGraphQLState> {
    constructor(props: IOneMovieGraphQLProps){
        super(props)
        this.state = { 
            movie: {},
            isLoaded: false, 
            error: null}
    }

    componentDidMount(){
        // @ts-ignore
        const id = this.props.match.params.id
        const payload = `
        {
            movie(id: ${id} ) {
                id
                title
                runtime
                year
                description
                release_date
                rating
                mpaa_rating
                poster
            }
        }
        `;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "applicatiion/json")

        const requestOptions = {
            method: "POST",
            body: payload,
            headers: myHeaders
        }

        fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
            .then((response)=> response.json())
            .then((data)=> {
                this.setState({
                    movie: data.data.movie,
                    isLoaded: true,
                })
            })
    }

    render (){
        const { movie, isLoaded, error} = this.state
         //@ts-ignore
        if(movie.genres){
             //@ts-ignore
             movie.genres = Object.values(movie.genres)
        }else{
             //@ts-ignore
             movie.genres = []
        }
        if (error) {
            return <div>Error: {
                 //@ts-ignore
                error.message
                }</div>
        }
        if(!isLoaded){
            return <p>Loading...</p>
        }
        return (
            <Fragment>
                
               

                   
                   
                <div className="w-full max-w-lg overflow-hidden rounded-lg shadow-lg sm:flex">
                
                    {movie?.poster !== "" && (
                        <div className="w-full sm:w-1/3">
                        <img className="object-cover w-full h-100" 
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster}`} 
                                    alt="Movie Poster"/>
          </div>
                    )}
                    
  <div className="flex-1 px-6 py-4">
    <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">Movie: {
                            // @ts-ignore
                            movie.title}</h4>
     <div >
     <div className="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg" role="alert">
  <p>Rating:  {// @ts-ignore
                            movie.mpaa_rating}</p>
</div>
                        <small><span className="mr-6"> Genres: </span>
                            { // @ts-ignore
                            movie.genres.map((m, index)=>(
                                <span key={index} className="mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded">{m}</span>
                            ))}
                        </small>
                    </div>
    <h5 className="mb-3 text-md font-semibold tracking-tight text-gray-800">Runtime: {
                            // @ts-ignore
                            movie.runtime } minutes</h5>
    <p className="leading-normal text-gray-700">{// @ts-ignore
                            movie.description?.slice(0,100)}...</p>
  </div>
</div>

            </Fragment>
        );
    }
}