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
 * SaCookieConfig 类，用于配置 Cookie 的相关属性。
 * 对应 Java 中的 `cn.dev33.satoken.config.SaCookieConfig` 类。
 */

/**
 * Sa-Token Cookie写入 相关配置
 *
 * @author click33 qirly
 * @since 1.27.0
 */
class SaCookieConfig {
    /*
        Cookie 功能为浏览器通用标准，建议大家自行搜索文章了解各个属性的功能含义，此处源码仅做简单解释。
    */


    /**
     * 构造函数，初始化默认值。
     */
    constructor() {
        /**
         * 作用域
         * <p> 写入 Cookie 时显式指定的作用域, 常用于单点登录二级域名共享 Cookie 的场景。 </p>
         * <p> 一般情况下你不需要设置此值，因为浏览器默认会把 Cookie 写到当前域名下。 </p>
         */
        this.domain = null;       // Cookie 的域名

        /**
         * 路径 （一般只有当你在一个域名下部署多个项目时才会用到此值。）
         */
        this.path = null;         // Cookie 的路径

        /**
         * 是否只在 https 协议下有效
         */
        this.secure = false;      // 是否仅通过 HTTPS 传输
        
        /**
         * 是否禁止 js 操作 Cookie 
         */
        this.httpOnly = false;    // 是否仅允许 HTTP 访问（禁止 JavaScript 访问）

        /**
         * 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
         */
        this.sameSite = null;     // SameSite 属性（如 "Strict", "Lax", "None"）
        
        /**
         * 额外扩展属性
         */
        this.extraAttrs = new Map(); // 额外的 Cookie 属性（键值对）
    }

    /**
     * 写入：Cookie 作用域
	 * 	<p> 写入 Cookie 时显式指定的作用域, 常用于单点登录二级域名共享 Cookie 的场景。 </p>
	 * 	<p> 一般情况下你不需要设置此值，因为浏览器默认会把 Cookie 写到当前域名下。 </p>
     * @param {string} domain - 域名
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setDomain(domain) {
        this.domain = domain;
        return this;
    }

    /**
     * 获取：Cookie 作用域
	 * 	<p> 写入 Cookie 时显式指定的作用域, 常用于单点登录二级域名共享 Cookie 的场景。 </p>
	 * 	<p> 一般情况下你不需要设置此值，因为浏览器默认会把 Cookie 写到当前域名下。 </p>
     * @returns {string} 域名
     */
    getDomain() {
        return this.domain;
    }

    /**
     * 设置 Cookie 的路径。（一般只有当你在一个域名下部署多个项目时才会用到此值。）
     * @param {string} path - 路径
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setPath(path) {
        this.path = path;
        return this;
    }

    /**
     * 获取 Cookie 的路径。（一般只有当你在一个域名下部署多个项目时才会用到此值。）
     * @returns {string} 路径
     */
    getPath() {
        return this.path;
    }

    /**
     * 设置是否仅通过 HTTPS 传输 Cookie。
     * @param {boolean} secure - 是否只在 https 协议下有效 
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setSecure(secure) {
        this.secure = secure;
        return this;
    }

    /**
     * 获取是否仅通过 HTTPS 传输 Cookie。
     * @returns {boolean} 是否只在 https 协议下有效 
     */
    getSecure() {
        return this.secure;
    }

    /**
     * 是否禁止 js 操作 Cookie 
     * @param {boolean} httpOnly - 是否启用 HTTPOnly
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setHttpOnly(httpOnly) {
        this.httpOnly = httpOnly;
        return this;
    }

    /**
     * 是否禁止 js 操作 Cookie 
     * @returns {boolean} 是否启用 HTTPOnly
     */
    getHttpOnly() {
        return this.httpOnly;
    }

    /**
     * 设置 SameSite 属性。
     * @param {string} sameSite - 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setSameSite(sameSite) {
        this.sameSite = sameSite;
        return this;
    }

    /**
     * 第三方限制级别（Strict=完全禁止，Lax=部分允许，None=不限制）
     * @returns {string} SameSite 值
     */
    getSameSite() {
        return this.sameSite;
    }

    /**
     * 写入额外扩展属性。
     * @param {Map<string, string>} extraAttrs - 额外的属性
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    setExtraAttrs(extraAttrs) {
        this.extraAttrs = extraAttrs;
        return this;
    }

    /**
     * 获取额外扩展属性
     * @returns {Map<string, string>} 额外的属性
     */
    getExtraAttrs() {
        return this.extraAttrs;
    }

    /**
     * 追加扩展属性
     * @param {string} name - 属性名
     * @param {string} value - 属性值
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    addExtraAttr(name, value = null) {
        if (!this.extraAttrs) {
            this.extraAttrs = new Map();
        }
        this.extraAttrs.set(name, value);
        return this;
    }

    /**
     * 移除一个额外的 Cookie 属性。
     * @param {string} name - 属性名
     * @returns {SaCookieConfig} 返回当前对象，支持链式调用
     */
    removeExtraAttr(name) {
        if (this.extraAttrs) {
            this.extraAttrs.delete(name);
        }
        return this;
    }

    /**
     * 转换为字符串表示。
     * @returns {string} 对象的字符串表示
     */
    toString() {
        return `SaCookieConfig [domain=${this.domain}, path=${this.path}, secure=${this.secure}, httpOnly=${this.httpOnly}, sameSite=${this.sameSite}, extraAttrs=${JSON.stringify(Object.fromEntries(this.extraAttrs))}]`;
    }
}

// 导出模块（支持 ES6 模块）
export default SaCookieConfig;