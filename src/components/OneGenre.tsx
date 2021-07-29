import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';

export default class OneGenre extends Component {
    state = {
        movies: [],
        isLoaded: false,
        error :null,
        genreName: ""
    }


    componentDidMount(){
         // @ts-ignore
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies/`+ this.props.match.params.id)
            // .then((response) =>response.json())
            .then((response:any) =>{
                console.log("status code is", response.status)
                if (response.status !== '200'){
                    let err:any = Error;
                    err.message= "Invalid response code: " + response.status
                    this.setState({error: err})
                }
                return response.json()
            })
            .then((json)=>{
                this.setState({
                    //@ts-ignore
                    movies:json.movies,
                    isLoaded:true,
                     //@ts-ignore
                    genreName: this.props.location.genreName
                }, 
                //@ts-ignore
                (error) => {
                    this.setState({
                        isLoaded:true,
                        error
                    })
                })
            })
    }
    render() {
        let {movies, isLoaded, error, genreName} = this.state
        if (!movies){
            movies = []
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
                <h2 className=" text-xl sm:block ml-2">Genre: {genreName}</h2>
                <div className="flex p-3">
                {movies.map((m:any)=>(
                     <Link key={m.id} to={`/movies/${m.id}`} >
                    <div  className="max-w-xs overflow-hidden rounded-lg shadow-lg">
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