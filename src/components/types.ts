export type authSliceUserType = {
    firstname: string, 
    lastname: string, 
    roles: number[], 
    id: string
} | null;

export type RefreshReturnType = {
    user: authSliceUserType,
    token: string
}

export type SignInFormType = {
    email: string,
    password: string
}

export type SignInResponseType = {
    data?: RefreshReturnType,
    error?: {
        data:{ message: string }
    }
}
export type SignUpResponseType = {
    data?: {message: string},
    error?: {
        data:{ message: string }
    }
}

export type watchlistMovieType = {
    _id: string,
    movieId: number,
    userId: string,
    poster: string,
    title: string,
    status: string,
    release_date: string,
    type: string,
    checked: boolean
}

export type generalShowType = {
    adult: false,
    backdrop_path: string,
    first_air_date: string,
    genre_ids: number[],
    id: number,
    name: string,
    origin_country: string[],
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    poster_path: string,
    vote_average: number,
    vote_count: number
}

export type generalMovieType = {
    adult: false,
    backdrop_path: string,
    genre_ids: number[],
    id: number,
    title: string,
    origin_country: string[],
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    vote_average: number,
    vote_count: number,
    release_date: string,
    video: boolean
}


export type CompanyType = {id: number, logo_path: string, name: string, origin_country: string}
export type GenreType = {id: number, name: string}

export type specificShowType = {
    adult: false,
    backdrop_path: string,
    created_by: {credit_id: string, gender: number, id: 23227, name: string, original_name: string, profile_path: string}[],
    episode_run_time: [],
    first_air_date: string,
    last_air_date: string,
    genres: GenreType[],
    homepage: string,
    genre_ids: number[],
    id: number,
    in_production: boolean,
    languages: string[]
    name: string,
    title: string,
    networks: {id: number, logo_path: string, name: string, origin_country: string}[],
    next_episode_to_air: null,
    number_of_episodes: number,
    number_of_seasons: number,
    origin_country: string[],
    original_language: string,
    original_name: string,
    overview: string,
    popularity: number,
    production_companies: CompanyType[],
    production_countries: {iso_3166_1: string, name: string}[],
    seasons: {air_date: string, episode_count: number, id: number, name: string, overview: string, poster_path: string, season_number: number, vote_average: number}[],
    spoken_languages: {english_name: string, iso_639_1: string, name: string}[],
    poster_path: string,
    status: string,
    tagline: string,
    type: string,
    vote_average: number,
    vote_count: number
}

export type specificMovieType = {
    adult: false,
    backdrop_path: string,
    belongs_to_collection: {id: number, name: string, poster_path: string}[],
    budget: number,
    imdb_id: string,
    release_date: string,
    revenue: number,
    runtime: number,
    genres: GenreType[],
    homepage: string,
    id: number,
    languages: string[]
    title: string,
    name: string,
    origin_country: string[],
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    production_companies: CompanyType[],
    production_countries: {iso_3166_1: string, name: string}[],
    spoken_languages: {english_name: string, iso_639_1: string, name: string}[],
    poster_path: string,
    status: string,
    tagline: string,
    type: string,
    vote_average: number,
    vote_count: number
}
