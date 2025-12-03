import React, { useState } from "react";
import { useProducts } from "../context/useProducts";

const ProductSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { fetchProducts } = useProducts();

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ q: searchTerm }); // send searchTerm to context as query object
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center justify-center my-4"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-l px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white px-4 py-2 rounded-r hover:bg-indigo-600 transition"
      >
        Search
      </button>
    </form>
  );
};

export default ProductSearchBar;
