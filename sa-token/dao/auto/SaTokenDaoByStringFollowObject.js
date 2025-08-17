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

import SaTokenDaoBySessionFollowObject from "./SaTokenDaoBySessionFollowObject.js";

/**
 * SaTokenDao 次级实现：String 读写跟随 Object 读写 (推荐内存型缓存实现 implements 此接口)
 *
 * @author click33 qirly
 * @since 1.41.0
 */

class SaTokenDaoByStringFollowObject extends SaTokenDaoBySessionFollowObject {
    // --------------------- 字符串读写 ---------------------

    /**
     * 获取字符串值
     * @param {string} key 键名称
     * @returns {string|null}
     */
    get(key) {
        const obj = this.getObject(key);
        return obj != null ? String(obj) : null;
    }

    /**
     * 写入字符串值
     * @param {string} key 键名称
     * @param {string} value 值
     * @param {number} timeout 有效期(秒)
     */
    set(key, value, timeout) {
        this.setObject(key, value, timeout);
    }

    /**
     * 更新字符串值（过期时间不变）
     * @param {string} key 键名称
     * @param {string} value 值
     */
    update(key, value) {
        this.updateObject(key, value);
    }

    /**
     * 删除值
     * @param {string} key 键名称
     */
    delete(key) {
        this.deleteObject(key);
    }

    /**
     * 获取剩余存活时间(秒)
     * @param {string} key 键名称
     * @returns {number}
     */
    getTimeout(key) {
        return this.getObjectTimeout(key);
    }

    /**
     * 更新剩余存活时间
     * @param {string} key 键名称
     * @param {number} timeout 有效期(秒)
     */
    updateTimeout(key, timeout) {
        this.updateObjectTimeout(key, timeout);
    }
}

// 冻结原型防止修改
Object.freeze(SaTokenDaoByStringFollowObject.prototype);

export default SaTokenDaoByStringFollowObject;




