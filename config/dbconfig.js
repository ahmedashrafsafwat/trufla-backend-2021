const env = process.env;
console.log(env.DB_HOST)

let host,port,user,password,database

// use server configs or use local configs
if(env.USE_HEROKU_CONFIG) {
  host = env.HEROKU_HOST
  port = env.HEROKU_PORT
  user = env.HEROKU_USER
  password =  env.HEROKU_PASSWORD
  database =  env.HEROKU_DB
}else {

host = env.DB_HOST
port = env.DB_PORT
user = env.DB_USER
password = env.DB_PASSWORD
database = env.DB_NAME
}
const config = {
  db: { /* don't expose password or any sensitive info, done only for demo */
    host  ,
    port ,
    user,
    password ,
    database ,
  },
  listPerPage: env.LIST_PER_PAGE || 10,
};


module.exports = config;