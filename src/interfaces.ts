import { QueryResult } from "pg";

export interface IMovie {
  id: number;
  name: string;
  category: string;
  duration: number;
  price: number;
}

export type TMovieCreate = Omit<IMovie, "id">;
export type TMovieResult = QueryResult<IMovie>;
