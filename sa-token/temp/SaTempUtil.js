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

import SaManager from "../SaManager.js";

/**
 * Sa-Token 临时 token 验证模块 - 工具类
 *
 * <p>
 *     有效期很短的一种token，一般用于一次性接口防盗用、短时间资源访问等业务场景
 * </p>
 *
 * @author click33 qirly
 * @since 1.20.0
 */
class SaTempUtil {

	constructor() {
        throw new Error('SaTempUtil 是工具类，不能实例化');
    }

	// -------- 创建

	/**
	 * 为指定 value 创建一个临时 token (如果多条业务线均需要创建临时 token，请自行在 value 拼接不同前缀)
	 *
	 * @param {Object} value 指定值
	 * @param {long} timeout 有效时间，单位：秒，-1 代表永久有效
	 * @return {string} 生成的 token
	 */
	static createToken(value, timeout) {
        return SaManager.getSaTempTemplate().createToken(value, timeout);
    }

	/**
	 * 为指定 业务标识、指定 value 创建一个 Token
	 * @param {Object} value 指定值
	 * @param {long} timeout 有效期，单位：秒，-1 代表永久有效
	 * @param {boolean} isRecordIndex 是否记录索引，以便后续使用 value 反查 token
	 * @return {string} 生成的token
	 */
	static createToken(value, timeout, isRecordIndex) {
		return SaManager.getSaTempTemplate().createToken(value, timeout, isRecordIndex);
	}

	/**
	 * 保存 token
	 * @param {string} token /
	 * @param {Object} value /
	 * @param {long} timeout /
	 */
	static saveToken(token, value, timeout) {
		SaManager.getSaTempTemplate().saveToken(token, value, timeout);
	}

	// -------- 解析

	
	/**
	 * 解析 Token
	 * 根据传入参数的不同实现不同的解析逻辑：
	 * - parseToken(token) - 获取 value
	 * - parseToken(token, cs) - 获取 value 并转换为指定类型
	 * - parseToken(token, cutPrefix, cs) - 获取 value，裁剪前缀后转换为指定类型
	 * 
	 * @param {string} token 指定 Token
	 * @param {string|Class} [csOrPrefix] 可选，指定类型或裁剪前缀
	 * @param {Class} [cs] 可选，指定类型(当第二个参数为裁剪前缀时使用)
	 * @return {Object|T} 解析结果
	 */
	static parseToken(token, csOrPrefix, cs) {
		// 只有token参数 - 直接解析获取value
		if (arguments.length === 1) {
			return SaManager.getSaTempTemplate().parseToken(token);
		}
		
		// 两个参数 - token和类型
		if (arguments.length === 2) {
			return SaManager.getSaTempTemplate().parseToken(token, csOrPrefix);
		}
		
		// 三个参数 - token、裁剪前缀、类型
		return SaManager.getSaTempTemplate().parseToken(token, csOrPrefix, cs);
	}


	// /**
	//  * 解析 Token 获取 value
	//  * @param {string} token 指定 Token
	//  * @return {Object} /
	//  */
	// static parseToken(token) {
	// 	return SaManager.getSaTempTemplate().parseToken(token);
	// }

	// /**
	//  * 解析 Token 获取 value，并转换为指定类型
	//  *
	//  * @param {string} token 指定 Token
	//  * @param {Class} cs 指定类型
	//  * @param {T} 默认值的类型
	//  * @return {T} /
	//  */
	// static parseToken(token, cs) {
	// 	return SaManager.getSaTempTemplate().parseToken(token, cs);
	// }

	// /**
	//  * 解析 token 获取 value，并裁剪指定前缀，然后转换为指定类型
	//  * <h2>
	//  *     请注意此方法在旧版本（<= v1.41.0） 时的三个参数为：service, token, class <br/>
	//  *     新版本三个参数为：token, cutPrefix, class <br/>
	//  *     请注意其中的逻辑变化
	//  * </h2>
	//  *
	//  * @param {string} token 指定 Token
	//  * @param {string} cutPrefix 指定前缀
	//  * @param {Class} cs 指定类型
	//  * @param {T} 默认值的类型
	//  * @return {T} /
	//  */
	// static parseToken(token, cutPrefix, cs) {
	// 	return SaManager.getSaTempTemplate().parseToken(token, cutPrefix, cs);
	// }

	/**
	 * 获取指定指定 Token 的剩余有效期，单位：秒
	 * <p> 返回值 -1 代表永久，-2 代表 token 无效
	 *
	 * @param {string} token /
	 * @return {long} /
	 */
	static getTimeout(token) {
		return SaManager.getSaTempTemplate().getTimeout(token);
	}


	// -------- 删除

	/**
	 * 删除一个 token
	 * @param {string} token 指定 Token
	 */
	static deleteToken(token) {
		SaManager.getSaTempTemplate().deleteToken(token);
	}


	// ------------------- 索引操作

	/**
	 * 获取指定 value 的 temp-token 列表记录
	 * @param {Object} value /
	 * @return {List<String>} /
	 */
	static getTempTokenList(value) {
		return SaManager.getSaTempTemplate().getTempTokenList(value);
	}

}

export default SaTempUtil;	