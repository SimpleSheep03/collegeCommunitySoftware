import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function LoggedOutHeader() {
  return (
    <div>
      <div >
        <nav className="navbar navbar-expand-lg bg-dark theme-dark" data-bs-theme="dark">
          <div className="container-fluid d-flex justify-between">
            <a className="navbar-brand" href = "/">
              <i className="bi bi-globe-central-south-asia p-4"></i>
              Connect IIITA
            </a>
            <div>
              <a className="theme-dark px-4 text-white text-decoration-none" href="/signin">Sign in</a>
              <a className="theme-dark px-4 text-white text-decoration-none" href="/signup">Sign up</a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
