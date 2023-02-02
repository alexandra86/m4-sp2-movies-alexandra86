import { Client } from "pg";

export const client: Client = new Client({
  user: "Alexandra",
  password: "8607",
  host: "localhost",
  database: "tables",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected!");
};
