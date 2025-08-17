/*
 * Copyright 2020-2099 sa-token.cc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ApplicationInfo from "../../application/ApplicationInfo";
import SaRequest from "../model/SaRequest";

/**
 * 对 SaRequest 包装类的实现（Mock 版）
 *
 * @author click33 qirly
 * @since 1.42.0
 */

class SaRequestForMock extends SaRequest{
    constructor() {

        super();
        /**
         * 请求参数映射表
         * @type {Map<string, string>}
         */
        this.parameterMap = new Map();
        
        /**
         * 请求头映射表
         * @type {Map<string, string>}
         */
        this.headerMap = new Map();
        
        /**
         * Cookie 映射表
         * @type {Map<string, string>}
         */
        this.cookieMap = new Map();
        
        /**
         * 请求路径
         * @type {string}
         */
        this.requestPath = '';
        
        /**
         * 请求URL
         * @type {string}
         */
        this.url = '';
        
        /**
         * 请求方法
         * @type {string}
         */
        this.method = '';
        
        /**
         * 请求主机
         * @type {string}
         */
        this.host = '';
        
        /**
         * 转发目标路径
         * @type {string}
         */
        this.forwardTo = '';
    }

    /**
     * 获取底层源对象
     * @returns {null} 模拟实现返回null
     */
    getSource() {
        return null;
    }

    /**
     * 在请求体中获取一个值
     * @param {string} name 参数名
     * @returns {string|undefined} 参数值
     */
    getParam(name) {
        return this.parameterMap.get(name);
    }

    /**
     * 获取请求体中所有参数名
     * @returns {string[]} 参数名数组
     */
    getParamNames() {
        return Array.from(this.parameterMap.keys());
    }

    /**
     * 获取请求体中所有参数
     * @returns {Object.<string, string>} 参数键值对
     */
    getParamMap() {
        return Object.fromEntries(this.parameterMap);
    }

    /**
     * 在请求头中获取一个值
     * @param {string} name 头名称
     * @returns {string|undefined} 头值
     */
    getHeader(name) {
        return this.headerMap.get(name);
    }

    /**
     * 获取Cookie值
     * @param {string} name Cookie名称
     * @returns {string|undefined} Cookie值
     */
    getCookieValue(name) {
        return this.getCookieLastValue(name);
    }

    /**
     * 获取第一个匹配的Cookie值
     * @param {string} name Cookie名称
     * @returns {string|undefined} Cookie值
     */
    getCookieFirstValue(name) {
        return this.cookieMap.get(name);
    }

    /**
     * 获取最后一个匹配的Cookie值
     * @param {string} name Cookie名称
     * @returns {string|undefined} Cookie值
     */
    getCookieLastValue(name) {
        return this.cookieMap.get(name);
    }

    /**
     * 获取当前请求路径（不包括上下文名称）
     * @returns {string} 请求路径
     */
    getRequestPath() {
        return ApplicationInfo.cutPathPrefix(this.requestPath);
    }

    /**
     * 获取当前请求URL
     * @returns {string} 请求URL
     */
    getUrl() {
        return this.url;
    }

    /**
     * 获取当前请求方法
     * @returns {string} 请求方法
     */
    getMethod() {
        return this.method;
    }

    /**
     * 获取请求主机
     * @returns {string} 主机名
     */
    getHost() {
        return this.host;
    }

    /**
     * 转发请求
     * @param {string} path 转发路径
     * @returns {null} 模拟实现返回null
     */
    forward(path) {
        this.forwardTo = path;
        return null;
    }

    // /* ----------- 模拟特有的辅助方法 ----------- */

    // /**
    //  * 添加请求参数
    //  * @param {string} name 参数名
    //  * @param {string} value 参数值
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // addParam(name, value) {
    //     this.parameterMap.set(name, value);
    //     return this;
    // }

    // /**
    //  * 添加请求头
    //  * @param {string} name 头名称
    //  * @param {string} value 头值
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // addHeader(name, value) {
    //     this.headerMap.set(name, value);
    //     return this;
    // }

    // /**
    //  * 添加Cookie
    //  * @param {string} name Cookie名称
    //  * @param {string} value Cookie值
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // addCookie(name, value) {
    //     this.cookieMap.set(name, value);
    //     return this;
    // }

    // /**
    //  * 设置请求路径
    //  * @param {string} path 请求路径
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // setRequestPath(path) {
    //     this.requestPath = path;
    //     return this;
    // }

    // /**
    //  * 设置请求URL
    //  * @param {string} url 请求URL
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // setUrl(url) {
    //     this.url = url;
    //     return this;
    // }

    // /**
    //  * 设置请求方法
    //  * @param {string} method 请求方法
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // setMethod(method) {
    //     this.method = method;
    //     return this;
    // }

    // /**
    //  * 设置请求主机
    //  * @param {string} host 主机名
    //  * @returns {SaRequestForMock} 对象自身（链式调用）
    //  */
    // setHost(host) {
    //     this.host = host;
    //     return this;
    // }
}

export default SaRequestForMock;



