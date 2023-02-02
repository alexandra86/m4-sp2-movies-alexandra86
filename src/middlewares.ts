import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { moviesResult } from "./interfaces";

export const ensureMoviesExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
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

  if (!queryResult.rowCount) {
    return response.status(404).json({
      message: "Movie not found.",
    });
  }

  return next();
};
