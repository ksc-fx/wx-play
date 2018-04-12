import data from './data';
console.log('data', data);
const service = (options) => {

    const result = new Promise(function (resolve, reject) {        //做一些异步操作
        resolve(data);
    });
    return result;
}

export default service;



