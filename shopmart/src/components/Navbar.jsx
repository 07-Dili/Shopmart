import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-8 lg:px-16 py-4 h-20 flex justify-between items-center">
      <Link to="/" className="text-4xl font-bold text-blue-600">ShopMart</Link>

      <div className="hidden md:flex space-x-8 text-gray-700 font-medium items-center text-xl">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/orders" className="hover:text-blue-500">Orders</Link>
        <Link to="/cart" className="hover:text-blue-500">Cart</Link>

        {user && user.role === 'admin' && (
          <Link to="/admin" className="hover:text-blue-500">Dashboard</Link>
        )}

        {user ? (
          <div className="relative">
            <button onClick={toggleDropdown} className="text-blue-600 font-semibold flex items-center gap-2">
              <FaUser className="text-lg" /> {user.name}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-50">
                <button
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                  className="block px-4 py-2 text-left text-sm w-full hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="hover:text-blue-500 flex items-center gap-2">
            <FaUser className="text-lg" /> Login
          </Link>
        )}
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md py-4 px-6 space-y-4 text-lg">
          <Link to="/" className="block text-gray-700 hover:text-blue-500">Home</Link>
          <Link to="/orders" className="block text-gray-700 hover:text-blue-500">Orders</Link>
          <Link to="/cart" className="block text-gray-700 hover:text-blue-500">Cart</Link>
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="block text-gray-700 hover:text-blue-500">Admin</Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="block w-full text-left text-gray-700 hover:text-red-500"
            >
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-500 flex items-center gap-2">
              <FaUser className="text-base" /> Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}