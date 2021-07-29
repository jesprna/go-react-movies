import React, { Component, Fragment} from 'react'
import { Link } from 'react-router-dom';

export default class Movies extends Component {
    state = {
        movies: [],
        isLoaded: false,
        error: null
    };


    componentDidMount(){
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
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
    }
    render() {
        const {movies, isLoaded, error} = this.state
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



