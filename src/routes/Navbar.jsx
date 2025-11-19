import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Advocate Management</h1>
      <ul className="flex space-x-6">
        {user && (
          <>
            <li><Link to="/cases" className="hover:text-gray-200">Cases</Link></li>
            <li><Link to="/clients" className="hover:text-gray-200">Clients</Link></li>
            <li><Link to="/calendar" className="hover:text-gray-200">Calendar</Link></li>
            <li><Link to="/documents" className="hover:text-gray-200">Documents</Link></li>
            <li><Link to="/payments" className="hover:text-gray-200">Payments</Link></li>
            <li><button onClick={logout} className="hover:text-gray-200">Logout</button></li>
          </>
        )}
        {!user && (
          <>
            <li><Link to="/login" className="hover:text-gray-200">Login</Link></li>
            <li><Link to="/signup" className="hover:text-gray-200">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
