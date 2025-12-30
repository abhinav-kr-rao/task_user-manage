import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
console.log("printing ditenv");

console.log(dotenv.config());
console.log("DEBUG: My Database URL is:", String(process.env.DATABASE_URL));

const pool = new pg.Pool({
  connectionString: String(process.env.DATABASE_URL),
  // Uncomment the line below if deploying to Render/Neon (Cloud DB)
  // ssl: { rejectUnauthorized: false }
});

console.log("pool is ", pool);

export default {
  query: (text, params) => pool.query(text, params),
};
