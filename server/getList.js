// http://he.banma.jizhuoyangqing.com/atlanta/joke/list
const service = (options) => {
    options = {
        url: 'http://59.110.240.142:8082/api/joke/list',
        method: 'GET',
        dataType: 'json',
        data: {
            // appid: '',
            // accesstoken: '',
            // rating: ''
            // clientid: 1,
            // scenario: '',
            // author: '',
            // page: 1,
            // limit: 10
        },
        ...options
    }
    const result = new Promise(function (resolve, reject) {        //做一些异步操作
        const optionsData = {
            success: res => {
                resolve(res.data);
            },
            fail: error => {
                reject(error)
            },
            ...options
        }
        wx.request(optionsData)
    });
    return result;
}

export default service;



