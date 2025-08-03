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

import SaErrorCode from '../error/SaErrorCode.js';
import SaTokenException from '../exception/SaTokenException.js';

/**
 * Http 请求各种请求类型的枚举表示 
 * 
 * <p> 参考：Spring - HttpMethod 
 * 
 * @author click33
 * @since 1.27.0
 */
class SaHttpMethod {

    static GET = 'GET';
    static HEAD = 'HEAD';
    static POST = 'POST';
    static PUT = 'PUT';
    static PATCH = 'PATCH';
    static DELETE = 'DELETE';
    static OPTIONS = 'OPTIONS';
    static TRACE = 'TRACE';
    static CONNECT = 'CONNECT';

	/**
	 * 代表全部请求方式 
	 */
    static ALL = 'ALL';
	

    // 创建映射表
    //static #map = new Map();
    
	//private static final Map<String, SaHttpMethod> map = new HashMap<>();

    // 有效方法集合
    static #validMethods = new Set([
        this.GET,
        this.HEAD,
        this.POST,
        this.PUT,
        this.PATCH,
        this.DELETE,
        this.OPTIONS,
        this.TRACE,
        this.CONNECT,
        this.ALL
    ]);
    // 初始化映射表
    // static {
    //     for (const value of this.values()) {
    //         this.#map.set(value.name, value);
    //     }
    // }
	// static {
	// 	for (SaHttpMethod reqMethod : values()) {
	// 		map.put(reqMethod.name(), reqMethod);
	// 	}
	// }


    /**
     * 检查给定的方法是否为有效的HTTP方法
     * @param {string} method 请求类型 
     * @return {boolean} 是否为有效的HTTP方法
     */
    static isValidMethod(method) {
        return this.#validMethods.has(method.toUpperCase());
    }

	/**
	 * String 转 enum 
	 * @param {string} method 请求类型 
     * @return {SaHttpMethod} 对象
	 */
	static toEnum(method) {
		if(method == null) {
			throw new SaTokenException("Method 不可以是 null").setCode(SaErrorCode.CODE_10321);
		}
        if (this.#validMethods.has(method.toUpperCase())) {
            return method; // 直接返回标准化字符串
        }
        throw new SaTokenException("无效Method：" + method).setCode(SaErrorCode.CODE_10321);
	}

	/**
	 * String[] 转 enum[]
	 * @param {string[]} methods 请求类型数组 
     * @return {SaHttpMethod[]} 数组
	 */
	static toEnumArray(...methods) {
		return methods.map(method => this.toEnum(method));
	}

}

// 导出枚举类
export default SaHttpMethod;