import React, { useState, useEffect } from 'react';
import axios from 'axios';

function IssueRegistry() {
    const [requests, setRequests] = useState([]);

    var role = localStorage.getItem("userRole")
      if(role != "Admin"){
        alert("unauthorized access")
        window.location.href = "/"
        return;
      }

    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const response = await axios.post('http://localhost:8081/getrequests');
            console.log(response.data);
            setRequests(response.data);
          } catch (error) {
            setMessage(error.response.data.error);
          }
        };
        fetchRequests();
      }, []);
    return(
        <>
            <table className='DeleteBookTable'>
        {/* <h2 className='DeleteBookHeading'>All Books</h2> */}
        <thead>
          <tr>
            <th className='DeleteBookTH'>ReqID</th>
            <th className='DeleteBookTH'>BookID</th>
            <th className='DeleteBookTH'>ReaderID</th>
            <th className='DeleteBookTH'>RequestDate</th>
            <th className='DeleteBookTH'>RequestType</th>
            <th className='DeleteBookTH'>Request</th>
          </tr>
        </thead>
        <tbody>
  {requests.map((request) => (
    <tr key={book.isbn}>
      <td className='DeleteBookTD'>{request.reqid}</td>
      <td className='DeleteBookTD'>{request.Bookid}</td>
      <td className='DeleteBookTD'>{request.readerid}</td>
      <td className='DeleteBookTD'>{request.requestdate}</td>
      <td className='DeleteBookTD'>{request.requesttype}</td>
      <td className='DeleteBookTD'>{request.request}</td>
    </tr>
  ))}
</tbody>
      </table>
            
        </>
    )
};
export default IssueRegistry;