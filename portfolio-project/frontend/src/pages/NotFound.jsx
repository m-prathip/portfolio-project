import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900">
    <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-3">404</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-6">This page doesn't exist.</p>
    <Link to="/" className="btn-primary px-5 py-2.5">
      <FiArrowLeft size={16} /> Back home
    </Link>
  </div>
);

export default NotFound;
