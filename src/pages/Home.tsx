import React from 'react'
import Ticket from './../images/movie_tickets.jpg'
import './../styles/Home.css'

const Home = () => {
    return (
        <div>
            <h2  className="flex items-center justify-center font-bold">This is the Home Page</h2>
 <div className="flex items-center justify-center mt-10">
               

               <div className="max-w-xs overflow-hidden rounded-lg shadow-lg ">
                 <div className="tickets"></div>
               </div>
                       </div>
        </div>
       
    )
}

export default Home
