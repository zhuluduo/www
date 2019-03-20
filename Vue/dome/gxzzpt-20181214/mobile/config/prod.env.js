'use strict'

var ApiUrl = "http://localhost:6020";
var clientUrl = "";
console.log(process.argv)

if(process.argv.length == 4) {
  ApiUrl = "http://" + process.argv[2];
  clientUrl = process.argv[3];
}

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: "'" + ApiUrl + "'",
  CLIENT_ROOT: "'" + clientUrl + "'"
}
