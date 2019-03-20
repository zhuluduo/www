/**
 * [发送异步AJAX请求]
 * @param  {[String]}  options.url    [请求地址]
 * @param  {String}  options.method   [请求方法(GET, POST)]
 * @param  {Object}  options.data     [请求数据包]
 * @param  {String}  contentType      [请求数据包类型]
 * @param  {Boolean} cookie           [是否携带 Cookie]
 * @param  {Boolean} jsonp            [是否使用 JSONP]
 * @param  {String}  jsonpCallback    [JSONP回调函数名称]
 * @return {[type]}                   [服务器响应结果]
 */
export default async function ({
  url = null,
  method = 'get',
  data = {},
  contentType = 'application/x-www-form-urlencoded',
  cookie = false,
  jsonp = false,
  jsonpCallback = 'jsonpCallback'
} = {}) {
  let post = method.toLowerCase() === 'post'

  if (jsonp) post = false

  const opts = {
    method,
    headers: {},
  }

  if (cookie) opts.credentials = 'include'
  contentType && (opts.headers['Content-Type'] = contentType)

  const keys = Object.keys(data)
  const symbol = url.includes('?') ? '&' : '?'
  const query = keys.map(x => x + '=' + data[x]).join('&')
  if (!post) { // get method
    query && (url += symbol + query)
  } else opts.body = JSON.stringify(data)

  // send request
  let response
  if (jsonp) response = await window.fetchJsonp(url, { jsonpCallback }).then(res => res.json())
  else response = await window.fetch(url, opts).then(res => res.json())

  return response
}

