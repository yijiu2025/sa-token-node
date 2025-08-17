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


import SaResponse from '../model/SaResponse';

/**
 * 对 SaResponse 包装类的实现（Mock 版）
 *
 * @author click33 qirly
 * @since 1.42.0
 */



class SaResponseForMock extends SaResponse {
    constructor() {
        super();
        /**
         * 响应状态码
         * @type {number}
         */
        this.status = -1;
        
        /**
         * 响应头映射表
         * @type {Map<string, string>}
         */
        this.headerMap = new Map();
        
        /**
         * 重定向地址
         * @type {string|null}
         */
        this.redirectTo = null;
    }

    /**
     * 获取底层源对象
     * @returns {null} 模拟实现返回null
     */
    getSource() {
        return null;
    }

    /**
     * 设置响应状态码
     * @param {number} sc 状态码
     * @returns {SaResponseForMock} 对象自身（链式调用）
     */
    setStatus(sc) {
        this.status = sc;
        return this;
    }

    /**
     * 设置响应头（覆盖已存在的值）
     * @param {string} name 头名称
     * @param {string} value 头值
     * @returns {SaResponseForMock} 对象自身（链式调用）
     */
    setHeader(name, value) {
        this.headerMap.set(name, value);
        return this;
    }

    /**
     * 添加响应头（不覆盖已存在的值）
     * @param {string} name 头名称
     * @param {string} value 头值
     * @returns {SaResponseForMock} 对象自身（链式调用）
     */
    addHeader(name, value) {
        //if (!this.headerMap.has(name)) {
            this.headerMap.set(name, value);
        //}
        return this;
    }

    /**
     * 重定向
     * @param {string} url 重定向地址
     * @returns {null} 模拟实现返回null
     */
    redirect(url) {
        this.redirectTo = url;
        return null;
    }

    // /* ----------- 模拟特有的辅助方法 ----------- */

    // /**
    //  * 获取设置的响应头值
    //  * @param {string} name 头名称
    //  * @returns {string|undefined} 头值
    //  */
    // getHeader(name) {
    //     return this.headerMap.get(name);
    // }

    // /**
    //  * 检查是否包含指定响应头
    //  * @param {string} name 头名称
    //  * @returns {boolean} 是否包含
    //  */
    // hasHeader(name) {
    //     return this.headerMap.has(name);
    // }

    // /**
    //  * 清除所有设置的响应头
    //  * @returns {SaResponseForMock} 对象自身（链式调用）
    //  */
    // clearHeaders() {
    //     this.headerMap.clear();
    //     return this;
    // }

    // /**
    //  * 转换为字符串表示
    //  * @returns {string} 对象的字符串描述
    //  */
    // toString() {
    //     return `SaResponseForMock [status=${this.status}, headers=${JSON.stringify(Object.fromEntries(this.headerMap))}, redirectTo=${this.redirectTo}]`;
    // }
}

export default SaResponseForMock;

