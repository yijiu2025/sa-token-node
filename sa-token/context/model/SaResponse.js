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
//package cn.dev33.satoken.context.model;

import SaCookie from "./SaCookie.js";

/**
 * Response 响应对象 包装类
 *
 * @author click33 qirly
 * @since 1.16.0
 */

class SaResponse {
    /**
     * 指定前端可以获取到哪些响应头时使用的参数名
     */
    static ACCESS_CONTROL_EXPOSE_HEADERS = "Access-Control-Expose-Headers";

    /**
     * 获取底层被包装的源对象
     * @returns {Object} 底层响应对象
     */
    getSource() {
        throw new Error('Method getSource() must be implemented');
    }

    /**
     * 删除指定Cookie
     * @param {string} name Cookie名称
     */
    deleteCookie(name) {
        this.addCookie(name, null, null, null, 0);
    }

    /**
     * 删除指定Cookie（带路径和作用域）
     * @param {string} name Cookie名称
     * @param {string} path Cookie路径
     * @param {string} domain Cookie作用域
     */
    deleteCookie(name, path, domain) {
        this.addCookie(name, null, path, domain, 0);
    }

    /**
     * 写入指定Cookie
     * @param {string} name Cookie名称
     * @param {string} value Cookie值
     * @param {string} path Cookie路径
     * @param {string} domain Cookie作用域
     * @param {number} timeout 过期时间（秒）
     */
    // addCookie(name, value, path, domain, timeout) {
    //     this.addCookieModel(new SaCookie(name, value)
    //         .setPath(path)
    //         .setDomain(domain)
    //         .setMaxAge(timeout));
    // }

    /**
     * 写入指定Cookie（使用SaCookie对象）
     * @param {SaCookie} cookie Cookie模型对象
     */
    // addCookieModel(cookie) {
    //     this.addHeader(SaCookie.HEADER_NAME, cookie.toHeaderValue());
    // }

    addCookie(nameOrCookie, value, path, domain, timeout) {
        const cookie = (nameOrCookie instanceof SaCookie)
            ? nameOrCookie
            : new SaCookie(nameOrCookie, value)
                .setPath(path)
                .setDomain(domain)
                .setMaxAge(timeout);
        
        this.addHeader(SaCookie.HEADER_NAME, cookie.toHeaderValue());
        return this;
    }





    /**
     * 设置响应状态码
     * @param {number} sc 状态码
     * @returns {SaResponse} 对象自身（链式调用）
     */
    setStatus(sc) {
        throw new Error('Method setStatus() must be implemented');
    }

    /**
     * 在响应头里设置一个值（覆盖已存在的值）
     * @param {string} name 头名称
     * @param {string} value 头值
     * @returns {SaResponse} 对象自身（链式调用）
     */
    setHeader(name, value) {
        throw new Error('Method setHeader() must be implemented');
    }

    /**
     * 在响应头里添加一个值（不覆盖已存在的值）
     * @param {string} name 头名称
     * @param {string} value 头值
     * @returns {SaResponse} 对象自身（链式调用）
     */
    addHeader(name, value) {
        throw new Error('Method addHeader() must be implemented');
    }

    /**
     * 设置Server响应头
     * @param {string} value 服务器名称
     * @returns {SaResponse} 对象自身（链式调用）
     */
    setServer(value) {
        return this.setHeader("Server", value);
    }

    /**
     * 重定向
     * @param {string} url 重定向地址
     * @returns {any} 重定向结果
     */
    redirect(url) {
        throw new Error('Method redirect() must be implemented');
    }
}

export default SaResponse;