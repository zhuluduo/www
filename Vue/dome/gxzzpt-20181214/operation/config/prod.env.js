/*module.exports = {
  NODE_ENV: '"production"',
  API_ROOT:'"http://192.168.1.161:9010"'
}*/
var url;
if(process.argv.length>2){
  url = "http://"+process.argv.slice(2)[0].slice(2);
}else{
  url = "http://192.168.1.160:9010";
}
module.exports = {
  NODE_ENV: '"production"',
  API_ROOT:"'"+url+"'"
}
