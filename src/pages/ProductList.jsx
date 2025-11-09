import React, { useEffect, useContext } from "react";
import { ProductContext } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const { products, fetchProducts, loading, error } = useContext(ProductContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <section className="relative w-full min-h-screen px-1 ">
      <div className="min-h-screen bg-background text-foreground p-6 mx-10 my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
