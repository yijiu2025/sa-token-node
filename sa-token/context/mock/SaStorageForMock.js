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



import SaStorage from '../model/SaStorage';

/**
 * 对 SaStorage 包装类的实现（Mock 版）
 *
 * @author click33 qirly
 * @since 1.42.0
 */


class SaStorageForMock extends SaStorage {
    constructor() {
        super();
        /**
         * 数据存储映射表
         * @type {Map<string, any>}
         */
        this.dataMap = new Map();
    }

    /**
     * 获取底层源对象
     * @override
     * @returns {null} 模拟实现返回null
     */
    getSource() {
        return null;
    }

    /**
     * 写入一个值
     * @override
     * @param {string} key 键名
     * @param {any} value 值
     * @returns {SaStorageForMock} 对象自身（链式调用）
     */
    set(key, value) {
        this.dataMap.set(key, value);
        return this;
    }

    /**
     * 获取一个值
     * @override
     * @param {string} key 键名
     * @returns {any} 存储的值
     */
    get(key) {
        return this.dataMap.get(key);
    }

    /**
     * 删除一个值
     * @override
     * @param {string} key 键名
     * @returns {SaStorageForMock} 对象自身（链式调用）
     */
    delete(key) {
        this.dataMap.delete(key);
        return this;
    }

    // /* ----------- 模拟特有的辅助方法 ----------- */

    // /**
    //  * 检查是否包含指定键
    //  * @param {string} key 键名
    //  * @returns {boolean} 是否包含
    //  */
    // has(key) {
    //     return this.dataMap.has(key);
    // }

    // /**
    //  * 清空所有存储数据
    //  * @returns {SaStorageForMock} 对象自身（链式调用）
    //  */
    // clear() {
    //     this.dataMap.clear();
    //     return this;
    // }

    // /**
    //  * 获取所有键名
    //  * @returns {string[]} 键名数组
    //  */
    // keys() {
    //     return Array.from(this.dataMap.keys());
    // }

    // /**
    //  * 获取所有键值对
    //  * @returns {Object.<string, any>} 键值对对象
    //  */
    // entries() {
    //     return Object.fromEntries(this.dataMap);
    // }

    // /**
    //  * 转换为字符串表示
    //  * @override
    //  * @returns {string} 对象的字符串描述
    //  */
    // toString() {
    //     return `SaStorageForMock [data=${JSON.stringify(this.entries())}]`;
    // }
}

export default SaStorageForMock;