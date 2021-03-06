import {BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Movies } from './pages/Movies';
import Home from './pages/Home';
import {Admin} from './pages/Admin';
import Header from './components/Header';
import {OneMovie} from './components/OneMovie';
import {Genres} from './components/Genres';
import {OneGenre} from './components/OneGenre';
import { IEditMovieProps, EditMovie } from './pages/EditMovie';
import  React, { Fragment, useState, useEffect }  from 'react';
import { ILoginProps, Login } from './pages/Login'
import { IAdminProps } from './pages/Admin'
import GraphQL from './pages/GraphQL';
import OneMovieGraphQL from './pages/OneMovieGraphQL';

interface IAppProps {
  
}

interface IAppState {
   jwt: string
}

export const App = ()=> {
  const [jwt, setJWT]  =useState<string>("");

  useEffect(()=>{
    let t = window.localStorage.getItem("jwt")
    if (t){
      if (jwt === ""){
        setJWT(JSON.parse(t))
      }
    }
  },[jwt])

  const handleJWTChange = (jwt:any)=>{
    setJWT(jwt);
  }

  const logout = ()=>{
    setJWT("")
    window.localStorage.removeItem("jwt")

  }

  let loginLink;
    if(jwt === ""){
      loginLink = <Link to="/login">
         <div className="flex p-3 text-white bg-blue-500 rounded cursor-pointer text-center text-sm">
            <button className="rounded inline-flex items-center ">
              <span className="font-semibold">Login</span>
            </button>
          </div>
      </Link>
    }else{
      loginLink = <Link to="/logout" onClick={logout}>
         <div className="flex p-3 text-white bg-red-500 rounded cursor-pointer text-center text-sm">
            <button className="rounded inline-flex items-center ">
              <span className="font-semibold">Logout</span>
            </button>
          </div>
      </Link>
    }

  return (
    <Router>
         <>
  
      <Header />
    
    <main className="flex w-full h-screen">
    <aside className="w-80 h-screen bg-gray shadow-md w-fulll hidden sm:block">
      <div className="flex flex-col justify-between h-screen p-4 bg-gray-800">
          <div className="text-sm">
          <Link to="/" > <div  className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
            Home
            </div></Link>
  
            <Link to="/movies" ><div className="bg-gray-700 text-blue-300 p-2 rounded mt-2 cursor-pointer">
           Movies
            </div></Link>
            <Link to="/genres" >
            <div  className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
           Genres
              </div></Link>
              {jwt !== "" && <Fragment>
              <Link to="/admin/movie/0" >
            <div  className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
           Add Movie
              </div></Link>
              <Link to="/admin" >
            <div  className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
           Manage Catalogue
              </div></Link>

              <Link to="/graphql" >
            <div  className="bg-gray-900 text-white p-2 rounded mt-2 cursor-pointer hover:bg-gray-700 hover:text-blue-300">
           GraphQL
              </div></Link>
                </Fragment>}
             
          </div>
        {loginLink}
      </div>
    </aside>
   
    <section className="w-full p-4">
      <Switch>
           <Route path="/movies/:id" >
              <OneMovie />
           </Route>
           <Route path="/moviesgraphql/:id" component={OneMovieGraphQL}/>
    
           <Route path="/movies">
                <Movies />
           </Route>
           <Route exact path="/genres">
                <Genres />
           </Route>

           <Route exact path="/graphql">
                <GraphQL />
           </Route>
           <Route path="/genres/:id" >
             <OneGenre />
             </Route>

           <Route path="/login" component={(props: ILoginProps) =>  (
           <Login {...props} handleJWTChange={handleJWTChange}/>)} 
           />
           <Route path="/admin/movie/:id" component={(props: IEditMovieProps) => (
             <EditMovie {...props} jwt={jwt}  /> ) }
            />
           <Route path="/admin" component={(props: IAdminProps) => (
             <Admin {...props} jwt={jwt}  /> ) }
            />
           <Route path="/">
                <Home />
           </Route>
      </Switch>
     
    </section>
    
    </main>
      </>
      </Router>
  )
}
