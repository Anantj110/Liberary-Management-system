import { Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Header from "./components/HomeHeader";
import Addbook from "./components/Addbook";
import BookSearch from "./components/BookSearch";
import DeleteBook from "./components/DeleteBook";
import UpdateBook from "./components/UpdateBook";
import AdminIndex from "./components/AdminIndex";
import ReaderIndex from "./components/ReaderIndex";
import RaiseRequest from "./components/RaiseRequest";
import IssueRegistry from "./components/IssueRegistry";


function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addbook" element={<Addbook />} />
        <Route path="/booksearch" element={<BookSearch />} />
        <Route path="/deletebook" element={<DeleteBook />} />
        <Route path="/updatebook" element={<UpdateBook />} />
        <Route path="/adminindex" element={<AdminIndex />} />
        <Route path="/readerindex" element={<ReaderIndex />} />
        <Route path="/raiserequest" element={<RaiseRequest />} />
        <Route path="/issueregistry" element={<IssueRegistry />} />
      </Routes>
    </div>
  );
}
export default App;