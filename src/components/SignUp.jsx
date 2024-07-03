import '../CSS/SignUp.css';
import axios from 'axios';
import { Link } from "react-router-dom";

function SignUp() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
  
    const name = formData.get('name');
    const email = formData.get('email');
    const contactNumber = formData.get('contactnumber');
    const role = formData.get('role');
    const libID = formData.get('libid');
    const password = formData.get('password');

    if (!/^\d{10}$/.test(contactNumber)) {
      alert('Invalid contact number. It should be a 10-digit number.');
      return;
    }

    if (!['Reader', 'Admin'].includes(role)) {
      alert('Invalid role. It should be either "Reader" or "Admin".');
      return;
    }
    
    if (libID < 0) {
      alert('Invalid libID. It should not be negative.');
      return;
    }
  
    if (!name || !email || !contactNumber || !role || !libID || !password) {
      alert('Please fill in all fields');
      return;
    }
  
    formData.append('name', name);
    formData.append('email', email);
    formData.append('contactnumber', contactNumber);
    formData.append('role', role);
    formData.append('libid', libID);
    formData.append('password', password);
  
    try {
      const userExistsResponse = await axios.post('http://localhost:8081/getuser', formData);
      if (userExistsResponse.status === 200) {
        alert('You are already signed up. Please log in instead.');
        return;
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    try {
      const response = await axios.post('http://localhost:8081/add-user', formData);
      console.log(response.data);
      alert('Signed Up successfully!, You can now LogIn');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
    <div className="card">
      <form className='SignUpForm' onSubmit={handleSubmit}>
        <h1 className='SignupHeading'>Sign Up</h1>
        <input className='SignUpName' type="text" name="name" placeholder="Name" /><br />
        <input className='SignUpEmail' type="email" name="email" placeholder="Email" /><br />
        <input className='SignUpContact' type="text" name="contactnumber" placeholder="Contact Number" /><br />
        <input className='SignUpRole' type="text" name="role" placeholder="Role" /><br />
        <input className='SignUpLibId' type="number" name="libid" placeholder="LibID" /><br />
        <input className='SignUpPassword' type="password" name="password" placeholder="Password" /><br />
        <button className='SignUpButton'>Sign Up <Link to='/login'></Link></button>
        <p>Allredy have an account? <Link to="/login"> Login</Link> 
        </p>
      </form>
    </div>
    </>
  );
}
export default SignUp;