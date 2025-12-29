import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          DevConnect
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white transition"
          >
            About
          </Link>
          
          <Link
            to="/explore"
            className="text-gray-300 hover:text-white transition"
          >
            Explore
          </Link>

          

          <Link
            to="/auth"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
