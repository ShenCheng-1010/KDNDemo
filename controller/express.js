const config = require('../config/express');
const axios = require('axios');
const crypto = require('crypto');
const {base64encode} = require('nodejs-base64');
const querystring = require('querystring');

/**
 * 需要传入三个参数
 订单编号
 快递公司编号
 快递单号
 */
async function getOrderTracesByJson(ctx) {
    //OrderCode订单编号,不可重复,自定义  ShipperCode快递公司编码 LogisticCode快递单号
    // let requestData = "{'OrderCode':'','ShipperCode':'YTO','LogisticCode':'12345678'}"
    const {OrderCode, ShipperCode, LogisticCode} = ctx.query;
    if (!ShipperCode || !LogisticCode){
        throw ("缺少必要参数！");
    }
    let data = {
        OrderCode: OrderCode,
        ShipperCode: ShipperCode,
        LogisticCode: LogisticCode
    };
    let requestData = JSON.stringify(data);
    let sign = encrypt(requestData, config.AppKey);
    // console.log(sign);
    let PostData = querystring.stringify(
        {
            EBusinessID: config.EBusinessID,
            RequestType: '1002',
            RequestData: requestData,
            DataType: '2',
            DataSign: sign
        }
    );
    // console.log(PostData);

    // return await sendPost(config.ReqURL, PostData);
    return sendPost(config.ReqURL, PostData);
}

/**
* 电商sign 签名生成
* @param data 内容
* @param AppKey AppKey
* @return string
*/
function encrypt(data, AppKey) {
    let md5 = crypto.createHash('md5');
    return encodeURI(base64encode(md5.update(data + AppKey).digest('hex')))
}

/**
 *
 * @param {*} ReqURL 请求地址
 * @param {*} PostData
 * @return string
 */
async function sendPost(ReqURL, PostData) {

    axios({
        url: ReqURL,
        method: 'POST',
        data: PostData,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'charset': 'utf-8'
        }
    }).then(res => {
        return res.data

    }).catch(error => {
        console.log('e:' + error);
        throw(error)
    })

}

module.exports = {
    getOrderTracesByJson
};