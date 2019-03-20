//网络请求通用模块
import axios from 'axios'

export default async function ({
    url = null,
    method = 'get',
    data = {},
    headers = {},
    } = {})
{

    let response
    
    await axios({
        url: url,
        method: method,
        data: data,
        headers: headers,
    }).then((res) => {
        response = res
    })

    return response
}