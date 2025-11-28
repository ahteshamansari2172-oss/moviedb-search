declare module 'moviedb-promise' {
  export interface MovieResult {
    id: number;
    title: string;
    poster_path?: string;
    backdrop_path?: string;
    overview: string;
    release_date?: string;
    vote_average?: number;
    [key: string]: any;
  }

  export interface SearchMovieRequest {
    query: string;
    page?: number;
    include_adult?: boolean;
    region?: string;
    year?: number;
    primary_release_year?: number;
  }

  export interface MovieResponse {
    page?: number;
    results?: MovieResult[];
    total_results?: number;
    total_pages?: number;
  }

  export class MovieDb {
    constructor(apiKey: string, baseUrl?: string);
    searchMovie(params: SearchMovieRequest): Promise<MovieResponse>;
    moviePopular(params?: any): Promise<MovieResponse>;
    trending(params?: any): Promise<MovieResponse>;
    upcomingMovies(params?: any): Promise<MovieResponse>;
  }
}
