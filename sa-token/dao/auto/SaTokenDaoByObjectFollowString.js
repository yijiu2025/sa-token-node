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

import SaManager from "../../SaManager";
import SaTokenDaoBySessionFollowObject from "./SaTokenDaoBySessionFollowObject";

/**
 * SaTokenDao 次级实现，Object 读写跟随 String 读写 (推荐中间件型缓存实现 implements 此接口)
 *
 * @author click33
 * @since 1.41.0
 */


class SaTokenDaoByObjectFollowString extends SaTokenDaoBySessionFollowObject {
    // --------------------- Object 读写 ---------------------

    /**
     * 获取对象值
     * @param {string} key 键名称
     * @returns {object|null}
     */
    getObject(key) {
        const jsonString = this.get(key);
        return SaManager.getSaSerializerTemplate().stringToObject(jsonString);
    }

    /**
     * 获取对象值(指定类型)
     * @template T
     * @param {string} key 键名称
     * @param {function} classType 类构造函数
     * @returns {T|null}
     */
    getObject(key, classType) {
        const jsonString = this.get(key);
        return SaManager.getSaSerializerTemplate().stringToObject(jsonString, classType);
    }

    /**
     * 写入对象值
     * @param {string} key 键名称
     * @param {object} object 值
     * @param {number} timeout 有效期(秒)
     */
    setObject(key, object, timeout) {
        const jsonString = SaManager.getSaSerializerTemplate().objectToString(object);
        this.set(key, jsonString, timeout);
    }

    /**
     * 更新对象值（过期时间不变）
     * @param {string} key 键名称
     * @param {object} object 值
     */
    updateObject(key, object) {
        const jsonString = SaManager.getSaSerializerTemplate().objectToString(object);
        this.update(key, jsonString);
    }

    /**
     * 删除对象值
     * @param {string} key 键名称
     */
    deleteObject(key) {
        this.delete(key);
    }

    /**
     * 获取对象剩余存活时间(秒)
     * @param {string} key 键名称
     * @returns {number}
     */
    getObjectTimeout(key) {
        return this.getTimeout(key);
    }

    /**
     * 更新对象剩余存活时间
     * @param {string} key 键名称
     * @param {number} timeout 有效期(秒)
     */
    updateObjectTimeout(key, timeout) {
        this.updateTimeout(key, timeout);
    }
}

// 冻结原型防止修改
Object.freeze(SaTokenDaoByObjectFollowString.prototype);

export default SaTokenDaoByObjectFollowString;






