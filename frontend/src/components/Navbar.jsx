import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer">
          <Link to="/home">DevConnect</Link>
        </h1>

        <ul className="flex items-center gap-8">
          <li>
            <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/explore" className="text-gray-700 hover:text-blue-600 font-medium">
              Explore
            </Link>
          </li>
          <li>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              Profile
            </Link>
          </li>
          <li>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
