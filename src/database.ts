import { Client } from "pg";

export const client: Client = new Client({
  user: "Alexandre",
  password: "123321",
  host: "localhost",
  database: "sprint2",
  port: 5432,
});

client.connect();
console.log("Conexão feita.");

// export const queryString: string = `
//     INSERT INTO movies
//         (name, category, duration, price)
//     VALUES
//         ('Exterminador do Futuro', 'Ação',  5292, 29.90)
//     RETURNING *;
//   `;

// client.query(queryString).finally(async () => {
//   await client.end();
//   console.log("Conexão encerrada.");
// });

export const startDatabase = async () => {
  await client.connect();
  console.log("Database connected.");
};
