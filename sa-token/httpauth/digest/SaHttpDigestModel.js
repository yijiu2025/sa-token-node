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


/**
 * Sa-Token Http Digest 认证 - 参数实体类
 *
 * @author click33
 * @since 1.38.0
 */


class SaHttpDigestModel {
    /**
     * 默认的 Realm 领域名称
     */
    static DEFAULT_REALM = "Sa-Token";

    /**
     * 默认的 qop 值
     */
    static DEFAULT_QOP = "auth";

    /**
     * 构造函数
     * @param {string} username 用户名
     * @param {string} password 密码
     * @param {string} realm 领域
     */
    constructor(username, password, realm = SaHttpDigestModel.DEFAULT_REALM) {
        this.username = username;
        this.password = password;
        this.realm = realm;
        /**
         * 随机数
         */
        this.nonce = null;
        /**
         * 请求 uri
         */
        this.uri = null;
        /**
         * 请求方法
         */
        this.method = null;
        /**
         * 保护质量（auth=默认的，auth-int=增加报文完整性检测），可以为空，但不推荐
         */
        this.qop = null;
        /**
         * nonce计数器，是一个16进制的数值，表示同一nonce下客户端发送出请求的数量
         */
        this.nc = null;
        /**
         * 客户端随机数，由客户端提供
         */
        this.cnonce = null;
        /**
         * opaque
         */
        this.opaque = null;
        /**
         * 请求摘要，最终计算的摘要结果
         */
        this.response = null;
    }

    // ------------------- Getter/Setter 方法 -------------------


    /**
     * 获取 用户名
     *
     * @return username 用户名
     */
    getUsername() {
        return this.username;
    }

    /**
     * 设置 用户名
     *
     * @param username 用户名
     * @return /
     */
    setUsername(username) {
        this.username = username;
        return this;
    }

    /**
     * 获取 领域
     *
     * @return realm 领域
     */
    getRealm() {
        return this.realm;
    }

    /**
     * 设置 领域
     *
     * @param realm 领域
     * @return /
     */
    setRealm(realm) {
        this.realm = realm;
        return this;
    }

    /**
     * 获取 密码
     *
     * @return password 密码
     */
    getPassword() {
        return this.password;
    }

    /**
     * 设置 密码
     *
     * @param password 密码
     * @return /
     */
    setPassword(password) {
        this.password = password;
        return this;
    }

    /**
     * 获取 随机数
     *
     * @return nonce 随机数
     */
    getNonce() {
        return this.nonce;
    }

    /**
     * 设置 随机数
     *
     * @param nonce 随机数
     * @return /
     */
    setNonce(nonce) {
        this.nonce = nonce;
        return this;
    }

    /**
     * 获取 请求 uri
     *
     * @return uri 请求 uri
     */
    getUri() {
        return this.uri;
    }

    /**
     * 设置 请求 uri
     *
     * @param uri 请求 uri
     * @return /
     */
    setUri(uri) {
        this.uri = uri;
        return this;
    }

    /**
     * 获取 请求方法
     *
     * @return method 请求方法
     */
    getMethod() {
        return this.method;
    }

    /**
     * 设置 请求方法
     *
     * @param  method 请求方法
     * @return {SaHttpDigestModel} /
     */
    setMethod(method) {
        this.method = method;
        return this;
    }

    /**
     * 获取 保护质量（auth=默认的，auth-int=增加报文完整性检测），可以为空，但不推荐
     *
     * @return qop 保护质量（auth=默认的，auth-int=增加报文完整性检测），可以为空，但不推荐
     */
    getQop() {
        return this.qop;
    }

    /**
     * 设置 保护质量（auth=默认的，auth-int=增加报文完整性检测），可以为空，但不推荐
     *
     * @param qop 保护质量（auth=默认的，auth-int=增加报文完整性检测），可以为空，但不推荐
     * @return /
     */
    setQop(qop) {
        this.qop = qop;
        return this;
    }

    /**
     * 获取 nonce计数器，是一个16进制的数值，表示同一nonce下客户端发送出请求的数量
     *
     * @return nc nonce计数器，是一个16进制的数值，表示同一nonce下客户端发送出请求的数量
     */
    getNc() {
        return this.nc;
    }

    /**
     * 设置 nonce计数器，是一个16进制的数值，表示同一nonce下客户端发送出请求的数量
     *
     * @param nc nonce计数器，是一个16进制的数值，表示同一nonce下客户端发送出请求的数量
     * @return /
     */
    setNc(nc) {
        this.nc = nc;
        return this;
    }

    /**
     * 获取 客户端随机数，由客户端提供
     *
     * @return cnonce 客户端随机数，由客户端提供
     */
    getCnonce() {
        return this.cnonce;
    }

    /**
     * 设置 客户端随机数，由客户端提供
     *
     * @param cnonce 客户端随机数，由客户端提供
     * @return /
     */
    setCnonce(cnonce) {
        this.cnonce = cnonce;
        return this;
    }

    /**
     * 获取 opaque
     *
     * @return opaque opaque
     */
    getOpaque() {
        return this.opaque;
    }

    /**
     * 设置 opaque
     *
     * @param opaque opaque
     * @return /
     */
    setOpaque(opaque) {
        this.opaque = opaque;
        return this;
    }

    /**
     * 获取 请求摘要，最终计算的摘要结果
     *
     * @return response 请求摘要，最终计算的摘要结果
     */
    getResponse() {
        return this.response;
    }

    /**
     * 设置 请求摘要，最终计算的摘要结果
     *
     * @param response 请求摘要，最终计算的摘要结果
     * @return /
     */
    setResponse(response) {
        this.response = response;
        return this;
    }

    // ------------------- 其他方法 -------------------

    /**
     * 转换为字符串
     * @return {string}
     */
    toString() {
        return `SaHttpDigestModel[username=${this.username},` +
               `password=${this.password},realm=${this.realm},` +
               `nonce=${this.nonce},uri=${this.uri},` +
               `method=${this.method},qop=${this.qop},` +
               `nc=${this.nc},cnonce=${this.cnonce},` +
               `opaque=${this.opaque},response=${this.response}]`;
    }
}

export default SaHttpDigestModel;

