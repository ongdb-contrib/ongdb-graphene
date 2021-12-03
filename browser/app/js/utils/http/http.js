'use strict';

/**
 *
 * @param {string} httpUrl:HTTP请求地址
 * @param {string} username:访问用户
 * @param {string} password:访问密码
 * @param {json} para:JSON格式的请求参数
 * @returns {JSONObject}
 */
function post(httpUrl, username, password, para) {
  d3.json(httpUrl, para, function (error, responseData) {
    console.log(error, responseData);
    if (error) {
      return console.warn(error);
    }
  });
}

export default post;
