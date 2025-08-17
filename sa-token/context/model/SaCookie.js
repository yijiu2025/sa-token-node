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
import SaFoxUtil from "../../util/SaFoxUtil.js";

/**
 * Cookie Model，代表一个 Cookie 应该具有的所有参数
 *
 * @author click33 qirly
 * @since 1.16.0
 */

class SaCookie {
    /**
     * 写入响应头时使用的key
     */
    static HEADER_NAME = 'Set-Cookie';

    /**
     * 构造函数
     * @param {string} [name] Cookie 名称
     * @param {string} [value] Cookie 值
     */
    constructor(name, value) {
        /**
         * 名称
         * @type {string}
         */
        this.name = name || '';
        
        /**
         * 值
         * @type {string}
         */
        this.value = value || '';
        
        /**
         * 有效时长（单位：秒），-1 代表为临时Cookie，浏览器关闭后自动删除
         * @type {number}
         */
        this.maxAge = -1;
        
        /**
         * 域
         * @type {string}
         */
        this.domain = '';
        
        /**
         * 路径
         * @type {string}
         */
        this.path = '';
        
        /**
         * 是否只在 https 协议下有效
         * @type {boolean}
         */
        this.secure = false;
        
        /**
         * 是否禁止 js 操作 Cookie
         * @type {boolean}
         */
        this.httpOnly = false;
        
        /**
         * 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
         * @type {string}
         */
        this.sameSite = '';
        
        // Cookie 属性参考文章：https://blog.csdn.net/fengbin2005/article/details/136544226
        /**
         * 额外扩展属性
         * @type {Map<string, string>}
         */
        this.extraAttrs = new Map();
    }

    /* ----------- Getter/Setter 方法 ----------- */
    /**
     * @return 名称
     */
    getName() {
        return this.name;
    }

    /**
     * @param name 名称
     * @return 对象自身
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     * @return 值
     */
    getValue() {
        return this.value;
    }

    /**
     * @param value 值
     * @return 对象自身
     */
    setValue(value) {
        this.value = value;
        return this;
    }

    /**
     * @return 有效时长 （单位：秒），-1 代表为临时Cookie 浏览器关闭后自动删除
     */
    getMaxAge() {
        return this.maxAge;
    }

    /**
     * @param maxAge 有效时长 （单位：秒），-1 代表为临时Cookie 浏览器关闭后自动删除
     * @return 对象自身
     */
    setMaxAge(maxAge) {
        this.maxAge = maxAge;
        return this;
    }

    /**
     * @return 域
     */
    getDomain() {
        return this.domain;
    }

    /**
     * @param domain 域
     * @return 对象自身
     */
    setDomain(domain) {
        this.domain = domain;
        return this;
    }

    /**
     * @return 路径
     */
    getPath() {
        return this.path;
    }

    /**
     * @param path 路径
     * @return 对象自身
     */
    setPath(path) {
        this.path = path;
        return this;
    }

    /**
     * @return 是否只在 https 协议下有效
     */
    getSecure() {
        return this.secure;
    }

    /**
     * @param secure 是否只在 https 协议下有效
     * @return 对象自身
     */
    setSecure(secure) {
        this.secure = secure;
        return this;
    }

    /**
     * @return 是否禁止 js 操作 Cookie
     */
    getHttpOnly() {
        return this.httpOnly;
    }

    /**
     * @param httpOnly 是否禁止 js 操作 Cookie
     * @return 对象自身
     */
    setHttpOnly(httpOnly) {
        this.httpOnly = httpOnly;
        return this;
    }

    /**
     * @return 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
     */
    getSameSite() {
        return this.sameSite;
    }

    /**
     * @param sameSite 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
     * @return 对象自身
     */
    setSameSite(sameSite) {
        this.sameSite = sameSite;
        return this;
    }

    /**
     * @return 获取额外扩展属性
     */
    getExtraAttrs() {
        return this.extraAttrs;
    }

    /**
    * 写入额外扩展属性
    * @param extraAttrs /
    * @return 对象自身
    */
    setExtraAttrs(extraAttrs) {
        this.extraAttrs = new Map(Object.entries(extraAttrs || {}));
        return this;
    }

    /* ----------- 扩展属性操作方法 ----------- */

    /**
     * 追加扩展属性
     * @param {string} name 属性名
     * @param {string} [value] 属性值（可选）
     * @returns {SaCookie} 对象自身（链式调用）
     */
    addExtraAttr(name, value = null) {
        this.extraAttrs.set(name, value);
        return this;
    }

    /**
     * 移除指定扩展属性
     * @param {string} name 属性名
     * @returns {SaCookie} 对象自身（链式调用）
     */
    removeExtraAttr(name) {
        // if(extraAttrs != null) {
        //     this.extraAttrs.remove(name);
        // }
        this.extraAttrs.delete(name);
        return this;
    }

    /* ----------- 其他方法 ----------- */

    /**
     * 构建默认值（如未设置 path 则设为 "/"）
     */
    builder() {
        if (!this.path) {
            this.path = '/';
        }
    }

    /**
     * 转换为字符串表示
     * @returns {string} Cookie 的字符串描述
     */
    toString() {
        return `SaCookie [name=${this.name}, value=${this.value}, maxAge=${this.maxAge}, ` +
               `domain=${this.domain}, path=${this.path}, secure=${this.secure}, ` +
               `httpOnly=${this.httpOnly}, sameSite=${this.sameSite}, ` +
               `extraAttrs=${JSON.stringify(Object.fromEntries(this.extraAttrs))}]`;
    }

    /**
     * 转换为响应头 Set-Cookie 参数需要的值
     * @returns {string} Set-Cookie 头部的值
     * @throws {Error} 当 name 为空或 value 包含分号时抛出异常
     */
    toHeaderValue() {
        this.builder();

        // 参数校验
        if (!this.name) {
            throw new SaTokenException('name不能为空').setCode(SaErrorCode.CODE_12002);
        }
        if (this.value && this.value.includes(';')) {
            throw new SaTokenException("无效Value：" + value).setCode(SaErrorCode.CODE_12003);
        }

        // 构建 Set-Cookie 字符串
        const parts = [
            `${this.name}=${this.value}`
        ];

        // 添加 Max-Age 和 Expires
        if (this.maxAge >= 0) {
            parts.push(`Max-Age=${this.maxAge}`);
            
            let expires;
            if (this.maxAge === 0) {
                // 立即过期
                expires = new Date(0).toUTCString();
            } else {
                // 计算过期时间
                const expiresDate = new Date();
                expiresDate.setTime(expiresDate.getTime() + this.maxAge * 1000);
                expires = expiresDate.toUTCString();
            }
            parts.push(`Expires=${expires}`);
        }

        // 添加 Domain
        if (this.domain) {
            parts.push(`Domain=${this.domain}`);
        }

        // 添加 Path
        if (this.path) {
            parts.push(`Path=${this.path}`);
        }

        // 添加 Secure 和 HttpOnly
        if (this.secure) {
            parts.push('Secure');
        }
        if (this.httpOnly) {
            parts.push('HttpOnly');
        }

        // 添加 SameSite
        if (this.sameSite) {
            parts.push(`SameSite=${this.sameSite}`);
        }

        // 添加扩展属性
        this.extraAttrs.forEach((value, key) => {
            if (value === null || value === undefined) {
                parts.push(key);
            } else {
                parts.push(`${key}=${value}`);
            }
        });

        return parts.join('; ');
    }
}

export default SaCookie;
