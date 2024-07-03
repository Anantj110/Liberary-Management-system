import { useState } from 'react';
import axios from 'axios'; 
import '../CSS/Login.css';
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/login', { email, password });
      const { role } = response.data;
      localStorage.setItem("userRole",role)
      if (role === 'Admin') {
        window.location.href = '/adminindex';
        setIsLoggedIn(true);
      } else if (role === 'Reader') {
        window.location.href = '/readerindex';
        setIsLoggedIn(true);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
 
     
      <div>
        <form onSubmit={handleSubmit} className='LoginForm'>
          <h1 className='LoginHeading'>Enter your Email to Login</h1>
          <input
            className='LoginEmail'
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            className='LoginPassword'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <br />
          <button className='LoginButton' type="submit">
            Login 
          </button>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      </div>
    </>
  );
}

export default Login;