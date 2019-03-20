/*module.exports = {
  NODE_ENV: '"production"',
  API_ROOT:'"http://192.168.1.161:9010"'
}*/
// var url;
// var clientUrl = "";
// if(process.argv.length>2){
//   url = "http://"+process.argv.slice(2)[0].slice(2);
//   clientUrl = process.argv[3];
// }else{
//   url = "http://192.168.1.160:9010";
// }
// module.exports = {
//   NODE_ENV: '"production"',
//   API_ROOT:"'"+url+"'",
//   CLIENT_ROOT: "'" + clientUrl + "'"
// }
'use strict'

var ApiUrl = "http://192.168.1.160:9010";
var clientUrl = "";
console.log(process.argv)

if (process.argv.length == 4) {
  ApiUrl = "http://" + process.argv[2];
  clientUrl = process.argv[3];
}

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: "'" + ApiUrl + "'",
  CLIENT_ROOT: "'" + clientUrl + "'"
}