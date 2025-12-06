"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/useProducts";
import { useAuth } from "../context/AuthContext";
import { normalizeId } from "../lib/utils";


const productData = [
  {
    _id: "690e4112f27e80981ae685cc",
    name: "Herbal Toner",
    description: "",
    price: 410,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
        filename: "toner.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c7",
    name: "Body Lotion",
    description: "",
    price: 470,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
        filename: "odu_lotion.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c8",
    name: "Olive Oil",
    description: "",
    price: 500,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/427ded8b-e9e1-475e-9c3f-5dbf778bab48_olive_oil_4-zeytTkS.jpg",
        filename: "olive_oil.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/427ded8b-e9e1-475e-9c3f-5dbf778bab48_olive_oil_4-zeytTkS.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/427ded8b-e9e1-475e-9c3f-5dbf778bab48_olive_oil_4-zeytTkS.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c2",
    name: "Moisturizing Cream",
    description: "",
    price: 520,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/7b167ec3-c1c7-4912-bc96-bb6169d4b927_cream_Fwv_Vc_kH.jpg",
        filename: "cream.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/7b167ec3-c1c7-4912-bc96-bb6169d4b927_cream_Fwv_Vc_kH.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/7b167ec3-c1c7-4912-bc96-bb6169d4b927_cream_Fwv_Vc_kH.jpg",
  },
  {
    _id: "690e4112f27e80981ae685cb",
    name: "Sunscreen SPF 50",
    description: "",
    price: 480,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/cf9df68f-b8d4-4b8f-a0bb-5b902d1e04ef_sunscreen_wDaM-LzH3.jpg",
        filename: "sunscreen.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/cf9df68f-b8d4-4b8f-a0bb-5b902d1e04ef_sunscreen_wDaM-LzH3.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/cf9df68f-b8d4-4b8f-a0bb-5b902d1e04ef_sunscreen_wDaM-LzH3.jpg",
  },
  {
    _id: "690e4112f27e80981ae685cc",
    name: "Herbal Toner",
    description: "",
    price: 410,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
        filename: "toner.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/bb525899-4002-42d0-8f73-ee1b9adec645_toner_ankIQcZ6p.jpg",
  },
  {
    _id: "690e4112f27e80981ae685c7",
    name: "Odu Lotion",
    description: ".",
    price: 470,
    images: [
      {
        url: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
        filename: "odu_lotion.jpg"
      }
    ],
    img: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
    hoverImg: "https://ik.imagekit.io/5bprdt07o/products/2c786845-7b80-40c8-a475-acf5355a618a_odu_lotion_6Z4sCXosD.jpg",
  },
];

export const Moisture = () => {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useProducts();
  const navigate = useNavigate();

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, user);
  };

  return (
    <section className="relative w-full min-h-screen px-1 py-20 overflow-hidden bg-[#7ca4a1]">
      <h1 className="text-3xl lg:text-5xl font-bold text-center mb-10 pr-8 text-primary-foreground/80 ">
        RajKonna <span className="italic">Moisturizing Magic</span>
      </h1>

      

      <div className="max-w-7xl mx-auto">
        <div className="relative w-full overflow-hidden">
          {/* Arrow buttons */}
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
                className="min-w-[240px] bg-[#d8cec4] rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
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
