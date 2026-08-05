import { createContext,  useEffect,  useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase.js'
import { backendUrl } from '../config.js'
export const ShopContext = createContext();

// Maps Firebase / network / backend errors to a user friendly message.
const getGoogleErrorMessage = (error) => {
    if (!error) return 'Something went wrong. Please try again.'
    const code = error.code || ''
    switch (code) {
        case 'auth/popup-closed-by-user':
        case 'auth/cancelled-popup-request':
            return 'Sign-in popup was closed before completing.'
        case 'auth/popup-blocked':
            return 'Popup was blocked by your browser. Please allow popups and try again.'
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email. Try signing in another way.'
        case 'auth/network-request-failed':
            return 'Network error. Check your internet connection and try again.'
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid credentials. Please try again.'
        default:
            if (error.response) {
                return error.response.data?.message || 'Backend error. Please try again.'
            }
            return error.message || 'Something went wrong. Please try again.'
    }
}

const ShopContextProvider = (props) =>{

    const currency = 'Rs';
    const delivery_fee = 300;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products,setProducts] = useState([]);
    const [categories,setCategories] = useState([]);
    const [token,setToken] = useState('')
    const [user,setUser] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();

    const loadUserProfile = async () => {
        const t = localStorage.getItem('token');
        if (!t) return;
        try {
            const response = await axios.post(backendUrl + '/api/user/profile',{}, {headers:{token:t}})
            if (response.data.success) {
                setUser(response.data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        setCartItems({})
        // Sign out from Firebase so the user has to pick an account next time
        if (auth) {
            signOut(auth).catch(() => {})
        }
    }

    // Handles the full Google sign-in flow: popup -> backend -> JWT -> state
    const googleLogin = async () => {
        if (!auth) {
            toast.error('Firebase is not configured yet. Add your config in src/firebase.js')
            return false
        }
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const { displayName, email, photoURL, uid } = result.user
            const response = await axios.post(backendUrl + '/api/user/google-login', {
                displayName,
                email,
                photoURL,
                uid
            })
            if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                setToken(response.data.token)
                setUser(response.data.user)
                toast.success(`Welcome, ${response.data.user.name || 'friend'}!`)
                return true
            }
            toast.error(response.data.message || 'Google sign-in failed. Please try again.')
            return false
        } catch (error) {
            console.log(error)
            toast.error(getGoogleErrorMessage(error))
            return false
        }
    }

    const addToCart = async(itemId,size) => {
        if (!token) {
            toast.error('Please login to add items to your cart');
            sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
            navigate('/login');
            return;
        }
        if (!size) {
            toast.error('Select Product Model');
            return;
        }

        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
        toast.success('Product added to cart successfully.');
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add',{itemId,size},{headers:{token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
                
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId,size,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData)

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update',{itemId,size,quantity},{headers:{token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)
                
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product) => product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }
    const getProductsData = async ()=>{
        try {
            const response = await axios.get( backendUrl + '/api/product/list')
            if(response.data.success){
                setProducts(response.data.products)
            }else{
                toast.error(response.data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const getCategoriesData = async ()=>{
        try {
            const response = await axios.get( backendUrl + '/api/category/list')
            if(response.data.success){
                setCategories(response.data.categories)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get',{},{ headers: {token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }
    useEffect(()=>{
        getProductsData()
        getCategoriesData()
    },[location.pathname])
    useEffect(()=>{
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    },[])
    useEffect(()=>{
        if (token) {
            loadUserProfile()
        } else {
            setUser(null)
        }
    },[token])

    const value={
        products,categories,currency,delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems,addToCart,setCartItems,
        getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token, user, setUser, loadUserProfile, logout, googleLogin,
        getProductsData,getCategoriesData
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider