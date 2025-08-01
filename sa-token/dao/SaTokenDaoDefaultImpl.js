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

import SaTokenDaoByStringFollowObject from "./auto/SaTokenDaoByStringFollowObject.js";
import SaMapPackageForConcurrentHashMap from "./timedcache/SaMapPackageForConcurrentHashMap.js";
import SaTimedCache from "./timedcache/SaTimedCache.js";
import SaFoxUtil from "../util/SaFoxUtil.js";

/**
 * Sa-Token 持久层接口，默认实现类，基于 SaTimedCache - ConcurrentHashMap （内存缓存，系统重启后数据丢失）
 *
 * @author click33
 * @since 1.10.0
 */

class SaTokenDaoDefaultImpl extends SaTokenDaoByStringFollowObject {
    /**
     * 定时缓存实例
     */
    timedCache = new SaTimedCache(
        new SaMapPackageForConcurrentHashMap(),
        new SaMapPackageForConcurrentHashMap()
    );

    // ------------------------ Object 读写操作 ------------------------

    /**
     * 获取对象值
     * @param {string} key 键名称
     * @returns {object|null}
     */
    getObject(key) {
        return this.timedCache.getObject(key);
    }

    /**
     * 获取对象值(指定类型)
     * @template T
     * @param {string} key 键名称
     * @param {function} classType 类构造函数
     * @returns {T|null}
     */
    getObject(key, classType) {
        return this.getObject(key); // JavaScript 不进行运行时类型检查
    }

    /**
     * 写入对象值
     * @param {string} key 键名称
     * @param {object} object 值
     * @param {number} timeout 有效期(秒)
     */
    setObject(key, object, timeout) {
        this.timedCache.setObject(key, object, timeout);
    }

    /**
     * 更新对象值（过期时间不变）
     * @param {string} key 键名称
     * @param {object} object 值
     */
    updateObject(key, object) {
        this.timedCache.updateObject(key, object);
    }

    /**
     * 删除对象值
     * @param {string} key 键名称
     */
    deleteObject(key) {
        this.timedCache.deleteObject(key);
    }

    /**
     * 获取对象剩余存活时间(秒)
     * @param {string} key 键名称
     * @returns {number}
     */
    getObjectTimeout(key) {
        return this.timedCache.getObjectTimeout(key);
    }

    /**
     * 更新对象剩余存活时间
     * @param {string} key 键名称
     * @param {number} timeout 有效期(秒)
     */
    updateObjectTimeout(key, timeout) {
        this.timedCache.updateObjectTimeout(key, timeout);
    }

    // ------------------------ 会话管理 ------------------------

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
        return SaFoxUtil.searchList(
            Array.from(this.timedCache.keySet()),
            prefix,
            keyword,
            start,
            size,
            sortType
        );
    }

    // ------------------------ 生命周期管理 ------------------------

    /**
     * 初始化方法（启动刷新线程）
     */
    init() {
        this.timedCache.initRefreshThread();
    }

    /**
     * 销毁方法（停止刷新线程）
     */
    destroy() {
        this.timedCache.endRefreshThread();
    }
}

export default SaTokenDaoDefaultImpl;


