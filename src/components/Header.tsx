import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { Link } from 'react-router-dom';
import { clearCredentials } from '../redux/authSlice';
import { useGetUserQuery, useSignOutUserMutation } from '../redux/authApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState, useEffect } from 'react';
import { setUser } from '../redux/userSlice';

const Header = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const user = useSelector((state: RootState) => state.auth.user);
    const {data, status} = useGetUserQuery(user?.id ?? skipToken);
    const dispatch = useDispatch();

    const userData = data;
    
    useEffect(() => {
        if (status === "fulfilled" || status === "uninitialized") {
            setIsLoading(false);
            dispatch(setUser({data}))
        }
    }, [status, data, dispatch]);

    const [signOutUser] = useSignOutUserMutation()

    const signOut = async () => {
        await signOutUser({}).unwrap()
        dispatch(clearCredentials());
    }

    return (
        <header className='fixed flex text-[#fff1fc] bg-[#170000] justify-between items-center top-0 left-0 right-0 p-4 z-50'>
            <h1 className='font-black text-2xl'><Link to="/">filmpulse</Link></h1>
            <div>
               {isLoading ? <p></p> : user && userData ? <div className='flex gap-3'><Link to="/profile" className='bg-[#fff1fc] text-[#170000] w-[40px] h-[40px] rounded-full hover:opacity-95 font-bold transition-all overflow-clip border-2 border-[#fff1fc]'><img className='w-full' src={userData.imageUrl} alt="" /></Link><button onClick={signOut} className='bg-[#fff1fc] text-[#170000] px-3 py-2 rounded-sm hover:opacity-95 font-bold transition-all cursor-pointer'>Signout</button></div> : <div className='flex gap-3'><Link to="/signin" className='bg-[#fff1fc] text-[#170000] px-3 py-2 rounded-sm hover:opacity-95 font-bold transition-all'>Signin</Link><Link to="/signup" className='bg-[#fff1fc] text-[#170000] px-3 py-2 rounded-sm hover:opacity-95 font-bold transition-all'>Create Account</Link></div>} 
            </div>
            
        </header>
    )
}

export default Header