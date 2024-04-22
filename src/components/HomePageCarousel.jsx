import React from "react";
import campus from "../assets/campus818901 (1).jpg"
import campus2 from "../assets/Image-1-IIIT-Allahabad-started-1 (1).webp"
import campus1 from "../assets/1500x.jpg"

export default function HomePageCarousel() {
  return (
    <div className="container-fluid mt-1">
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={campus1} className="d-block w-100" alt="carouselImage" />
          </div>
          <div className="carousel-item">
            <img src={campus} className="d-block w-100" alt="carouselImage" />
          </div>
          <div className="carousel-item">
            <img src={campus2} className="d-block w-100" alt="carouselImage" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next">
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
