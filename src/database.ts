import { Client } from "pg";

export const client: Client = new Client({
  user: "Alexandre",
  password: "123321",
  host: "localhost",
  database: "sprint2",
  port: 5432,
});

export const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database connected.");
};
