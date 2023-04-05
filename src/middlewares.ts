import { NextFunction, Request, Response } from "express";
import { IMovie, TMovieCreate, TMovieResult } from "./interfaces";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";

export const verifyIfNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { body: payload } = req;
  const name = payload.name;
  const queryString: string = `
      SELECT *
      FROM movies
      WHERE name = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  //   const queryResult: QueryResult<TMovieResult> = await client.query(
  //     queryConfig
  //   );

  //   const movies: TMovieResult[] = queryResult.rows;

  if (queryResult.rowCount > 0) {
    console.log("nome do filme utilizado");
    return res.status(409).json({
      error: "Movie name already exists!",
    });
  }

  //   res.locals.movies = movies;
  console.log("nome do filme não utilizado");
  return next();
};

export const verifyIfIdExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);
  const queryString: string = `
      SELECT *
      FROM movies
      WHERE id = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IMovie> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      error: "Movie not found!",
    });
  }

  res.locals.id = id;
  res.locals.movie = queryResult.rows[0];

  return next();
};
