import React, { Component, Fragment } from 'react'


export default class OneMovie extends Component {
    state = { movie: {}, isLoaded: false, error: null};

    componentDidMount(){
        // @ts-ignore
        fetch(`${process.env.REACT_APP_API_URL}/v1/movie/`+ this.props.match.params.id)
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
                    movie:json.movie,
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
                
               

                   
                   
                    <div className="max-w-xl overflow-hidden rounded-lg shadow-lg">
  <div className="px-6 py-4">
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
                            movie.description}</p>
  </div>
</div>

            </Fragment>
        );
    }
}