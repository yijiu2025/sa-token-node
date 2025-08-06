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
import SaSession from "../SaSession.js";
import SaStrategy from "../../strategy/SaStrategy.js";

/**
 * SaSession 读写工具类
 * 
 * @author click33
 * @since 1.42.0
 */
class SaRawSessionUtil {

	constructor() {
        throw new Error("SaRawSessionUtil 是工具类，不能实例化");
    }

	/**
	 * 拼接Key: 在存储 SaSession 时应该使用的 key
	 *
	 * @param {string} type 类型
	 * @param {Object} valueId 唯一标识
	 * @return {string} sessionId
	 */
	static splicingSessionKey(type, valueId) {
        return `${SaManager.getConfig().getTokenName()}:raw-session:${type}:${valueId}`;
    }

	/**
	 * 判断：指定 SaSession 是否存在
	 *
	 * @param {string} type /
	 * @param {Object} valueId /
	 * @return {boolean} 是否存在
	 */
	static isExists(type, valueId) {
        return SaManager.getSaTokenDao().getSession(this.splicingSessionKey(type, valueId)) != null;
    }

	/**
	 * 获取指定 SaSession 对象, 如果此 SaSession 尚未在 Cache 创建，isCreate 参数代表是否则新建并返回
	 *
	 * @param {string} type /
	 * @param {Object} valueId /
	 * @param {boolean} isCreate  如果此 SaSession 尚未在 DB 创建，是否新建并返回
	 * @return {SaSession} SaSession 对象
	 */
    static getSessionById(type, valueId, isCreate = true) {
        const sessionId = this.splicingSessionKey(type, valueId);
        let session = SaManager.getSaTokenDao().getSession(sessionId);
        
        if (session == null && isCreate) {
            session = SaStrategy.instance.createSession(sessionId);
            session.setType(type);
            SaManager.getSaTokenDao().setSession(
                session, 
                SaManager.getConfig().getTimeout()
            );
        }
        return session;
    }

	// /**
	//  * 获取指定 SaSession, 如果此 SaSession 尚未在 DB 创建，则新建并返回
	//  *
	//  * @param {string} type /
	//  * @param {Object} valueId /
	//  * @return {SaSession} SaSession 对象
	//  */
	// public static SaSession getSessionById(String type, Object valueId) {
	// 	return getSessionById(type, valueId, true);
	// }

	/**
	 * 删除指定 SaSession
	 *
	 * @param {string} type /
	 * @param {Object} valueId /
	 */
	static deleteSessionById(type, valueId) {
        SaManager.getSaTokenDao().deleteSession(this.splicingSessionKey(type, valueId));
    }

}

export default SaRawSessionUtil
