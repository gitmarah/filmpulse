import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGetShowsQuery } from '../redux/tmdbApi';
import Header from '../components/Header';
import type { generalShowType } from '../components/types';

const ShowsPage = () => {
    const [page, setPage] = useState<number>(1)
    const { type } = useParams();
    const {data, isLoading} = useGetShowsQuery({page, type});
    const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", 
    });
  };

  return (
    <>
        <Header />
        {isLoading ? <p>Loading...</p> : <main className='bg-[#f0ffff] max-w-[100vw] min-h-[100vh] pt-20 pb-4 flex flex-col items-center gap-2'>
            {type === "popular" ? <h2 className='font-extrabold text-[#da0009] flex items-center text-lg'>Popular Shows</h2> : type === "top_rated" ? <h2 className='font-extrabold text-[#da0009] flex items-center text-lg'>Top Rated Shows</h2> : type === "upcoming" ? <h2 className='font-extrabold text-[#da0009] flex items-center text-lg'>Upcoming Shows</h2> : ""}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {data && data.results.map((movie: generalShowType) => {
                    return(
                    <Link to={`/show/${movie.id}`}>
                        <article className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                alt={movie.name}
                                className="w-full h-[150px] object-cover"
                            />
                            <div className='p-2 flex flex-col gap-1'>
                                <h2 className='text-[0.8rem] leading-none font-semibold whitespace-nowrap text-ellipsis overflow-hidden text-[#fff1fc]'>{movie.name}</h2>
                            </div>
                            <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                        </article> 
                    </Link>
                )})}
            </div>
            <div className='w-full flex justify-between p-3'>
                <button className='bg-[#da0009] text-[#fff1fc] px-4 py-2 rounded-sm hover:opacity-90 font-bold text-lg disabled:bg-gray-500 cursor-pointer' disabled={page === 1 ? true : false} onClick={() => {setPage(prev => prev - 1); handleScroll()}}>Prev</button>
                <button className='bg-[#da0009] text-[#fff1fc] px-4 py-2 rounded-sm hover:opacity-90 font-bold text-lg cursor-pointer' onClick={() => {setPage(prev => prev + 1); handleScroll()}}>Next</button>
            </div>
        </main>}
    </>
  )
}

export default ShowsPage