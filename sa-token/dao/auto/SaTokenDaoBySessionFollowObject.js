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


import SaTokenDao from "../../dao/SaTokenDao.js";
import SaSession from "../../session/SaSession.js";
import SaStrategy from "../../strategy/SaStrategy.js";

/**
 * SaTokenDao 次级实现：SaSession 读写跟随 Object 读写
 *
 * @author click33
 * @since 1.41.0
 */


/**
 * 基于对象存储的 SaSession DAO 实现
 * @extends SaTokenDao
 */
class SaTokenDaoBySessionFollowObject extends SaTokenDao {
    // --------------------- SaSession 读写（复用 Object 读写方法） ---------------------

    /**
     * 获取 SaSession，如无返空
     * @param {string} sessionId 
     * @returns {SaSession|null}
     */
    getSession(sessionId) {
        return this.getObject(sessionId, SaStrategy.instance.sessionClassType);
    }

    /**
     * 写入 SaSession，并设定存活时间（单位: 秒）
     * @param {SaSession} session 
     * @param {number} timeout 有效期(秒)
     */
    setSession(session, timeout) {
        this.setObject(session.getId(), session, timeout);
    }

    /**
     * 更新 SaSession
     * @param {SaSession} session 
     */
    updateSession(session) {
        this.updateObject(session.getId(), session);
    }

    /**
     * 删除 SaSession
     * @param {string} sessionId 
     */
    deleteSession(sessionId) {
        this.deleteObject(sessionId);
    }

    /**
     * 获取 SaSession 剩余存活时间(秒)
     * @param {string} sessionId 
     * @returns {number}
     */
    getSessionTimeout(sessionId) {
        return this.getObjectTimeout(sessionId);
    }

    /**
     * 更新 SaSession 剩余存活时间
     * @param {string} sessionId 
     * @param {number} timeout 有效期(秒)
     */
    updateSessionTimeout(sessionId, timeout) {
        this.updateObjectTimeout(sessionId, timeout);
    }
}

// 冻结原型防止修改
Object.freeze(SaTokenDaoBySessionFollowObject.prototype);

export default SaTokenDaoBySessionFollowObject;



