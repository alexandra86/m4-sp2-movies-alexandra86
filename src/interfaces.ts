import { QueryResult } from "pg";

export interface IMoviesRequest {
  name: string;
  description?: string | null;
  duration: number;
  price: number;
}

export interface Imovies extends IMoviesRequest {
  id: number;
}

export interface Pagination {
  prevPage: string;
  nextPage: string;
  data: Imovies[];
}

export type moviesResult = QueryResult<Imovies>;
export type moviesCreate = Omit<Imovies, "id">;
export type movieRequestKeys = "name" | "duration" | "price";
