import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { IMovie, TMovieResult } from "./interfaces";
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

// insertQueryFormat
export const insertQueryFormat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { body: payload } = req;
  const queryString: string = format(
    `
      INSERT INTO movies
          (name, category, duration, price)
      VALUES
          ($1, $2, $3, $4)
      RETURNING *;
    `,
    Object.keys(payload),
    Object.values(payload)
  );

  const queryResult: TMovieResult = await client.query(queryString);
  const movie: IMovie = queryResult.rows[0];

  return res.status(201).json(movie);
};
