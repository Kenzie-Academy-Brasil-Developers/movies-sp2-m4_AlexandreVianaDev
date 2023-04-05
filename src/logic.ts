import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { IMovie, TMovieCreate, TMovieResult } from "./interfaces";
import { client } from "./database";

export const insertQuery = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body: payload } = req;
  const queryString: string = `
    INSERT INTO movies
        (name, category, duration, price)
    VALUES
        ($1, $2, $3, $4)
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(payload),
  };

  const queryResult: TMovieResult = await client.query(queryConfig);
  const movie: IMovie = queryResult.rows[0];

  return res.status(201).json(movie);
};

export const insertMoviesFormat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body: payload } = req;
  const queryString: string = format(
    `
      INSERT INTO movies
          (%I)
      VALUES
          (%L)
      RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: TMovieResult = await client.query(queryString);
  const movie: IMovie = queryResult.rows[0];

  return res.status(201).json(movie);
};

export const retrieveMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT * FROM movies;
    `;

  const queryResult: TMovieResult = await client.query(queryString);
  const movies: Array<IMovie> = queryResult.rows;

  return res.json(movies);
};

export const retrieveMovieById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const queryString: string = `
    SELECT *
    FROM movies
    WHERE id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult = await client.query(queryConfig);
  const movie = queryResult.rows[0];

  return res.json(movie);
};

export const updateMovie = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { body: payload } = req;
  const id: number = res.locals.id;
  const queryString: string = format(
    `
    UPDATE movies
    SET (%I) = (%L)
    WHERE id = $1
    RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.json(queryResult);
};

export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = res.locals.id;
  const queryString: string = `
    UPDATE movies
    SET (%I) = (%L)
    WHERE id = $1
    RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return res.send();
};
