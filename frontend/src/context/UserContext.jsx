import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { server } from "../main";
import toast, { Toaster } from 'react-hot-toast';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    // 🟢 Login User
    async function loginUser(email, password, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/login`, { email, password });
            toast.success(data.message);
            localStorage.setItem("token", data.token);
            setUser(data.user);
            setIsAuth(true);
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed");
            setIsAuth(false);
        } finally {
            setBtnLoading(false);
        }
    }

    // 🟢 Register User
    async function registerUser(name, email, password, navigate) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post(`${server}/api/user/register`, { name, email, password });
            toast.success(data.message);
            localStorage.setItem("activationToken", data.activationToken);
            navigate("/verify");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration Failed");
        } finally {
            setBtnLoading(false);
        }
    }

    // 🟢 Verify OTP
    async function verifyOtp(otp, navigate) {
        setBtnLoading(true);
        const activationToken = localStorage.getItem("activationToken");
        try {
            const { data } = await axios.post(`${server}/api/user/verify`, { otp, activationToken }); // ✅ Corrected endpoint
            toast.success(data.message);
            localStorage.removeItem("activationToken");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP Verification Failed");
        } finally {
            setBtnLoading(false);
        }
    }

    // 🟢 Fetch User
    async function fetchUser() {
        try {
            const { data } = await axios.get(`${server}/api/user/me`, {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setIsAuth(true);
            setUser(data.user);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                setIsAuth,
                isAuth,
                loginUser,
                btnLoading,
                loading,
                registerUser,
                verifyOtp,
            }}
        >
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
