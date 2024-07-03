import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/DeleteBook.css'

function DeleteBook() {
  const [isbn, setIsbn] = useState('');
  const [message, setMessage] = useState('');
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

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const isbnInt = parseInt(isbn, 10);
      if (isNaN(isbnInt) || isbnInt <= 0) {
        alert('Invalid ISBN: ISBN must be a positive number.');
        return;
      }
      const response = await axios.post('http://localhost:8081/delete-book', {
        ISBN: isbnInt,
      });
      setMessage(response.data.message);
      setBooks(books.filter((book) => book.ISBN !== isbnInt));
      setIsbn('');
      window.location.reload(false);
    } catch (error) {
      alert(error.response ? error.response.data.error : 'Failed to delete book');
    }
  };
  return (
    <>
    <div className='DeleteBookCard'>
      <h1 className='DeleteBookHeading'>Delete Book</h1>
      <form className="DeleteBookForm" onSubmit={handleDelete}>
        <input
          className='DeleteBookInput'
          placeholder='ISBN'
          type="text"
          id="isbn"
          value={isbn}
          onChange={(event) => setIsbn(event.target.value)}
        />
        <button className='DeleteBookButton' type="submit">Delete</button>
      </form>
      {message && <p>{message}</p>}
      
      </div>
      <div className='DeleteBookTableCard'>
              <table className='DeleteBookTable'>
        {/* <h2 className='DeleteBookHeading'>All Books</h2> */}
        <thead>
          <tr>
            <th className='DeleteBookTH'>ISBN</th>
            <th className='DeleteBookTH'>LibID</th>
            <th className='DeleteBookTH'>Title</th>
            <th className='DeleteBookTH'>Authors</th>
            <th className='DeleteBookTH'>Publisher</th>
            <th className='DeleteBookTH'>Version</th>
            <th className='DeleteBookTH'>Total Copies</th>
            <th className='DeleteBookTH'>Available Copies</th>
          </tr>
        </thead>
        <tbody>
  {books.map((book) => (
    <tr key={book.isbn}>
      <td className='DeleteBookTD'>{book.isbn}</td>
      <td className='DeleteBookTD'>{book.libid}</td>
      <td className='DeleteBookTD'>{book.title}</td>
      <td className='DeleteBookTD'>{book.authors}</td>
      <td className='DeleteBookTD'>{book.publisher}</td>
      <td className='DeleteBookTD'>{book.version}</td>
      <td className='DeleteBookTD'>{book.totalcopies}</td>
      <td className='DeleteBookTD'>{book.availablecopies}</td>
    </tr>
  ))}
</tbody>
      </table>
      </div>
</>
  );
}
export default DeleteBook;