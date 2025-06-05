import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { Navigate, Outlet } from 'react-router-dom'
import Header from './Header'

const ProtectedRoute = () => {
    const {token, isAuthLoading} = useSelector((state: RootState) => state.auth)
    if(isAuthLoading) return <><Header/><p className='mt-20 text-center'>Loading...</p></>
    return token ? <Outlet /> : <Navigate to="/signin" replace />
}

export default ProtectedRoute