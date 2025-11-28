import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Search, Film, Star, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  release_date?: string;
  vote_average?: number;
}

export default function Landing() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [category, setCategory] = useState<"popular" | "trending" | "upcoming">("popular");
  const [isLoading, setIsLoading] = useState(false);

  const searchMovies = useAction(api.movies.search);
  const getPopular = useAction(api.movies.getPopular);
  const getTrending = useAction(api.movies.getTrending);
  const getUpcoming = useAction(api.movies.getUpcoming);

  useEffect(() => {
    loadCategory(category);
  }, [category]);

  const loadCategory = async (cat: "popular" | "trending" | "upcoming") => {
    setIsLoading(true);
    try {
      let results: Movie[] = [];
      if (cat === "popular") results = await getPopular({});
      else if (cat === "trending") results = await getTrending({});
      else if (cat === "upcoming") results = await getUpcoming({});
      
      setMovies(results);
      if (results.length > 0 && !query) {
        setFeaturedMovie(results[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchMovies({ query });
      setMovies(results);
      if (results.length > 0) {
        setFeaturedMovie(results[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tighter">CineSearch</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => { setCategory("popular"); setQuery(""); }} className={`text-sm font-medium transition-colors hover:text-primary ${category === 'popular' && !query ? 'text-primary' : 'text-muted-foreground'}`}>Popular</button>
              <button onClick={() => { setCategory("trending"); setQuery(""); }} className={`text-sm font-medium transition-colors hover:text-primary ${category === 'trending' && !query ? 'text-primary' : 'text-muted-foreground'}`}>Trending</button>
              <button onClick={() => { setCategory("upcoming"); setQuery(""); }} className={`text-sm font-medium transition-colors hover:text-primary ${category === 'upcoming' && !query ? 'text-primary' : 'text-muted-foreground'}`}>Upcoming</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path}`} 
              alt={featuredMovie.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto flex flex-col justify-end h-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{featuredMovie.title}</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 line-clamp-3">{featuredMovie.overview}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-foreground">{featuredMovie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>{featuredMovie.release_date?.split('-')[0]}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-10">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-card border border-border rounded-lg shadow-2xl">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for movies..." 
                className="pl-12 py-6 bg-transparent border-none focus-visible:ring-0 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-2" size="sm" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </form>

        {/* Movie Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {query ? `Search Results for "${query}"` : 
               category === 'popular' ? <><Star className="h-6 w-6 text-primary" /> Popular Movies</> :
               category === 'trending' ? <><TrendingUp className="h-6 w-6 text-primary" /> Trending Now</> :
               <><Calendar className="h-6 w-6 text-primary" /> Upcoming Releases</>
              }
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                onClick={() => setFeaturedMovie(movie)}
              >
                <div className="aspect-[2/3] overflow-hidden relative">
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                      <Film className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-sm line-clamp-3">{movie.overview}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate" title={movie.title}>{movie.title}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                    <span>{movie.release_date?.split('-')[0] || 'TBA'}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {movies.length === 0 && !isLoading && (
            <div className="text-center py-20 text-muted-foreground">
              <Film className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl">No movies found</p>
              <p className="text-sm mt-2">Check if TMDB_API_KEY is set in Integrations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}