import { Link,  } from 'react-router-dom'
import Header from '../components/Header'
import { useGetPopularMoviesQuery, useGetUpcomingMoviesQuery, useGetTopRatedMoviesQuery, useGetPopularShowsQuery, useGetTopRatedShowsQuery, useSearchMovieQuery, useSearchShowQuery } from '../redux/tmdbApi'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { specificMovieType, specificShowType } from '../components/types'

const Home = () => {
    const upcomingMovies = useGetUpcomingMoviesQuery(2);
    const popularMovies = useGetPopularMoviesQuery(1);
    const topRatedMovies = useGetTopRatedMoviesQuery(1);
    const popularShows = useGetPopularShowsQuery(1);
    const topRatedShows = useGetTopRatedShowsQuery(1);
    const [isActive, setIsActive] = useState<boolean>(false)
    const [query, setQuery] = useState<string>("")
    const [result, setResult] = useState<(specificMovieType | specificShowType)[]>([])
    const movieResult = useSearchMovieQuery(query)
    const showResult = useSearchShowQuery(query)

    useEffect(()=>{
        if(query === ""){
            setIsActive(false)
        }
        
    }, [query])
     
    const searchQuery = () => {
        setIsActive(true)
        const newArray = [...[...movieResult.data.results].map(result => ({...result, type: "movie"})), ...[...showResult.data.results].map(result => ({...result, type: "show"}))]
        const sortedArray = newArray.sort((a, b) => a.vote_average < b.vote_average ? 1 : b.vote_average < a.vote_average ? -1 : 0 )
        setResult(sortedArray)
    }



    return (
        <>
            <Header />
            <main className='flex flex-col items-center justify-start min-h-[100vh] w-full bg-[#f0ffff] pt-20 pb-4 gap-[0.4rem]'>
                <section className='w-full max-w-2xl flex justify-center mt-1'>
                    <input className='text-[1rem] border border-e-0 border-[#ddd] inset-shadow-sm w-[60%] text-lg rounded-s-sm py-1 px-2 focus:outline-none text-[#170000]' type="text" placeholder='Search for movies' name="" id="" autoFocus value={query} onChange={(e) => setQuery(e.target.value)}/>
                    <button className='bg-[#da0009] w-18 text-lg rounded-e-sm py-1 px-2 focus:outline-none text-[#fff1fc] font-semibold cursor-pointer transition-all hover:opacity-90 text-[1rem] flex justify-center' onClick={searchQuery}>Search</button>
                </section>
                {isActive &&
                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl px-3 py-1">
                        {result && result.map((movie) => (
                            <Link to={`/${movie.type}/${movie.id}`}>
                                <article className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-[150px] object-cover"
                                    />
                                    <div className='p-2 flex flex-col gap-1'>
                                        <h2 className='text-[0.8rem] text-[#fff1fc] leading-none font-semibold whitespace-nowrap text-ellipsis overflow-hidden'>{movie.type === "movie" ? movie.title : movie.name}</h2>
                                    </div>
                                    <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                                </article> 
                            </Link>
                        ))}
                    </div>
                }
                {(query === "" || !isActive) && <div className='max-w-4xl'>
                {popularMovies?.data && <section id="popular-movies" className='flex flex-col gap-[0.2rem] mb-2 text-[0.9rem]'>
                    <Link className='font-bold text-[#da0009] flex items-center' to={"/movies/popular"}>
                        <h2>Popular Movies</h2>
                        <ChevronRight strokeWidth={3} size={20}/>
                    </Link>
                    <div className="flex overflow-x-scroll scrollbar-hide gap-2 max-w-[94vw]">
                        {popularMovies.data.results.map((movie: specificMovieType) => (
                            <Link key={movie.id} to={`/movie/${movie.id}`}>
                                <article className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-[150px] object-cover"
                                    />
                                    <div className='p-2 flex flex-col gap-1'>
                                        <h2 className='text-[0.8rem] text-[#fff1fc] leading-none font-semibold whitespace-nowrap text-ellipsis overflow-hidden'>{movie.title}</h2>
                                    </div>
                                    <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                                </article> 
                            </Link>
                        ))}
                    </div>
                </section>}
                {topRatedMovies?.data?.results && <section id="top-rated-movies" className='flex flex-col gap-[0.2rem] mb-2 text-[0.9rem]'>
                    <Link className='font-bold text-[#da0009] flex items-center' to={"/movies/top_rated"}>
                        <h2>Top Rated Movies</h2>
                        <ChevronRight strokeWidth={3} size={20}/>
                    </Link>
                    <div className="flex overflow-x-scroll scrollbar-hide gap-2 max-w-[94vw]">
                        {topRatedMovies.data?.results.map((movie: specificMovieType) => (
                            <Link key={movie.id} to={`/movie/${movie.id}`}>
                                <article key={movie.id} className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-[150px] object-cover"
                                    />
                                    <div className='p-2 flex flex-col gap-1'>
                                        <h2 className='text-[0.8rem] leading-none font-semibold whitespace-nowrap text-ellipsis overflow-hidden text-[#fff1fc]'>{movie.title}</h2>
                                    </div>
                                    <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>}
                {upcomingMovies?.data?.results && <section id="upcoming-movies" className='flex flex-col gap-[0.2rem] mb-2 text-[0.9rem]'>
                    <Link className='font-bold text-[#da0009] flex items-center' to={"/movies/upcoming"}>
                        <h2>Upcoming Movies</h2>
                        <ChevronRight strokeWidth={3} size={20}/>
                    </Link>
                    <div className="flex overflow-x-scroll scrollbar-hide gap-2 max-w-[94vw]">
                        {upcomingMovies.data?.results.map((movie: specificMovieType) => (
                            <Link key={movie.id} to={`/movie/${movie.id}`}>
                                <article key={movie.id} className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full h-[150px] object-cover"
                                    />
                                    <div className='p-2 flex flex-col gap-1'>
                                        <h2 className='text-[0.8rem] leading-none font-semibold whitespace-nowrap text-ellipsis overflow-hidden text-[#fff1fc]'>{movie.title}</h2>
                                    </div>
                                    <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                                </article> 
                            </Link>
                        ))}
                    </div>
                </section>}
                {topRatedShows?.data && <section id="top-rated-shows" className='flex flex-col gap-[0.2rem] mb-2 text-[0.9rem]'>
                    <Link className='font-bold text-[#da0009] flex items-center' to={"/shows/top_rated"}>
                        <h2>Top Rated Shows</h2>
                        <ChevronRight strokeWidth={3} size={20}/>
                    </Link>
                    <h2 className='font-bold text-[#da0009]'></h2>
                    <div className="flex overflow-x-scroll scrollbar-hide gap-2 max-w-[94vw]">
                        {topRatedShows.data.results.map((movie: specificShowType) => (
                            <Link key={movie.id} to={`/show/${movie.id}`}>
                                <article className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                        alt={movie.name}
                                        className="w-full h-[150px] object-cover"
                                    />
                                    <div className='p-2 flex flex-col gap-1'>
                                        <h2 className='text-[0.8rem] leading-none text-[#fff1fc] font-semibold whitespace-nowrap text-ellipsis overflow-hidden'>{movie.name}</h2>
                                    </div>
                                    <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                                </article> 
                            </Link>
                        ))}
                    </div>
                </section>}
                {popularShows?.data && <section id="popular-shows" className='flex flex-col gap-[0.2rem] mb-2 text-[0.9rem]'>
                    <Link className='font-bold text-[#da0009] flex items-center' to={"/shows/popular"}>
                        <h2>Popular Shows</h2>
                        <ChevronRight strokeWidth={3} size={20}/>
                    </Link>
                    <div className="flex overflow-x-scroll scrollbar-hide gap-2 max-w-[94vw]">
                        {popularShows.data.results.map((movie: specificShowType) => (
                            <Link key={movie.id} to={`/show/${movie.id}`}>
                            <article className="flex-shrink-0 w-[100px] bg-[#170000] shadow-md rounded overflow-clip relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                    alt={movie.name}
                                    className="w-full h-[150px] object-cover"
                                />
                                <div className='p-2 flex flex-col gap-1'>
                                    <h2 className='text-[0.8rem] leading-none text-[#fff1fc] font-semibold whitespace-nowrap text-ellipsis overflow-hidden'>{movie.name}</h2>
                                </div>
                                <div id="circle" className={`w-6 h-6 bg-[#da0009] rounded-full border-2 text-[0.6rem] font-extrabold text-[#fff1fc] flex items-center justify-center absolute right-1 top-1`}>{movie.vote_average?.toFixed(1)}</div>
                            </article> 
                            </Link>
                        ))}
                    </div>
                </section>}
                </div>}
            </main>
        </>
        
    )
}

export default Home