import { useNavigate, useParams } from 'react-router-dom'
import { useGetShowQuery } from '../redux/tmdbApi'
import Header from '../components/Header'
import { format } from 'date-fns'
import { ChevronLeftCircle, ChevronRightCircle, ListVideo } from 'lucide-react'
import { skipToken } from '@reduxjs/toolkit/query'
import { useAddFavoriteMutation, useGetFavoriteQuery } from '../redux/userApi'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import type { CompanyType, GenreType, watchlistMovieType } from '../components/types'

const ShowDetail = () => {
    const [isInWatchList, setIsInWatchList] = useState<boolean>(false)
    const {id} = useParams();
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const user = useSelector((state: RootState) => state.user.user);
    const {data, isLoading} = useGetShowQuery(id ?? skipToken)
    let release_date: string = "";
    const navigate = useNavigate();
    if(data){
        const date = new Date(data.first_air_date)
        release_date = format(date, "do MMM, yyyy")
    }
    const watchList = useGetFavoriteQuery(user?._id)
    useEffect(() => {
        const result = watchList.data?.find((movie: watchlistMovieType) => movie.movieId === Number(id));
        if(result){
            setIsInWatchList(prev => !prev);
        }
    }, [watchList, id])

    const [addFavorite] = useAddFavoriteMutation()
    const addToWatchList = async () => {
        const movieData = {
            movieId: data.id,
            userId: user?._id,
            poster: data.poster_path,
            title: data.name,
            status: data.status,
            release_date,
            type: "show",
            checked: false
        }
        try{
            setIsAdding(true)
            const result = await addFavorite(movieData);
            if(result.data){
                setIsAdding(false)
            }
            if(result.error){
                setIsAdding(false)
            }
        } catch(err){
            console.log(err)
        }
    }

    return (
        <>
            <Header />
            <main className={`bg-[#f0ffff] max-w-[100vw] min-h-[100vh] flex flex-col items-center pt-[4rem] pb-4 ${(data && !data.backdrop_path) && 'pt-[11rem]'}`}>
                {isLoading ? <p className='mt-20 text-center'>Loading...</p> : <><div className='max-w-2xl'>
                    <div className='w-full relative'>
                       <img src={`https://image.tmdb.org/t/p/w342${data.backdrop_path}`} alt="" className='w-full opacity-60' />
                        <img src={`https://image.tmdb.org/t/p/w342${data.poster_path}`} alt="" className='h-[150px] object-cover absolute -bottom-16 mx-5 shadow-md rounded-md' /> 
                        <button className={`bg-[#da0009] text-[#fff1fc] px-4 rounded-sm font-bold py-2 flex w-45 items-center justify-center gap-1 absolute bottom-2 right-2 hover:opacity-90 cursor-pointer disabled:bg-gray-500 ${!data.backdrop_path && 'left-32 -bottom-4'}`} onClick={addToWatchList} disabled={isInWatchList}>
                            {isAdding ? <Loader /> : <><ListVideo size={17} color='#fff1fc' strokeWidth={3} className='mt-[2px]' /> 
                            <p>Add to WatchList</p></>}
                        </button>
                    </div>
                    
                    <div className='pl-32 pr-3 text-[#170000] w-full'>
                        <h1 className='font-bold text-ellipsis overflow-hidden whitespace-nowrap'>{data.name}</h1>
                        <p className='text-sm -mt-[3px]'>{release_date}</p>
                        <p className='text-sm -mt-[3px]'>{data.status}</p>
                    </div>
                    <div className='p-3'>
                        <div className='flex gap-2 justify-center bg-amber-300 py-1 rounded-sm mb-2'>
                            {data.production_companies.map((company: CompanyType) => {if(company.logo_path) return <img key={company.logo_path} src={`https://image.tmdb.org/t/p/w92/${company.logo_path}`} className="w-10 shrink-0 object-contain" />})}
                        </div>
                        <h2 className='font-bold text-[#da0009]'>Overview</h2>
                        <p className='text-sm text-[#170000] mb-2'>
                            {data.overview}
                        </p>
                        {/* <h2 className='font-bold text-[#da0009]'>Genre(s)</h2> */}
                        <div className='text-sm text-[#170000] mb-2'>
                            {data.genres.map((genre: GenreType) => <div key={genre.name} className='flex items-center gap-1 '><ChevronRightCircle size={15} color='#da0009' strokeWidth={3} className='mt-[2px]'/><p>{genre.name}</p></div>)}
                        </div>
                        <h2 className='font-bold text-[#da0009]'>Seasons: <span className='text-sm text-[#170000] mb-2'>
                            {data.number_of_seasons}
                        </span></h2>
                        <h2 className='font-bold text-[#da0009]'>Episodes: <span className='text-sm text-[#170000] mb-2'>
                            {data.number_of_episodes}
                        </span></h2>
                        
                    </div>
                    <div className='w-full flex justify-center'>
                        <button onClick={() => navigate(-1)} className='bg-[#da0009] text-[#fff1fc] px-4 rounded-sm font-bold py-2 flex w-fit items-center justify-center gap-1 hover:opacity-90'>
                            <ChevronLeftCircle size={17} color='#fff1fc' strokeWidth={3} className='mt-[2px]' /> 
                            <p>Go Back</p>
                        </button>
                    </div>
                </div></>}
            </main>
        </>
    )
}

export default ShowDetail