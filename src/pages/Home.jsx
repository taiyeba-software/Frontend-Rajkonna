import {Navbar } from "../components/Navbar";
import { Hero} from "../components/Hero";
import {AboutSection} from "../components/AboutSection"
import { Product} from "../components/Product";
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
        <Product/>
        <Contact/>
        <RajkonnaFooter/>
      </section>
  </>
);

export default Home;