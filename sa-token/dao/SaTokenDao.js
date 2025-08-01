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


import SaSession from "../session/SaSession.js";

/**
 * Sa-Token 持久层接口
 *
 * <p>
 *     此接口的不同实现类可将数据存储至不同位置，如：内存Map、Redis 等等。
 *     如果你要自定义数据存储策略，也需通过实现此接口来完成。
 * </p>
 *
 * @author click33
 * @since 1.10.0
 */


class SaTokenDao {
    /**
     * 常量，表示一个 key 永不过期
     */
    static NEVER_EXPIRE = -1;

    /**
     * 常量，表示系统中不存在这个缓存
     */
    static NOT_VALUE_EXPIRE = -2;

    // --------------------- 字符串读写 ---------------------

    /**
     * 获取 value，如无返空
     * @param {string} key 键名称
     * @returns {string|null}
     */
    get(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 写入 value，并设定存活时间（单位: 秒）
     * @param {string} key 键名称
     * @param {string} value 值
     * @param {number} timeout 有效期(秒)
     */
    set(key, value, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 更新字符串值（过期时间不变）
     * @param {string} key 键名称
     * @param {string} value 值
     */
    update(key, value) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 删除值
     * @param {string} key 键名称
     */
    delete(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取剩余存活时间(秒)
     * @param {string} key 键名称
     * @returns {number}
     */
    getTimeout(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 修改 value 的剩余存活时间（单位: 秒）
     * @param {string} key 键名称
     * @param {number} timeout 有效期(秒)
     */
    updateTimeout(key, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    // --------------------- 对象读写 ---------------------

    /**
     * 获取 Object，如无返空
     * @param {string} key 键名称
     * @returns {object|null}
     */
    getObject(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取 Object (指定反序列化类型)，如无返空
     * @template T
     * @param {string} key 键名称
     * @param {new() => T} classType 类类型
     * @returns {T|null}
     */
    getObject(key, classType) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 写入 Object，并设定存活时间 （单位: 秒）
     * @param {string} key 键名称
     * @param {object} object 值
     * @param {number} timeout 存活时间（值大于0时限时存储，值=-1时永久存储，值=0或小于-2时不存储）
     */
    setObject(key, object, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 更新 Object（过期时间不变）
     * @param {string} key 键名称
     * @param {object} object 值
     */
    updateObject(key, object) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 删除 Object
     * @param {string} key 键名称
     */
    deleteObject(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取 Object 的剩余存活时间 （单位: 秒）
     * @param {string} key 键名称
     * @returns {number}
     */
    getObjectTimeout(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 修改 Object 的剩余存活时间（单位: 秒）
     * @param {string} key 键名称
     * @param {number} timeout 有效期(秒)
     */
    updateObjectTimeout(key, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    // --------------------- SaSession 读写 ---------------------

    /**
     * 获取 SaSession，如无返空
     * @param {string} sessionId 
     * @returns {SaSession|null}
     */
    getSession(sessionId) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 写入 SaSession，并设定存活时间（单位: 秒）
     * @param {SaSession} session 
     * @param {number} timeout 有效期(秒)
     */
    setSession(session, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 更新Session
     * @param {SaSession} session 
     */
    updateSession(session) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 删除Session
     * @param {string} sessionId 
     */
    deleteSession(sessionId) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取Session剩余存活时间(秒)
     * @param {string} sessionId 
     * @returns {number}
     */
    getSessionTimeout(sessionId) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 修改 SaSession 剩余存活时间（单位: 秒）
     * @param {string} sessionId 
     * @param {number} timeout 有效期(秒)
     */
    updateSessionTimeout(sessionId, timeout) {
        throw new Error('抽象方法必须被实现');
    }

    // --------------------- 会话管理 ---------------------

    /**
     * 搜索数据
     * @param {string} prefix 前缀
     * @param {string} keyword 关键字
     * @param {number} start 开始索引
     * @param {number} size 获取数量(-1表示取到末尾)
     * @param {boolean} sortType 排序类型(true=正序)
     * @returns {string[]}
     */
    searchData(prefix, keyword, start, size, sortType) {
        throw new Error('抽象方法必须被实现');
    }

    // --------------------- 生命周期 ---------------------

    /**
     * 初始化方法
     */
    init() {
        // 默认空实现
    }

    /**
     * 销毁方法
     */
    destroy() {
        // 默认空实现
    }
}

// 冻结静态属性
Object.freeze(SaTokenDao);
Object.freeze(SaTokenDao.prototype);

export default SaTokenDao;






