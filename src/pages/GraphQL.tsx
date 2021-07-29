import React, { Component } from 'react'
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/form-components/Input';
import { IMovie } from '../interfaces/movie';
import { IAlert } from './EditMovie';


interface IGraphQLProps{

}

interface IGraphQLState{
    movies: IMovie[],
    isLoaded: boolean,
    searchTerm: string,
    error : any,
    alert : IAlert
}

export default class GraphQL extends Component<IGraphQLProps, IGraphQLState> {
    constructor(props: IGraphQLProps){
        super(props);
        this.state = {
            movies: [],
            isLoaded: false,
            error: null,
            searchTerm: "",
            alert: {
                type: "hidden",
                message: ""
            }
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
        const payload = `
        {
            list {
                id
                title
                runtime
                year
                description
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
                let theList = Object.values(data.data.list);
                return theList
            })
            .then((theList)=> {
                this.setState({
                    // @ts-ignore
                    movies: theList
                })
            })
    }

    handleChange = (evt:any)=> {
        let value = evt.target.value;
        this.setState((prevState) =>({
            searchTerm: value
        }))
        if(value.length > 2){
            this.performSearch();
        }else {
            this.setState({ movies: []})
        }
        
    }

    performSearch(){
        const payload = `
        {
            search(titleContains: "${this.state.searchTerm}") {
                id
                title
                runtime
                year
                description
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
                let theList = Object.values(data.data.search);
                return theList
            })
            .then((theList)=> {
                if (theList.length > 0){
                    this.setState({
                        // @ts-ignore
                        movies: theList
                    })
                }else{
                    this.setState({
                        movies: []
                    })
                }
               
            })
    }

    render(){
        let {movies} = this.state
        return (
            <Fragment>
                <h2 className=" text-xl sm:block ml-2">GraphQL</h2>
                <hr />
                <Input customClass="px-2 md:w-1/4" title={"Search"} type={"text"} name={"search"} value={this.state.searchTerm}  handleChange={this.handleChange}  />
                <div className="flex p-3">
                
                {movies.map((m:any)=>(
                     <Link to={`/moviesgraphql/${m.id}`} >
                    <div key={m.id} className="max-w-md overflow-hidden rounded-lg shadow-lg h-64 w-100 mr-4">
                    <div className="px-6 py-4">
                      <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">{m.title}</h4>
                      <p className="leading-normal text-gray-700">{m.description.slice(0,100)}...</p>
                      <small >
                          <span className="text-purple-700 text-opacity-60">  ({m.year}) - {m.runtime} minutes</span>
                        
                      </small>
                      <br />
                    </div>
                  </div>
              </Link>
                ))}
                </div>
            </Fragment>
           
        );
    }
}