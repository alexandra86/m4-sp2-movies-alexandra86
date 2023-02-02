import { QueryResult } from "pg";

export interface IMoviesRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface Imovies extends IMoviesRequest {
  id: number;
}

export type moviesResult = QueryResult<Imovies>;
export type moviesCreate = Omit<Imovies, "id">;
