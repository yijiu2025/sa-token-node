'use strict';

var SaMapPackage = require('./SaMapPackage.js');

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


/**
 * Map 包装类 (ConcurrentHashMap 版)
 *
 * @author click33 qirly
 * @since 1.41.0
 */


class SaMapPackageForConcurrentHashMap extends SaMapPackage{
    /**
     * 底层存储的 Map 对象
     */
    #map = new Map();

    /**
     * 获取底层源对象
     * @returns {Map} 底层 Map 对象
     */
    getSource() {
        return this.#map;
    }

    /**
     * 获取值
     * @param {string} key 键
     * @returns {V} 对应的值
     */
    get(key) {
        return this.#map.get(key);
    }

    /**
     * 设置键值对
     * @param {string} key 键
     * @param {V} value 值
     */
    put(key, value) {
        this.#map.set(key, value);
    }

    /**
     * 删除键值对
     * @param {string} key 键
     */
    remove(key) {
        this.#map.delete(key);
    }

    /**
     * 获取所有键的集合
     * @returns {Set<string>} 键集合
     */
    keySet() {
        return new Set(this.#map.keys());
    }
}

// 冻结原型防止修改
Object.freeze(SaMapPackageForConcurrentHashMap.prototype);

module.exports = SaMapPackageForConcurrentHashMap;
