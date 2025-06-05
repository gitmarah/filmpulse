import { Routes, Route } from "react-router-dom"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import VerifySignIn from "./pages/VerifySignIn"
import Home from "./pages/Home"
import MoviesPage from "./pages/MoviesPage"
import ShowsPage from "./pages/ShowsPage"
import { useEffect } from "react"
import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { useDispatch } from "react-redux"
import { setCredentials } from "./redux/authSlice"
import MovieDetail from "./pages/MovieDetail"
import ShowDetail from "./pages/ShowDetail"
import ProtectedRoute from "./components/ProtectedRoute"
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile"
import type { BaseQueryApi } from "@reduxjs/toolkit/query"
import type { RefreshReturnType } from "./components/types"

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    const refreshAccessToken = async () => {
      const rawBaseQuery = fetchBaseQuery({
        baseUrl: "https://filmpulseserver.onrender.com",
        credentials: "include"
      })
      try{
        const result = await rawBaseQuery("/refresh", {} as BaseQueryApi, {});
        console.log(result)
        if(result?.data){
          const data = result?.data as RefreshReturnType
          dispatch(setCredentials({user: data?.user, token: data?.token}))
        }
        if(result?.error){
          dispatch(setCredentials({isAuthLoading: null}))
        }
      }catch (err){    
        console.log(err)
      }
    }
    refreshAccessToken();
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signin" element={<SignIn />}/>
      <Route path="/signin/:token" element={<VerifySignIn />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/show/:id" element={<ShowDetail />} />
        <Route path="/movies/:type" element={<MoviesPage />} />
        <Route path="/shows/:type" element={<ShowsPage />} />
      </Route>
      </Routes>
      
  )
}

export default App
