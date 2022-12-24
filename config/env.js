// import and config dotenv
require('dotenv').config();

// get from spotscale.env(ignored by git)
module.exports = {
    // "LOCALDB": "mongodb://localhost:27017/dbapp",
    "LOCALDB": "mongodb://localhost:27017/dbapp",
    "ATLASDB": process.env.ATLASDB,
    "ATLASDB_USERNAME": process.env.ATLASDB_USERNAME,
    "ATLASDB_PASSWORD": process.env.ATLASDB_PASSWORD,
    "SECRETKEY": process.env.SECRETKEY
}