import React from 'react';
import {  useLocation } from 'react-router-dom'

function SearchResults() {

    const location = useLocation()
    const users = location.state.users

  return (
    <div className='container bg-dark-subtle'>
      <div className='mt-5 text-center pt-5'>
        <h1 className='text-danger-emphasis'>Search Results</h1>
      </div>
      <div className='mt-5 text-center bg-secondary-subtle border border-warning py-3'>
            <h2 className='text-warning-emphasis'>Users</h2>
            <div className='mt-4 d-flex '>
                {users.map((user) => (
                    <div className="card mx-auto border-warning" style={{ width: '18rem', margin: '10px' }} key={user._id}>
                        <img src={user.photoURL} className="card-img-top" alt="profilePhoto"/>
                        <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.about}</p>
                        <a href={`/profile/${user.email}`} className="btn btn-primary">View profile</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

export default SearchResults;
