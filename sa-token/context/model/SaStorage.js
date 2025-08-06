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


import SaSetValueInterface from "../../application/SaSetValueInterface.js";

/**
 * Storage Model，请求作用域的读取值对象。
 *
 * <p> 在一次请求范围内: 存值、取值。数据在请求结束后失效。
 * 
 * @author click33
 * @since 1.16.0
 */

class SaStorage extends SaSetValueInterface {
    /**
     * 获取底层被包装的源对象
     * @returns {Object} 底层存储对象
     */
    getSource() {
        throw new Error('Method getSource() must be implemented');
    }

    /**
     * 获取存储值
     * @override
     * @param {string} key 键名
     * @returns {any} 存储的值
     */
    get(key) {
        throw new Error('Method get() must be implemented');
    }

    /**
     * 设置存储值
     * @override
     * @param {string} key 键名
     * @param {any} value 值
     * @returns {SaStorage} 对象自身（链式调用）
     */
    set(key, value) {
        throw new Error('Method set() must be implemented');
    }

    /**
     * 删除存储值
     * @override
     * @param {string} key 键名
     * @returns {SaStorage} 对象自身（链式调用）
     */
    delete(key) {
        throw new Error('Method delete() must be implemented');
    }
}

export default SaStorage;
