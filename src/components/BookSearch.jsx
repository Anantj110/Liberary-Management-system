import React, { useState } from 'react';
import axios from 'axios';
import '../CSS/BookSearch.css'
 
function BookSearch() {
  const [title, setTitle] = useState('');
  const [book, setBook] = useState(null);
 
  function handleSearch() {
    axios.post('http://localhost:8081/get-book', { title }, {headers: { 'Content-Type': 'application/json' }
    }).then((res)=>{
        console.log(res.data)
        setBook(res.data)
    }).catch((error) => {
      if (error.response && error.response.status === 404) {
        alert("No book exists of this title")
      } else {
        console.error(error);
      }
    });
  }
  return (
   <>
      <div className="BookSearchContainer">
  <div className="BookSearchCard">
  <div className='BookSearchform'>
      <h1 className='BookSearchHeading'>Book Search</h1>
      <input
        className='BookSearchInput'
        type="text"
        placeholder="Enter book title"
        value={title}
        name='title'
        onChange={(e) => setTitle(e.target.value)}
        />
      <button onClick={handleSearch} className='BookSearchButton'>Search</button>
      </div>
  </div> 
  <div className="BookDetailsDiv">
    {book && (
      <table className='BookSearchTable'>
        <thead>
    <tr>
      <th className='BookSearchTH'>Book Detail</th>
      <th className='BookSearchTH'>Book</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className='BookSearchTD'>Title</td>
      <td className='BookSearchTD'>{book.title}</td>
    </tr>
    <tr>
      <td className='BookSearchTD'>Author(s)</td>
      <td className='BookSearchTD'>{book.authors}</td>
    </tr>
    <tr>
      <td className='BookSearchTD'>Publisher</td>
      <td className='BookSearchTD'>{book.publisher}</td>
    </tr>
    <tr>
      <td className='BookSearchTD'>Version</td>
      <td className='BookSearchTD'>{book.version}</td>
    </tr>
    <tr>
      <td className='BookSearchTD'>Total Copies</td>
      <td className='BookSearchTD'>{book.totalcopies}</td>
    </tr>
    <tr>
      <td className='BookSearchTD'>Available Copies</td>
      <td className='BookSearchTD'>{book.availablecopies}</td>
    </tr>
  </tbody>
      </table>
    )}
  </div>
</div>
</>
  );
}
 
export default BookSearch;