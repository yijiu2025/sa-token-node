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
import SaStrategy from "../strategy/SaStrategy.js";
import SaTokenConsts from "../util/SaTokenConsts.js";

import SaSession from "./SaSession.js";

/**
 * 自定义 SaSession 工具类，快捷的读取、操作自定义 SaSession
 * 
 * <p>样例：
 * <pre>
 * 		// 在一处代码写入数据 
 * 		SaSession session = SaSessionCustomUtil.getSessionById("role-" + 1001);
 * 		session.set("count", 1);
 * 	
 * 		// 在另一处代码获取数据 
 * 		SaSession session = SaSessionCustomUtil.getSessionById("role-" + 1001);
 * 		int count = session.getInt("count");
 * 		System.out.println("count=" + count);
 * </pre>
 * 
 * @author click33
 * @since 1.10.0
 */
class SaSessionCustomUtil {

	/** 私有构造方法 */
    constructor() {
        throw new Error("SaSessionCustomUtil 是工具类，不能实例化");
    }
	
	/**
	 * 添加上指定前缀，防止恶意伪造数据
	 */
	static sessionKey = "custom";

	/**
	 * 拼接Key: 在存储自定义 SaSession 时应该使用的 key
	 *
	 * @param {string} sessionId 会话id
	 * @return {string} sessionId
	 */
    static splicingSessionKey(sessionId) {
        return `${SaManager.getConfig().getTokenName()}:${this.sessionKey}:session:${sessionId}`;
    }

	/**
	 * 判断：指定 key 的 SaSession 是否存在
	 * 
	 * @param {string} sessionId SaSession 的 id
	 * @return {boolean} 是否存在
	 */
	static isExists(sessionId) {
        return SaManager.getSaTokenDao().getSession(this.splicingSessionKey(sessionId)) != null;
    }

	/**
	 * 获取指定 key 的 SaSession 对象, 如果此 SaSession 尚未在 DB 创建，isCreate 参数代表是否则新建并返回
	 * 
	 * @param {string} sessionId SaSession 的 id
	 * @param {boolean} isCreate  如果此 SaSession 尚未在 DB 创建，是否新建并返回
	 * @return {SaSession} SaSession 对象
	 */
    static getSessionById(sessionId, isCreate = true) {
        const fullSessionId = this.splicingSessionKey(sessionId);
        let session = SaManager.getSaTokenDao().getSession(fullSessionId);
        
        if (session == null && isCreate) {
            session = SaStrategy.instance.createSession(fullSessionId);
            session.setType(SaTokenConsts.SESSION_TYPE__CUSTOM);
            SaManager.getSaTokenDao().setSession(
                session, 
                SaManager.getConfig().getTimeout()
            );
        }
        return session;
    }

	/**
	 * 获取指定 key 的 SaSession, 如果此 SaSession 尚未在 DB 创建，则新建并返回
	 * 
	 * @param sessionId SaSession 的 id
	 * @return SaSession 对象
	 */
	// public static SaSession getSessionById(String sessionId) {
	// 	return getSessionById(sessionId, true);
	// }

	/**
	 * 删除指定 key 的 SaSession
	 * 
	 * @param {string} sessionId SaSession 的 id
	 */
	static deleteSessionById(sessionId) {
        SaManager.getSaTokenDao().deleteSession(this.splicingSessionKey(sessionId));
    }

}


export default SaSessionCustomUtil;