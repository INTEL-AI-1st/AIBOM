import mariadb from "mariadb";
import env from "./config";

const isDev = env.SERVER === 'DEV';

const pool = mariadb.createPool({
  host: isDev ? env.DEV_DB_HOST : env.PROP_DB_HOST,
  port: isDev ? 3316 : 3306,
  user: isDev ? env.DEV_DB_USER : env.PROP_DB_USER,
  password: isDev ? env.DEV_DB_PASSWORD : env.PROP_DB_PASSWORD,
  database: isDev ? env.DEV_DB_NAME : env.PROP_DB_NAME,
  connectionLimit: 10,
  acquireTimeout: 20000,
});

export default pool;
