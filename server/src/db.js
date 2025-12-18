// db.js dosyası : 
// postgreSql ile tek bir merkezden bağlantı kurar
// uygulama boyunca aynı bağlantı havuzunu (pool) kullandırır.
// sql sorgularını tek tip ve temiz bir şekilde çalıştırmamızı sağlar.
import pg from "pg";
import { DATABASE_URL } from "./config.js";

export const pool = new pg.Pool({
  connectionString: DATABASE_URL
});


export function query(text, params) {
  return pool.query(text, params);
}