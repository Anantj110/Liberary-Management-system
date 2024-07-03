import { useState, useEffect } from "react";
import axios from "axios";
function RaiseRequest() {
    const [message, setMessage] = useState('');
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

      const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
      formData.append('reqid', formData.get('reqid'));
      formData.append('bookid', formData.get('bookid'));
      formData.append('readerid', formData.get('readerid'));
      formData.append('requesttype', formData.get('requesttype'));
      try {
        const response = await axios.post('http://localhost:8081/issue-request', formData);
              console.log(response.data);
              alert('Requested Successfully');
              window.location.reload(false);
            } catch (error) {
              console.error('Error:', error);
            }
          };
    return(
        <>
            <div className="AddbookCard">
        <form className="AddbookForm" onSubmit={handleSubmit}>
            <h1 className='AddBookHeading'>Add Books</h1>
            <input className='AddBookLibId' type="number" placeholder="Request ID" name='reqid'/><br/>
            <input className='AddBookTitle' type="number" placeholder="Book ID" name='bookid'/><br/>
            <input className='AddBookAuthor' type="number" placeholder="Reader ID" name='readerid'/><br/>
            <input className='AddBookVersion' type="text" placeholder="Request Type" name='requesttype'/><br/>
            <button className='AddBookButton'> Submit </button>
        </form>
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
export default RaiseRequest;