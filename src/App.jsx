import React from 'react'
import { Routes,Route,useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collections from './pages/Collections'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import TrackOrder from './pages/TrackOrder'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import WhatsAppButton from './Components/WhatsAppButton'
import { ToastContainer } from 'react-toastify';
import'react-toastify/dist/ReactToastify.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        newestOnTop
        stacked
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        draggable
        theme="colored"
        closeButton
        toastClassName="modern-toast"
        bodyClassName="modern-toast-body"
      />
      <ScrollToTop />
      <Navbar/>
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='collections' element={<Collections/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/placeOrder' element={<PlaceOrder/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/track/:orderId' element={<TrackOrder/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/change-password' element={<ChangePassword/>}/>
      </Routes>
      <Footer/>
      <WhatsAppButton />
    </div>
  )
}
export default App
