const authJwt = require('./authjwt.middleware');
const validation = require('./validation.middleware');

module.exports = {
    authJwt,
    validation
}