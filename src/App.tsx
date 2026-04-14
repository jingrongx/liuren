import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "@/pages/Home";

const DaLiuRenPage = lazy(() => import("@/pages/DaLiuRenPage"));

function NavBar() {
  const location = useLocation();
  const isDaLiuRen = location.pathname === "/da-liu-ren";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-amber-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold bg-gradient-to-r from-red-800 to-amber-700 bg-clip-text text-transparent">
          {isDaLiuRen ? '大六壬' : '小六壬'}
        </Link>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              !isDaLiuRen
                ? 'bg-white shadow text-amber-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            小六壬
          </Link>
          <Link
            to="/da-liu-ren"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isDaLiuRen
                ? 'bg-white shadow text-indigo-800'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            大六壬
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/da-liu-ren" element={<Suspense fallback={<div className="text-center py-20 text-gray-500">加载中...</div>}><DaLiuRenPage /></Suspense>} />
      </Routes>
    </Router>
  );
}
