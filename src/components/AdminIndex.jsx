import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/AdminIndex.css';

function AdminIndex() {
  const [books, setBooks] = useState([]);

  var role = localStorage.getItem("userRole")
  if(role != "Admin"){
    alert("unauthorized access")
    window.location.href = "/"
    return;
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.post('http://localhost:8081/get-all-books');
        console.log(response.data);
        setBooks(response.data);
      } catch (error) {
        setMessage(error.response.data.error);
      }
    };
    fetchBooks();
  }, []);

  return (
    <>
    <br />
      <h1 className='mainHeading'>Admin Index</h1>
        <div class="AdminIndexCard">
  <table className="AdminIndexTable">
    <thead>
      <tr>
        <th className="AdminIndexTH">ISBN</th>
        <th className="AdminIndexTH">Title</th>
        <th className="AdminIndexTH">Authors</th>
        <th className="AdminIndexTH">Publisher</th>
        <th className="AdminIndexTH">Version</th>
        <th className="AdminIndexTH">Total Copies</th>
        <th className="AdminIndexTH">Available Copies</th>
      </tr>
    </thead>
    <tbody>
      {books.map((book) => (
        <tr key={book.isbn}>
          <td className="AdminIndexTD">{book.isbn}</td>
          <td className="AdminIndexTD">{book.title}</td>
          <td className="AdminIndexTD">{book.authors}</td>
          <td className="AdminIndexTD">{book.publisher}</td>
          <td className="AdminIndexTD">{book.version}</td>
          <td className="AdminIndexTD">{book.totalcopies}</td>
          <td className="AdminIndexTD">{book.availablecopies}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    <div className='AdminOptions'>
        <Link className='AdminIndexAddBookButton' to="/addbook">Add Book</Link>
        <Link className='AdminIndexAddBookButton' to="/deletebook">Delete Book</Link>
        <Link className='AdminIndexAddBookButton' to="/updatebook">Update Book</Link>
    </div>
    </>
  );
}

export default AdminIndex;