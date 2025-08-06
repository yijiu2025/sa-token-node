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



import SaErrorCode from "../../error/SaErrorCode.js";
import SaTokenException from "../../exception/SaTokenException.js";
import SaHttpMethod from "../../router/SaHttpMethod.js";
import SaFoxUtil from "../../util/SaFoxUtil.js";

/**
 * Request 请求对象 包装类
 *
 * @author click33
 * @since 1.16.0
 */


class SaRequest {
    /**
     * 获取底层被包装的源对象
     * @returns {Object} 底层请求对象
     */
    getSource() {
        throw new Error('Method getSource() must be implemented');
    }

    /**
     * 在请求体中获取一个参数值
     * @param {string} name 参数名
     * @returns {string} 参数值
     */
    getParam(name) {
        throw new Error('Method getParam() must be implemented');
    }

    /**
     * 在请求体中获取一个参数值，值为空时返回默认值
     * @param {string} name 参数名
     * @param {string} defaultValue 默认值
     * @returns {string} 参数值
     */
    getParam(name, defaultValue = '') {
        const value = this.getParam(name);
        return SaFoxUtil.isEmpty(value) ? defaultValue : value;
    }

    /**
     * 检测请求参数是否为指定值
     * @param {string} name 参数名
     * @param {string} value 预期值
     * @returns {boolean} 是否匹配
     */
    isParam(name, value) {
        const paramValue = this.getParam(name);
        return SaFoxUtil.isNotEmpty(paramValue) && paramValue === value;
    }

    /**
     * 检测请求是否包含指定参数
     * @param {string} name 参数名
     * @returns {boolean} 是否包含
     */
    hasParam(name) {
        return SaFoxUtil.isNotEmpty(this.getParam(name));
    }

    /**
     * 获取请求参数值（必须存在，否则抛出异常）
     * @param {string} name 参数名
     * @returns {string} 参数值
     * @throws {SaTokenException} 参数不存在时抛出
     */
    getParamNotNull(name) {
        const paramValue = this.getParam(name);
        if (SaFoxUtil.isEmpty(paramValue)) {
            throw new SaTokenException(`缺少参数：${name}`).setCode(SaErrorCode.CODE_12001);
        }
        return paramValue;
    }

    /**
     * 获取所有请求参数名
     * @returns {string[]} 参数名数组
     */
    getParamNames() {
        throw new Error('Method getParamNames() must be implemented');
    }

    /**
     * 获取所有请求参数
     * @returns {Object.<string, string>} 参数键值对
     */
    getParamMap() {
        throw new Error('Method getParamMap() must be implemented');
    }

    /**
     * 在请求头中获取一个值
     * @param {string} name 头名称
     * @returns {string} 头值
     */
    getHeader(name) {
        throw new Error('Method getHeader() must be implemented');
    }

    /**
     * 在请求头中获取一个值，值为空时返回默认值
     * @param {string} name 头名称
     * @param {string} defaultValue 默认值
     * @returns {string} 头值
     */
    getHeader(name, defaultValue = '') {
        const value = this.getHeader(name);
        return SaFoxUtil.isEmpty(value) ? defaultValue : value;
    }

    /**
     * 获取Cookie值
     * @param {string} name Cookie名称
     * @returns {string} Cookie值
     */
    getCookieValue(name) {
        throw new Error('Method getCookieValue() must be implemented');
    }

    /**
     * 获取第一个匹配的Cookie值
     * @param {string} name Cookie名称
     * @returns {string} Cookie值
     */
    getCookieFirstValue(name) {
        return this.getCookieValue(name);
    }

    /**
     * 获取最后一个匹配的Cookie值
     * @param {string} name Cookie名称
     * @returns {string} Cookie值
     */
    getCookieLastValue(name) {
        return this.getCookieValue(name);
    }

    /**
     * 获取当前请求路径（不包括上下文名称）
     * @returns {string} 请求路径
     */
    getRequestPath() {
        throw new Error('Method getRequestPath() must be implemented');
    }

    /**
     * 检查当前请求路径是否为指定值
     * @param {string} path 预期路径
     * @returns {boolean} 是否匹配
     */
    isPath(path) {
        return this.getRequestPath() === path;
    }

    /**
     * 获取当前请求URL（不带查询参数）返回当前请求的url，不带query参数，例：http://xxx.com/test
     * @returns {string} 请求URL
     */
    getUrl() {
        throw new Error('Method getUrl() must be implemented');
    }

    /**
     * 获取当前请求方法
     * @returns {string} 请求方法
     */
    getMethod() {
        throw new Error('Method getMethod() must be implemented');
    }

    /**
     * 检查当前请求方法是否为指定值
     * @param {string} method 预期方法
     * @returns {boolean} 是否匹配
     */
    isMethod(method) {
        return this.getMethod().toUpperCase() === method.toUpperCase();
    }

    /**
     * 检查当前请求方法是否为指定值（枚举类型）
     * @param {SaHttpMethod} method 预期方法
     * @returns {boolean} 是否匹配
     */
    isMethodEnum(method) {
        return this.isMethod(method.name());
    }

    /**
     * 获取请求主机名
     * @returns {string} 主机名
     */
    getHost() {
        throw new Error('Method getHost() must be implemented');
    }

    /**
     * 判断是否为Ajax请求
     * @returns {boolean} 是否为Ajax请求
     */
    isAjax() {
        return this.getHeader('X-Requested-With')?.toLowerCase() === 'xmlhttprequest' || 
               this.isParam('_ajax', 'true');
    }

    /**
     * 转发请求
     * @param {string} path 转发路径
     * @returns {any} 转发结果
     */
    forward(path) {
        throw new Error('Method forward() must be implemented');
    }
}

export default SaRequest;


