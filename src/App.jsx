import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProductListing from "./pages/ProductListing"; // Main product page
import ProductDetail from "./pages/ProductDetail";   // Single product page
import CartPage from "./pages/CartPage";

// Components
import AuthModal from "./components/modals/AuthModal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Global modal mounted once */}
      <AuthModal />
    </BrowserRouter>
  );
}

export default App;
 