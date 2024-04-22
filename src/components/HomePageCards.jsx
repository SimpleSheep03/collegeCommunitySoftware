import React from 'react'
import card1 from "../assets/_9fd17189-e8dd-4f52-8d28-0e8c3c919b03.jpeg"
import card2 from "../assets/_b7f51fcc-4cf6-4b85-804d-96d652c69226.jpeg"
import card3 from "../assets/_a14aa402-ac6c-4c44-b6f0-7cec7d463b19.jpeg"
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function HomePageCards() {
  return (
    <div className='mt-5 mx-5'>
        <div className="row p-5">
            <div className="col-3 mx-auto">
                <div  className="card border-warning">
                    <img src={card1}  className="card-img-top" alt="..."/>
                    <div  className="card-body">
                        <h3 className="card-title text-center">Academics & Research</h3>
                        <p  className="card-text">Dive into the world of technology with a rigorous curriculum designed to prepare you for the forefront of innovation.</p>
                    </div>
                </div>
            </div>
            <div className="col-3 mx-auto">
                <div  className="card border-warning">
                    <img src={card2}  className="card-img-top" alt="..."/>
                    <div  className="card-body">
                        <h3 className="card-title text-center">Placements & Industry Recognition</h3>
                        <p  className="card-text">Conduct groundbreaking research alongside esteemed faculty and contribute to solving real-world challenges.</p>
                    </div>
                </div>
            </div>
            <div className="col-3 mx-auto">
                <div  className="card border-warning"  >
                    <img src={card3}  className="card-img-top" alt="..."/>
                    <div  className="card-body">
                        <h3 className="card-title text-center">Campus Life & Beyond</h3>
                        <p  className="card-text">Secure placements with top national and international companies, launching your career with a competitive edge.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
