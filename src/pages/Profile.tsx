import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { Link } from 'react-router-dom'
import { useCheckFavoriteMutation, useDeleteFavoriteMutation, useGetFavoriteQuery } from '../redux/userApi'
import { setWatchList } from '../redux/userSlice'
import { Monitor, MonitorCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Loader from '../components/Loader'
import type { watchlistMovieType } from '../components/types'

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const { data, isLoading } = useGetFavoriteQuery(user?._id)
    const [deleteFavorite] = useDeleteFavoriteMutation();
    const [checkFavorite] = useCheckFavoriteMutation();
    const [isChecking, setIsChecking] = useState<{status: boolean, id: string}>({
        status: false,
        id: ""
    });
    const [isDeleting, setIsDeleting] = useState<{status: boolean, id: string}>({
        status: false,
        id: ""
    });
    let sortedData: watchlistMovieType[] = [];
    if(data){
        dispatch(setWatchList(data))
        sortedData = [...data].sort((a, b) => {
            return Number(b.checked) - Number(a.checked);
        });
    }

    const removeFromList = async (id: string) => {
        try{
            setIsDeleting({status: true, id})
            const result = await deleteFavorite(id);
            if(result){
                setIsDeleting({status: false, id})
            } 
        } catch (err) {
            setIsDeleting({status: false, id})
            console.log(err)
        }
    }
    const checkMovie = async (id: string) => {
        try{
            setIsChecking({status: true, id})
            const result = await checkFavorite({movieId: id});
            if(result){
                setIsChecking({status: false, id})
            } 
        } catch (err) {
            setIsChecking({status: false, id})
            console.log(err)
        }
        
    }

  return (
    <>
        <Header />
        <main className='flex flex-col items-center min-h-[100vh] w-full bg-[#f0ffff] pt-20 gap-[0.4rem] px-4'>
            <div className='w-full flex gap-3 items-center py-2 max-w-3xl'>
                <img src={`${user?.imageUrl}`} alt="" className='w-[100px] h-[100px] rounded-full'/>
                <div className='text-[#170000] flex-3/4 min-w-0'>
                    <h2 className='font-bold text-2xl text-ellipsis overflow-hidden whitespace-nowrap'>{user?.firstname} {user?.lastname}</h2>
                    <p className='text-ellipsis overflow-hidden'>{user?.email}</p>
                    <Link to="/edit-profile" className=''><button className='bg-[#da0009] text-[#fff1fc] mt-[0.4rem] py-1 px-3 rounded-sm font-bold cursor-pointer'>
                        Edit Profile
                    </button></Link>
                </div>
            </div>
            {isLoading ? <p className='pt-20 text-center'>Loading...</p> : data && <div className='max-w-3xl'>
                {data && sortedData.map(movie => <div key={movie._id} className='w-[100vw] max-w-3xl flex items-center justify-between gap-3 px-3 py-2 border-t-[1px] border-gray-400'>
                    <div>
                        {(isChecking.status && isChecking.id === movie._id) ? <div className='bg-[#170000] py-2 px-4 rounded-sm'><Loader /></div> : movie.checked ? <MonitorCheck size={50} strokeWidth={2.5} color='#170000' className='cursor-pointer' onClick={() => checkMovie(movie._id)} /> : <Monitor size={50} strokeWidth={2.5} color='#170000' className='cursor-pointer' onClick={() => checkMovie(movie._id)}/>}
                    </div>
                    <Link to={`/${movie.type}/${movie.movieId}`} className='flex w-[70%] items-center gap-3 overflow-hidden'>
                        <img
                            src={`https://image.tmdb.org/t/p/w342${movie.poster}`}
                            alt={movie.title}
                            className="w-[50px] object-cover rounded-sm"
                        />
                        <div className='text-[#170000] w-30'>
                            <h1 className='font-bold whitespace-nowrap text-ellipsis overflow-hidden'>{movie?.title}</h1>
                            <p className='text-sm -mt-[3px]'>{movie.release_date}</p>
                            <p className='text-sm -mt-[3px]'>{movie?.status}</p>
                        </div>
                    </Link>
                    <div>
                        {(isDeleting.status && isDeleting.id === movie._id) ? <div className='bg-[#da0009] py-2 px-3 rounded-sm'><Loader /></div> : <Trash2 size={50} color='#da0009' strokeWidth={2.5} className='cursor-pointer' onClick={() => removeFromList(movie._id)}/>}
                    </div>
                </div>)}
            </div>}
        </main>
    </>
  )
}

export default Profile