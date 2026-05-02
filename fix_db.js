const { Client } = require('pg');

const client = new Client({
  host: 'ls-5f64aa7ed07442b10117b0598708e167f910fb43.cx0kqa40mod9.ap-northeast-2.rds.amazonaws.com',
  port: 5432,
  user: 'dbmasteruser',
  password: 'database36!!',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    await client.query("UPDATE TB_NTALK_USER_ACCOUNT SET password_hash = 'admin123!' WHERE email = 'admin@ntalk.com'");
    console.log('Update Success');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
