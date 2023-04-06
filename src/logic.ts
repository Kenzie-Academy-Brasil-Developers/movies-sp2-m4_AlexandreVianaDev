import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { IMovie, TMovieCreate, TMovieResult } from "./interfaces";
import { client } from "./database";

export const insertMoviesFormat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const movieData: TMovieCreate = req.body;
  const queryString: string = format(
    `
      INSERT INTO movies
          (%I)
      VALUES
          (%L)
      RETURNING *;
    `,
    Object.keys(movieData),
    Object.values(movieData)
  );

  const queryResult: TMovieResult = await client.query(queryString);
  const movie: IMovie = queryResult.rows[0];

  return res.status(201).json(movie);
};

export const retrieveMovies = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const category: any | undefined = req.query.category;

  if (category?.length > 0) {
    const queryString: string = `
      SELECT *
      FROM movies
      WHERE category = $1;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [category],
    };

    const queryResult: TMovieResult = await client.query(queryConfig);
    const movies: Array<IMovie> = queryResult.rows;

    if (movies?.length === 0) {
      const queryString: string = `
        SELECT *
        FROM movies;
    `;

      const queryResult: TMovieResult = await client.query(queryString);
      const movies: Array<IMovie> = queryResult.rows;

      return res.json(movies);
    }

    return res.json(movies);
  }

  const queryString: string = `
    SELECT *
    FROM movies;
  `;

  const queryResult: TMovieResult = await client.query(queryString);
  const movies: Array<IMovie> = queryResult.rows;

  return res.json(movies);
};

export const retrieveMovieById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = res.locals.id;
  const queryString: string = `
    SELECT *
    FROM movies
    WHERE id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TMovieResult = await client.query(queryConfig);
  const movie: IMovie = queryResult.rows[0];

  return res.json(movie);
};

export const updateMovie = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const movieData: Partial<TMovieCreate> = req.body;
  const id: number = res.locals.id;

  const updateColumns: string[] = Object.keys(movieData);
  const updateValues: (string | number)[] = Object.values(movieData);

  const queryTemplate: string = `
      UPDATE movies
      SET (%I) = ROW(%L)
      WHERE id = $1
      RETURNING *;
    `;

  const queryFormat: string = format(
    queryTemplate,
    updateColumns,
    updateValues
  );

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [id],
  };

  const queryResult: TMovieResult = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteMovie = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = res.locals.id;
  const queryString: string = `
    DELETE FROM movies
    WHERE id = $1
    RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: TMovieResult = await client.query(queryConfig);

  return res.status(204).send();
};
