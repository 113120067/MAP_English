import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ReaderLauncher } from './components/ReaderLauncher';
import { MnemonicLibrary } from './components/MnemonicLibrary';
import { Book, Edit3 } from 'lucide-react';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow p-4 mb-6">
          <div className="max-w-4xl mx-auto flex gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium">
              <Book size={20} /> Library
            </Link>
            <Link to="/custom" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium">
              <Edit3 size={20} /> Custom Text
            </Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<MnemonicLibrary />} />
            <Route path="/custom" element={<ReaderLauncher />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
