import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home"
import NotFound from "./pages/NotFound";
import AuthModal from './components/modals/AuthModal'; // ✅ Add this

function App() {

  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>

        {/* ✅ Global modal mounted once */}
        <AuthModal />
      </BrowserRouter>
    </>
  )
}

export default App
 