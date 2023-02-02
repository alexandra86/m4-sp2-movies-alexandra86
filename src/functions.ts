import { Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import {
  Imovies,
  IMoviesRequest,
  moviesCreate,
  moviesResult,
} from "./interfaces";

export const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const moviesDataRequest: IMoviesRequest = request.body;
  //   const movieData: moviesCreate = {
  //     ...moviesDataRequest,
  //     description: "",
  //   };

  const queryString: string = `
  INSERT INTO
	movies(name, description, duration, price)
	VALUES
	($1, $2, $3, $4)
	RETURNING *;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: Object.values(moviesDataRequest),
  };

  const queryResult: moviesResult = await client.query(queryConfig);
  const newMovieData: Imovies = queryResult.rows[0];

  if (newMovieData) {
    return response.status(409).json({
      message: "Movie already exists.",
    });
  }

  return response.status(201).json(newMovieData);
};

export const listAllMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const query: string = `
        SELECT 
	        *
        FROM 
	        movies;

    `;
  const queryResult: moviesResult = await client.query(query);

  return response.status(200).json(queryResult.rows);
};

export const rescueMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const queryString: string = `
    SELECT
        *
    FROM
        movies
    WHERE
        id = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: moviesResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

export const deleteMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    DELETE FROM
        movies
    WHERE
        id = $1;
`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export const updatesAllMovieData = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const movieData = Object.values(request.body);

  const queryString: string = `
        UPDATE
            movies
        SET
            name = $1,
            description = $2
            duration = $3,
            price = $4,
        WHERE
            id = $5,
        RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [...movieData, id],
  };

  const queryResult: moviesResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};
