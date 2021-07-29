import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';

export default class Genres extends Component {
    
    state = {
        genres: [],
        isLoaded: false,
        error: null
    }

    componentDidMount(){
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
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
                    genres:json.genres,
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

    render(){
        const {genres, isLoaded, error} = this.state
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
                    <h2>Genres</h2>

                    {
                            genres.map((m, index)=>(
                                 
                                <Link key={index} to={{
                                    // @ts-ignore
                                   pathname: `/genres/${m.id}`, genreName: m.genre_name
                                }}>
                             
                                <span  className="mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-700 rounded">{// @ts-ignore
                                m.genre_name}</span>
                                </Link>
                            
                            ))}
            </Fragment>
           
        );
    }
}