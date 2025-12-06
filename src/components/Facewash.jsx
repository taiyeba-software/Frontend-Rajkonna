
"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/useProducts";
import { useAuth } from "../context/AuthContext";
import { normalizeId } from "../lib/utils";

const productData = [
  {
    _id: "690e4112f27e80981ae685c4",
    name: "Glow Face Wash",
    description: "",
    price: 440,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
        filename: "glow_face_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
  },
  {
    _id: "690e4112f27e80981ae685bf",
    name: "Acne Fighting Face Wash",
    description: "",
    price: 450,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
        filename: "acne_fiting_face_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c1",
    name: "Charcoal Face Wash",
    description: "",
    price: 400,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/f9d1fbf4-2231-498c-9893-663c6973cd6d_charcole_face_wash_hu6lnjGol.jpg",
        filename: "charcole_face_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/f9d1fbf4-2231-498c-9893-663c6973cd6d_charcole_face_wash_hu6lnjGol.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/f9d1fbf4-2231-498c-9893-663c6973cd6d_charcole_face_wash_hu6lnjGol.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c9",
    name: "Pink Body Wash",
    description: "",
    price: 370,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/01008191-b6e4-4b29-a550-21ae6748b1a2_pink_body_wash_y94kLJW6HK.jpg",
        filename: "pink_body_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/01008191-b6e4-4b29-a550-21ae6748b1a2_pink_body_wash_y94kLJW6HK.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/01008191-b6e4-4b29-a550-21ae6748b1a2_pink_body_wash_y94kLJW6HK.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c0",
    name: "Blue Body Wash",
    description: "",
    price: 380,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/15b0cc74-6d67-41ea-99cd-eb751c1db8c4_blue_body_wash_ixvOM-hbJ.jpg",
        filename: "blue_body_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/15b0cc74-6d67-41ea-99cd-eb751c1db8c4_blue_body_wash_ixvOM-hbJ.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/15b0cc74-6d67-41ea-99cd-eb751c1db8c4_blue_body_wash_ixvOM-hbJ.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c4",
    name: "Glow Face Wash",
    description: "",
    price: 440,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
        filename: "glow_face_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/cc0daa9a-aec5-4cc7-983e-703667a373eb_glow_face_wash_nTXo3ixwPp.jpg",
  },
  {
    _id: "690e4112f27e80981ae685bf",
    name: "Acne Fighting Face Wash",
    description: "",
    price: 450,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
        filename: "acne_fiting_face_wash.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/81bd7c5c-4677-4c14-b8ab-5aa3c5192443_acne_fiting_face_wash_lBV1w1ZD_.jpg",
  },
];

export const Facewash = () => {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useProducts();
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product, user);
  };

  return (
    <section className="gpu relative w-full min-h-screen px-1 py-20 overflow-hidden bg-[#98bad5]">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-10 text-primary-foreground/80">
        RajKonna <span className="italic">Facewash</span>
      </h1>

      <div className="max-w-7xl mx-auto">
        <div className="relative w-full overflow-hidden">
          <div className="flex justify-end gap-2 mb-4 pr-4">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full text-amber-950 bg-gray-100 shadow hover:bg-gray-900 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full text-amber-950 bg-gray-100 shadow hover:bg-gray-900 hover:text-white"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Product cards */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-2"
          >
            {productData.map((product, index) => (
              <div
                key={normalizeId(product._id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => navigate(`/products/${normalizeId(product._id)}`)}
                className="gpu min-w-[240px] bg-[#d8cec4] rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img
                  src={hoveredIndex === index ? product.hoverImg : product.img}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-md mb-4"
                />

                <h3 className="text-lg font-bold text-amber-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-[#7ca4a1] mb-2">{product.description}</p>

                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-fuchsia-950">
                    ৳{product.price}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="cosmic-button"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
