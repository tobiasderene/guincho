import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import './styles/styles.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/inicio" element={<Home />} />
        <Route path="/categorias" element={<Category />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
