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

import SaSession from '../SaSession.js';
import SaRawSessionUtil from './SaRawSessionUtil.js';

/**
 * SaSession 读写工具类 委托
 * 
 * @author click33
 * @since 1.42.0
 */
class SaRawSessionDelegator {

	/**
	 * raw session 类型
	 */
	type;

    /**
     * 构造函数
     * @param {string} type 会话类型
     */
	constructor(type) {
        this.type = type;
    }

	/**
	 * 判断：指定 SaSession 是否存在
	 *
	 * @param {Object} valueId /
	 * @return {boolean} 是否存在
	 */
	isExists(valueId) {
        return SaRawSessionUtil.isExists(this.type, valueId);
    }

	/**
	 * 获取指定 SaSession 对象, 如果此 SaSession 尚未在 Cache 创建，isCreate 参数代表是否则新建并返回
	 *
	 * @param {Object} valueId /
	 * @param {boolean} isCreate  如果此 SaSession 尚未在 DB 创建，是否新建并返回
	 * @return {SaSession} SaSession 对象
	 */
	getSessionById(valueId, isCreate = true) {
		return SaRawSessionUtil.getSessionById(this.type, valueId, isCreate);
	}

	/**
	 * 获取指定 SaSession, 如果此 SaSession 尚未在 DB 创建，则新建并返回
	 *
	 * @param {Object} valueId /
	 * @return {SaSession} SaSession 对象
	 */
	// public SaSession getSessionById(Object valueId) {
	// 	return SaRawSessionUtil.getSessionById(type, valueId);
	// }

	/**
	 * 删除指定 SaSession
	 *
	 * @param {Object} valueId /
	 */
	deleteSessionById(valueId) {
        SaRawSessionUtil.deleteSessionById(this.type, valueId);
    }

}
export default SaRawSessionDelegator;