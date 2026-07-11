const { Pool } = require('pg');


let connectionString = null;

if (process.env.NODE_ENV === 'development') connectionString = process.env.DEV_DATABASE_URL;
else if (process.env.NODE_ENV === 'test') connectionString = process.env.TEST_DATABASE_URL;
else if (process.env.NODE_ENV === 'production') connectionString = process.env.PROD_DATABASE_URL;

// Neon database connection using ENV DATABASE URL
const pool = new Pool({connectionString: connectionString });

/*
    : EXAMPLE PSQL command
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [1]); 
*/

module.exports = { pool };