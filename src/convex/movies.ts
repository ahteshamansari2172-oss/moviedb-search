"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { MovieDb } from 'moviedb-promise';

const tmdbApiKey = process.env.TMDB_API_KEY;
const moviedb = new MovieDb(tmdbApiKey || "placeholder");

export const search = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!tmdbApiKey) {
        console.error("TMDB_API_KEY is not set");
        return [];
    }
    if (!args.query) return [];
    try {
        const res = await moviedb.searchMovie({ query: args.query });
        return res.results || [];
    } catch (e) {
        console.error("Error searching movies:", e);
        return [];
    }
  },
});

export const getPopular = action({
  args: {},
  handler: async (ctx) => {
    if (!tmdbApiKey) return [];
    try {
        const res = await moviedb.moviePopular();
        return res.results || [];
    } catch (e) {
        console.error("Error fetching popular movies:", e);
        return [];
    }
  },
});

export const getTrending = action({
    args: {},
    handler: async (ctx) => {
        if (!tmdbApiKey) return [];
        try {
            const res = await moviedb.trending({ media_type: 'movie', time_window: 'week' });
            return res.results || [];
        } catch (e) {
            console.error("Error fetching trending movies:", e);
            return [];
        }
    }
});

export const getUpcoming = action({
    args: {},
    handler: async (ctx) => {
        if (!tmdbApiKey) return [];
        try {
            const res = await moviedb.upcomingMovies();
            return res.results || [];
        } catch (e) {
            console.error("Error fetching upcoming movies:", e);
            return [];
        }
    }
});
