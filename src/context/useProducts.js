import { useContext } from "react";
import { ProductContext } from "./ProductContext";

// Custom hook
export const useProducts = () => useContext(ProductContext);
