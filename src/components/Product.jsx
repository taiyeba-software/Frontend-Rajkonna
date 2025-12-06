
import { Facewash} from "./Facewash";
import { Moisture} from "./Moisture";
import  StarBackground  from "./StarBackground";

export const Product = () => {
  return (
    <div id="products">
      <StarBackground />
      <Facewash />
      <Moisture/>
    </div>
  );
};