import {Navbar } from "../components/Navbar";
import { Hero} from "../components/Hero";
import {AboutSection} from "../components/AboutSection"
import ProductList from "./ProductList";

import { Contact} from "../components/Contact";
import { RajkonnaFooter } from "../components/RajkonnaFooter";


const Home = () => (
  <>
    <div className=" min-h-screen  text-foreground overflow-x-hidden ">
      <Navbar/>
      {/* Sticky Hero + Video should be isolated */}
      <section className="relative z-[20] min-h-screen">
        <Hero />
      </section>

    </div>

     {/* About section should appear normally, ABOVE z-10 */}
      <section className="relative z-[30]">
        <AboutSection />

        <section id="products" className="relative w-full min-h-screen px-1 ">
          <h1 className="text-3xl font-bold text-center py-8 text-white">Rajkonna Products</h1>
          <ProductList /> {/* reusable component */}
        </section>

        <Contact/>
        <RajkonnaFooter/>
      </section>
  </>
);

export default Home;
