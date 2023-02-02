import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import {
  Imovies,
  IMoviesRequest,
  moviesCreate,
  moviesResult,
} from "./interfaces";

const validateDataMovies = (payload: any): IMoviesRequest => {
  if (typeof payload.name !== "string") {
    throw new Error("The movie name need to be a string");
  }
  if (typeof payload.duration !== "number") {
    throw new Error("The movie duration need to be a number");
  }
  if (typeof payload.price !== "number") {
    throw new Error("The movie price need to be a number");
  }
  if (typeof payload.description !== "string" || null) {
    throw new Error("The movie description need to be a string");
  }

  return payload;
};

export const createMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const moviesDataRequest: IMoviesRequest = validateDataMovies(request.body);
    const movieData: moviesCreate = {
      ...moviesDataRequest,
    };

    const queryString: string = format(
      `
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
      Object.keys(movieData),
      Object.values(movieData)
    );

    // if (request.body.name) {
    //   return response.status(409).json({
    //     message: "Error: This movie already exists, please try again.",
    //   });
    // }

    const queryResult: moviesResult = await client.query(queryString);

    const newMovieData: Imovies = queryResult.rows[0];

    return response.status(201).json(newMovieData);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({
        message: error.message,
      });
    }
    console.log(error);
    return response.status(500).json({
      message: "Internal server error",
    });
  }
};

export const listAllMovies = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const perPage: any =
    request.query.perPage === undefined ? 5 : request.query.perPage;
  let page: any = request.query.page === undefined ? 1 : request.query.page;

  page = page * perPage;

  const queryString: string = `
        SELECT
            *
        FROM
            movies
        LIMIT $1 OFFSET $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage, page],
  };

  const queryResult: moviesResult = await client.query(queryConfig);

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
            description = $2,
            duration = $3,
            price = $4
        WHERE
            id = $5
        RETURNING *;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [...movieData, id],
  };

  const queryResult: moviesResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

export const updatesPartialMovieData = async (
  request: Request,
  response: Response
): Promise<Response> => {
  if (request.body.id) {
    return response.status(400).json({
      message: "Error: id cannot be changed.",
    });
  }

  const id: number = parseInt(request.params.id);
  const movieData = Object.values(request.body);
  const movieKeys = Object.keys(request.body);

  const formatString: string = format(
    `
      UPDATE
        movies
        SET(%I) = ROW(%L)
      WHERE
        id = $1
      RETURNING *;
  `,
    movieKeys,
    movieData
  );

  const queryConfig: QueryConfig = {
    text: formatString,
    values: [id],
  };

  const queryResult: moviesResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};
