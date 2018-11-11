require('dotenv').load();
port= process.env.PORT || 3000;
jwt_secret = process.env.JWT_SECRET;
FX_DATABASE_URL = process.env.FX_DATABASE_URL;
TIMER = process.env.TIMER

module.exports = {
    port,
    jwt_secret,
    FX_DATABASE_URL,
    TIMER
}