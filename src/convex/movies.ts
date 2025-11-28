"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not set");
    return { results: [] };
  }
  
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("api_key", TMDB_API_KEY);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from TMDB: ${endpoint}`, error);
    throw error;
  }
}

export const search = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) return [];
    try {
      const data = await fetchTMDB("/search/movie", { query: args.query });
      return data.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getPopular = action({
  args: {},
  handler: async (ctx) => {
    try {
      const data = await fetchTMDB("/movie/popular");
      return data.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getTrending = action({
  args: {},
  handler: async (ctx) => {
    try {
      const data = await fetchTMDB("/trending/movie/week");
      return data.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});

export const getUpcoming = action({
  args: {},
  handler: async (ctx) => {
    try {
      const data = await fetchTMDB("/movie/upcoming");
      return data.results || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
});
