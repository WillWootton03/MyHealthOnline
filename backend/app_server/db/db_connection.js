const { Pool } = require('pg');


// Neon database connection using ENV DATABASE URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/*
    : EXAMPLE PSQL command
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [1]); 
*/

module.exports = { pool };