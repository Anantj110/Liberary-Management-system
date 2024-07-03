import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import '../CSS/Header.css';

function Header() {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);  
    navigate("/", { replace: true });
  };
  
  return (
    <header>
      <nav className="navStart">
        <div className="firstDiv">
          <div className="xenonLogo">
            <Link to="/"><img src="/src/assets/xenonstack.png" alt="" /></Link>
          </div>
          <h1 className="HeaderHeading">Xenon Library</h1>
          {userRole? (
            <div className="HeaderOptions">
              <button className="HeaderLogoutButton" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="HeaderOptions">
              <Link className="HeaderloginButton" to="/login"><span>Login</span></Link>
              <Link to="/signup" className="HeaderSignUpButton"><span>Sign Up</span></Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
export default Header;