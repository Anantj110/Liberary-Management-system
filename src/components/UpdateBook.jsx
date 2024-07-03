import "../CSS/UpdateBook.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateBook() {
  const [books, setBooks] = useState([]);
  var role = localStorage.getItem("userRole");

  if(role !== "Admin"){
    alert("Unauthorized Access");
    window.location.href = "/";
    return null;
  }

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.post('http://localhost:8081/get-all-books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const [book, setBook] = useState({
    ISBN: '',
    LibID: '',
    Title: '',
    Authors: '',
    Publisher: '',
    AvailableCopies: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'LibID' || name === 'AvailableCopies' || name === 'ISBN') {
      const intValue = Math.max(parseInt(value, 10) || 0);
      setBook({ ...book, [name]: intValue });
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ISBN, LibID, Title, Authors, Publisher, AvailableCopies } = book;

    // Check for empty fields and validate numerical inputs
    if (!ISBN || !LibID || !Title || !Authors || !Publisher || !AvailableCopies) {
      alert('Please fill in all fields.');
      return;
    }

    if (ISBN <= 0 || LibID <= 0 || AvailableCopies <= 0) {
      alert('Numerical values must be greater than zero.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/update-book', book);
      console.log(response);
      alert('Book updated successfully!');
      window.location.reload(false);
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book.');
    }
  };

  return (
    <>
      <form className='UpdateBookFrom' onSubmit={handleSubmit}>
      <h1>Update Book</h1>
        <input 
        className='UpdateBookISBN'
        placeholder='ISBN'
          type="number"
          name="ISBN"
          value={book.ISBN}
          onChange={handleChange}
          required
        />
        <input
        className='UpdateBookLibID'
          placeholder='Libid'
          type="number"
          name="LibID"
          value={book.LibID}
          onChange={handleChange}
        />
        <input
        className='UpdateBookTitle'
          placeholder='Title'
          type="text"
          name="Title"
          value={book.Title}
          onChange={handleChange}
          required
        />
        <input
        className='UpdateBookAuthors'
          placeholder='Authors'
          type="text"
          name="Authors"
          value={book.Authors}
          onChange={handleChange}
          required
        />
        <input
        className='UpdateBookPublisher'
          placeholder='Publisher'
          type="text"
          name="Publisher"
          value={book.Publisher}
          onChange={handleChange}
          required
        />
        <input
        className='UpdateBookAvailableCopies'
          placeholder='Available Copies'
          type="number"
          name="AvailableCopies"
          value={book.AvailableCopies}
          onChange={handleChange}
          required
        />
      <button className='UpdateBookButton' type="submit">Update Book</button>
    </form>
    <div class="UpdateBookTableCard">
  <table className="UpdateBookTable">
    <thead>
      <tr>
        <th className="UpdateBookTH">ISBN</th>
        <th className="UpdateBookTH">LibID</th>
        <th className="UpdateBookTH">Title</th>
        <th className="UpdateBookTH">Authors</th>
        <th className="UpdateBookTH">Publisher</th>
        <th className="UpdateBookTH">Version</th>
        <th className="UpdateBookTH">Total Copies</th>
        <th className="UpdateBookTH">Available Copies</th>
      </tr>
    </thead>
    <tbody>
      {books.map((book) => (
        <tr key={book.isbn}>
          <td className="UpdateBookTD">{book.isbn}</td>
          <td className="UpdateBookTD">{book.libid}</td>
          <td className="UpdateBookTD">{book.title}</td>
          <td className="UpdateBookTD">{book.authors}</td>
          <td className="UpdateBookTD">{book.publisher}</td>
          <td className="UpdateBookTD">{book.version}</td>
          <td className="UpdateBookTD">{book.totalcopies}</td>
          <td className="UpdateBookTD">{book.availablecopies}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </>
  );
}

export default UpdateBook;
