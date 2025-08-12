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
import SaTokenDao from "../dao/SaTokenDao.js";
import SaTokenException from "../exception/SaTokenException.js";
import SaSession from "../session/SaSession.js";
import SaRawSessionDelegator from "../session/raw/SaRawSessionDelegator.js";
import SaStrategy from "../strategy/SaStrategy.js";
import SaFoxUtil from "../util/SaFoxUtil.js";
import SaTtlMethods from "../util/SaTtlMethods.js";
import { randomUUID } from 'crypto';

/**
 * Sa-Token 临时 token 验证模块
 *
 * <p>
 *     有效期很短的一种token，一般用于一次性接口防盗用、短时间资源访问等业务场景
 * </p>
 *
 * @author click33 qirly
 * @since 1.42.0
 */
class SaTempTemplate extends SaTtlMethods {

	/**
	 *默认命名空间
	 */
	static DEFAULT_NAMESPACE = "temp-token";

	/**
	 * 命名空间
	 */
	namespace;

	/**
	 * Raw Session 读写委托
	 */
	rawSessionDelegator;

	/**
	 * 在 raw-session 中的保存索引列表使用的 key
	 */
	static TEMP_TOKEN_MAP = "__HD_TEMP_TOKEN_MAP";

	/**
	 * 实例化
	 * @param {String} namespace 命名空间，用于多实例隔离
	 */
	constructor(namespace = SaTempTemplate.DEFAULT_NAMESPACE){
		if (SaFoxUtil.isEmpty(namespace)) {
			throw new SaTokenException("namespace 不能为空");
		}
		this.namespace = namespace;
		this.rawSessionDelegator = new SaRawSessionDelegator(namespace);
	}


	// -------- 创建

	/**
	 * 为指定 value 创建一个临时 token (如果多条业务线均需要创建临时 token，请自行在 value 拼接不同前缀)
	 *
	 * @param {Object} value 指定值
	 * @param {long} timeout 有效时间，单位：秒，-1 代表永久有效
	 * @return {String} 生成的 token
	 */
	createToken(value, timeout) {
		// 重载方法，如果只有两个参数，则 isRecordIndex 默认为 false
		return this.createTokenWithIndex(value, timeout, false);
	}

	/**
	 * 为指定 业务标识、指定 value 创建一个 Token
	 * @param {Object} value 指定值
	 * @param {long} timeout 有效期，单位：秒，-1 代表永久有效
	 * @param {boolean} isRecordIndex 是否记录索引，以便后续使用 value 反查 token
	 * @return {String} 生成的token
	 */
	createTokenWithIndex(value, timeout, isRecordIndex) {

		// 生成 temp-token
		const tempToken = this.createTempTokenValue(value);

		// 持久化映射关系
		this.saveToken(tempToken, value, timeout);

		// 记录索引
		if(isRecordIndex) {
			const session = this.rawSessionDelegator.getSessionById(value);
			this.addTempTokenIndex(session, tempToken, timeout);
			this.adjustIndex(value, session);
		}

		// 返回
		return tempToken;
	}

	/**
	 * 保存 token
	 * @param {String} token /
	 * @param {Object} value /
	 * @param {long} timeout /
	 */
	saveToken(token, value, timeout) {
		const key = this.splicingTempTokenSaveKey(token);
		SaManager.getSaTokenDao().setObject(key, value, timeout);
	}

	/**
	 * 创建一个 temp-token 值
	 *
	 * @return {String} /
	 */
	createTempTokenValue(value) {
		return SaStrategy.instance.generateUniqueToken(
				"Temp Token",
				SaManager.getConfig().getMaxTryTimes(),
				() => this.randomTempToken(value),
				_apiKey => this._getValue(_apiKey) == null
		);
	}

	/**
	 * 随机一个 temp-token
	 * @param {Object} value /
	 * @return {String} /
	 */
	randomTempToken(value) {
		return randomUUID().replace(/-/g, "");
	}


	// -------- 解析

	/**
	 * 解析 Token,支持三种调用方式:
	 * 1. parseToken(token) - 获取 value
	 * 2. parseToken(token, cs) - 获取 value 并转换为指定类型
	 * 3. parseToken(token, cutPrefix, cs) - 获取 value，裁剪前缀后转换为指定类型
	 * 
	 * @param {String} token 指定 Token
	 * @param {String|Class} [csOrPrefix] 可选,指定类型或裁剪前缀
	 * @param {Class} [cs] 可选,指定类型(当第二个参数为裁剪前缀时使用)
	 * @return {Object|T} 解析结果
	 */
	parseToken(token, csOrPrefix, cs) {
		// 获取原始值
		const value = this._getValue(token);
		
		// 1. 只有token参数 - 直接返回value
		if(arguments.length === 1) {
			return value;
		}
		
		// 2. 两个参数 - token和类型
		if(arguments.length === 2) {
			return SaFoxUtil.getValueByType(value, csOrPrefix);
		}
		
		// 3. 三个参数 - token、裁剪前缀、类型
		// 如果未指定裁剪前缀,则直接返回类型转换结果
		if(SaFoxUtil.isEmpty(csOrPrefix)) {
			return SaFoxUtil.getValueByType(value, cs);
		}
		
		// 如果符合前缀则裁剪并返回,如果不符合前缀则返回 null 
		this.checkCutPrefixLength(csOrPrefix);
		const str = SaFoxUtil.valueToString(value);
		if(str.startsWith(csOrPrefix)) {
			return SaFoxUtil.getValueByType(str.substring(csOrPrefix.length), cs);
		} else {
			return null;
		}
	}




	// /**
	//  * 解析 Token 获取 value
	//  * @param {String} token /指定 Token
	//  * @return {Object} /
	//  */
	// parseToken(token) {
	// 	return this._getValue(token);
	// }

	// /**
	//  * 解析 Token 获取 value，并转换为指定类型
	//  *
	//  * @param {String} token 指定 Token
	//  * @param {Class} cs 指定类型
	//  * @param {T} 默认值的类型
	//  * @return {T} /
	//  */
	// parseToken(token, cs) {
	// 	return this.parseToken(token, null, cs);
	// }

	// /**
	//  * 解析 token 获取 value，并裁剪指定前缀，然后转换为指定类型
	//  * <h2>
	//  *     请注意此方法在旧版本（<= v1.41.0） 时的三个参数为：service, token, class <br/>
	//  *     新版本三个参数为：token, cutPrefix, class <br/>
	//  *     请注意其中的逻辑变化
	//  * </h2>
	//  *
	//  * @param {String} token 指定 Token
	//  * @param {String} cutPrefix 指定裁剪前缀
	//  * @param {Class} cs 指定类型
	//  * @return {T} /
	//  */
	// parseToken(token, cutPrefix, cs) {
	// 	// 解析值
	// 	const value = this.parseToken(token);

	// 	// 如果未指定裁剪前缀，则直接返回
	// 	if(SaFoxUtil.isEmpty(cutPrefix)) {
	// 		return SaFoxUtil.getValueByType(value, cs);
	// 	}

	// 	// 如果符合前缀则裁剪并返回，如果不符合前缀则返回 null
	// 	this.checkCutPrefixLength(cutPrefix);
	// 	const str = SaFoxUtil.valueToString(value);
	// 	if(str.startsWith(cutPrefix)) {
	// 		return SaFoxUtil.getValueByType(str.substring(cutPrefix.length), cs);
	// 	} else {
	// 		return null;
	// 	}
	// }

	/**
	 * 获取指定指定 Token 的剩余有效期，单位：秒
	 * <p> 返回值 -1 代表永久，-2 代表 token 无效
	 *
	 * @param {String} token 指定 Token
	 * @return {long} /
	 */
	getTimeout(token) {
		return this._getTimeout(token);
	}


	// -------- 删除

	/**
	 * 删除一个 token
	 * @param {String} token 指定 Token
	 */
	deleteToken(token) {
		// 如果无此数据，则直接返回
		const value = this.parseToken(token);
		if(SaFoxUtil.isEmpty(value)) {
			return;
		}

		// 删除 token 本身
		this._deleteToken(token);

		// 调整索引
		const session = this.rawSessionDelegator.getSessionById(value, false);
		if(session != null) {
			this.deleteTempTokenIndex(session, token);
			this.adjustIndex(value, null);
		}
	}



	// ------------------- 索引操作

	/**
	 * 调整索引
	 *
	 * @param {Object} value 值
	 * @param {SaSession} session 可填写 null，代表使用 value 现场查询
	 * @return {Map<String, Long>} 调整后的索引列表
	 */
	adjustIndex(value, session) {

		// 未提供则现场查询
		if(session == null) {
			session = this.rawSessionDelegator.getSessionById(value, false);
			if(session == null) {
				return this.newTokenIndexMap();
			}
		}

		// 重新整理索引列表
		const tempTokenNewList = this.newTokenIndexMap();
		const tempTokenTtlList = [];
		const tempTokenMap = session.get(SaTempTemplate.TEMP_TOKEN_MAP, () => this.newTokenIndexMap());
		for (const [key, val] of tempTokenMap.entries()) {
			const ttl = this.expireTimeToTtl(val);
			if (ttl != SaTokenDao.NOT_VALUE_EXPIRE) { // SaTokenDao.NOT_VALUE_EXPIRE
				tempTokenNewList.set(key, val);
				tempTokenTtlList.push(ttl);
			}
		}
		// for (Map.Entry<String, Long> entry : tempTokenMap.entrySet()) {
		// 	long ttl = expireTimeToTtl(entry.getValue());
		// 	if(ttl != SaTokenDao.NOT_VALUE_EXPIRE) {
		// 		tempTokenNewList.put(entry.getKey(), entry.getValue());
		// 		tempTokenTtlList.add(ttl);
		// 	}
		// }

		// 有则保存，无则删除
		if( tempTokenNewList.size > 0) {
			session.set(SaTempTemplate.TEMP_TOKEN_MAP, tempTokenNewList);
		} else {
			this.rawSessionDelegator.deleteSessionById(value);
			return tempTokenNewList;
		}

		// 调整 SaSession TTL
		const maxTtl = this.getMaxTtl(tempTokenTtlList);
		if (maxTtl != 0) {
			session.updateTimeout(maxTtl);
		}
		return tempTokenNewList;
	}

	/**
	 * 获取指定 value 的 temp-token 列表记录
	 * @param {Object} value /
	 * @return {List<String>} /
	 */
	getTempTokenList(value) {
		// 先调增索引再获取，否则有可能获取到的不是最新有效数据
		const tempTokenMap = this.adjustIndex(value, null);
		return Array.from(tempTokenMap.keys());
	}

	/**
	 * 在 SaSession 上添加临时 temp-token 索引
	 * @param {SaSession} session /
	 * @param {String} token /
	 * @param {long} timeout /
	 */
	addTempTokenIndex(session, token, timeout) {
		const tempTokenMap = session.get(SaTempTemplate.TEMP_TOKEN_MAP, () => this.newTokenIndexMap());
		if(! tempTokenMap.has(token)) {
			tempTokenMap.set(token, this.ttlToExpireTime(timeout));
			session.set(SaTempTemplate.TEMP_TOKEN_MAP, tempTokenMap);
		}
	}

	/**
	 * 在 SaSession 上删除临时 temp-token 索引
	 * @param {SaSession} session /
	 * @param {String} token /
	 */
	deleteTempTokenIndex(session, token) {
		const tempTokenMap = session.get(SaTempTemplate.TEMP_TOKEN_MAP, () => this.newTokenIndexMap());
		if(tempTokenMap.has(token)) {
			tempTokenMap.delete(token);
			session.set(SaTempTemplate.TEMP_TOKEN_MAP, tempTokenMap);
		}
	}


	// -------- 元操作

	_getValue(token) {
		const key = this.splicingTempTokenSaveKey(token);
		return SaManager.getSaTokenDao().getObject(key);
	}
	
	_deleteToken(token) {
		const key = this.splicingTempTokenSaveKey(token);
		SaManager.getSaTokenDao().deleteObject(key);
	}
	
	_getTimeout(token) {
		const key = this.splicingTempTokenSaveKey(token);
		return SaManager.getSaTokenDao().getObjectTimeout(key);
	}



	// -------- 其它

	/**
	 * 检查裁剪前缀长度
	 * @param {String} cutPrefix /
	 */
	checkCutPrefixLength(cutPrefix) {
		if(cutPrefix.length >= 32) {
			throw new SaTokenException("裁剪前缀长度必须小于 32 位");
		}
	}

	/**
	 * 获取：在存储临时 token 数据时，应该使用的 key
	 * @param {String} token token值
	 * @return {String} key
	 */
	splicingTempTokenSaveKey(token) {
		return SaManager.getConfig().getTokenName() + ":" + this.namespace + ":" + token;
	}

	/**
	 * @return {String} jwt秘钥 (只有集成 sa-token-temp-jwt 模块时此参数才会生效)
	 */
	getJwtSecretKey() {
		return null;
	}

}
export default SaTempTemplate;
