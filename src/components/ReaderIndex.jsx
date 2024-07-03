import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from 'react';
import '../CSS/ReaderIndex.css'

function ReaderIndex() {
    const [books, setBooks] = useState([]);
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

    return(
        <>

    <div className='ReaderOptions'>
        <Link className='ReaderIndexButton' to="/booksearch">Search Books</Link>
        <Link className='ReaderIndexButton' to="/raiserequest">Raise Request</Link>
    </div>
    <div className='ReaderIndexTableCard'>
              <table className='ReaderIndexTable'>
        {/* <h2 className='ReaderIndexHeading'>All Books</h2> */}
        <thead>
          <tr>
            <th className='ReaderIndexTH'>ISBN</th>
            <th className='ReaderIndexTH'>LibID</th>
            <th className='ReaderIndexTH'>Title</th>
            <th className='ReaderIndexTH'>Authors</th>
            <th className='ReaderIndexTH'>Publisher</th>
            <th className='ReaderIndexTH'>Version</th>
            <th className='ReaderIndexTH'>Total Copies</th>
            <th className='ReaderIndexTH'>Available Copies</th>
          </tr>
        </thead>
        <tbody>
  {books.map((book) => (
    <tr key={book.isbn}>
      <td className='ReaderIndexTD'>{book.isbn}</td>
      <td className='ReaderIndexTD'>{book.libid}</td>
      <td className='ReaderIndexTD'>{book.title}</td>
      <td className='ReaderIndexTD'>{book.authors}</td>
      <td className='ReaderIndexTD'>{book.publisher}</td>
      <td className='ReaderIndexTD'>{book.version}</td>
      <td className='ReaderIndexTD'>{book.totalcopies}</td>
      <td className='ReaderIndexTD'>{book.availablecopies}</td>
    </tr>
  ))}
</tbody>
      </table>
      </div>
        </>
    );
}
export default ReaderIndex;