var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_ROOT: '"http://localhost:6020"',
    // API_ROOT: '"http://192.168.1.50:6020"',
    // API_ROOT:'"http://gxzzpt2-api.szazkj.com"',
})