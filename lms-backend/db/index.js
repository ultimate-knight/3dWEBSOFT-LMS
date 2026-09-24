const sql=require("mysql2")

const dbConnect=sql.createPool({
    host:process.env.host,
    port:process.env.port,
    password:process.env.password,
    database:process.env.database,
    user:process.env.user,
     ssl: {
    rejectUnauthorized: true
  }
})


module.exports={dbConnect}

