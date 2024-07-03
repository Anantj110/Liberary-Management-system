import '../CSS/Addbook.css';
import axios from 'axios';
import { useState } from 'react';

function Addbook() {
  var role = localStorage.getItem("userRole");
  
  if(role !== "Admin"){
    alert("Unauthorized Access");
    window.location.href = "/";
    return null; 
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const libid = formData.get('libid');
    const title = formData.get('title');
    const authors = formData.get('authors');
    const publisher = formData.get('publisher');
    const version = formData.get('version');
    const totalcopies = formData.get('totalcopies');
    const availablecopies = formData.get('availablecopies');

    if (!libid || !title || !authors || !publisher || !version || !totalcopies || !availablecopies) {
      alert('Please fill all the fields.');
      return;
    }

    if (libid <= 0 || version <= 0 || totalcopies <= 0 || availablecopies <= 0) {
      alert('Numerical values must be greater than 0.');
      return;
    }
    formData.append('libid', libid);
    formData.append('title', title);
    formData.append('authors', authors);
    formData.append('publisher', publisher);
    formData.append('version', version);
    formData.append('totalcopies', totalcopies);
    formData.append('availablecopies', availablecopies);

    try {
      const response = await axios.post('http://localhost:8081/add-books', formData);
      console.log(response.data);
      alert('Book Added successfully!');
      window.location.reload(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add the book.');
    }
  };

  return (
    <>
      <div className="AddbookCard">
        <form className="AddbookForm" onSubmit={handleSubmit}>
          <h1 className='AddBookHeading'>Add Books</h1>
          <input className='AddBookLibId' type="number" placeholder="LibID" name='libid' /><br/>
          <input className='AddBookTitle' type="text" placeholder="Title" name='title'/><br/>
          <input className='AddBookAuthor' type="text" placeholder="Authors" name='authors'/><br/>
          <input className='AddBookPublisher' type="text" placeholder="Publisher" name='publisher'/><br/>
          <input className='AddBookVersion' type="number" placeholder="Version" name='version'/><br/>
          <input className='AddBooktotalCopies' type="number" placeholder="TotalCopies" name='totalcopies' /><br/>
          <input className='AddBookAvailableCopies' type="number" placeholder="AvailableCopies" name='availablecopies'/><br/>
          <button className='AddBookButton'>Submit</button>
        </form>
      </div>
    </>
  );
}

export default Addbook;
