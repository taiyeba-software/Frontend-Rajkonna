"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";


const productData = [
  {
    id: 1,
    title: "Light Moisturizer",
    desc: "Vitamin C infused.",
    img: "/Moisture/1.png",
    hoverImg: "/Moisture/10.jpg",
    price: 25,
    discountedPrice: 18,
  },
  {
    id: 2,
    title: "All Purpose Toner",
    desc: "Deep hydration overnight.",
    img: "/Moisture/2.png",
    hoverImg: "/Moisture/20.jpg",
    price: 20,
    discountedPrice: 15,
  },
  {
    id: 3,
    title: "Brightening Body Lotion",
    desc: "Balances & preps skin.",
    img: "/Moisture/3.png",
    hoverImg: "/Moisture/30.jpg",
    price: 22,
    discountedPrice: 16,
  },
  {
    id: 4,
    title: "Olive Oil",
    desc: "Balances & preps skin.",
    img: "/Moisture/4.png",
    hoverImg: "/Moisture/40.jpg",
    price: 28,
    discountedPrice: 21,
  },
  {
    id: 5,
    title: "Toner",
    desc: "Balances & preps skin.",
    img: "/Moisture/2.png",
    hoverImg: "/Moisture/20.jpg",
    price: 28,
    discountedPrice: 21,
  },
  {
    id: 6,
    title: "Light Moisturizer",
    desc: "Vitamin C infused.",
    img: "/Moisture/1.png",
    hoverImg: "/Moisture/10.jpg",
    price: 25,
    discountedPrice: 18,
  },
  {
    id: 7,
    title: "All Purpose Toner",
    desc: "Deep hydration overnight.",
    img: "/Moisture/2.png",
    hoverImg: "/Moisture/20.jpg",
    price: 20,
    discountedPrice: 15,
  },
];

export const Moisture = () => {
  const scrollRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
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
                key={product.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="min-w-[240px] bg-[#d8cec4] rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={hoveredIndex === index ? product.hoverImg : product.img}
                  alt={product.title}
                  className="w-full h-56 object-cover rounded-md mb-4"
                />

                <h3 className="text-lg font-bold text-amber-900 mb-1">
                  {product.title}
                </h3>
                <p className="text-sm text-[#7ca4a1] mb-2">{product.desc}</p>

                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-sm line-through text-gray-400">
                    ${product.price}
                  </span>
                  <span className="text-lg font-bold text-fuchsia-950">
                    ${product.discountedPrice}
                  </span>
                </div>

                <button className="px-5 py-2 rounded-full bg-pink-500 text-white font-semibold tracking-wide shadow-md hover:bg-pink-600 hover:scale-105 transition-transform duration-300">
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
