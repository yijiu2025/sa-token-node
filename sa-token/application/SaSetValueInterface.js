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


import SaGetValueInterface from "./SaGetValueInterface.js";

/**
 * 对写值的一组方法封装
 * <p> 封装 SaStorage、SaSession、SaApplication 等存取值的一些固定方法，减少重复编码 </p>
 * 
 * @author click33
 * @since 1.31.0
 */


class SaSetValueInterface extends SaGetValueInterface {
    /**
     * 需要子类实现的写值方法
     * @param {string} key 
     * @param {any} value 
     * @returns {SaSetValueInterface}
     */
    set(key, value) {
        throw new Error('Method set() must be implemented');
    }

    /**
     * 需要子类实现的删值方法
     * @param {string} key 
     * @returns {SaSetValueInterface}
     */
    delete(key) {
        throw new Error('Method delete() must be implemented');
    }

    /**
     * 取值 (如果值为null则执行函数获取值并写入)
     * @param {string} key 
     * @param {Function} fun 
     * @returns {T}
     */
    get(key, fun) {
        let value = this.get(key);
        if (value === null) {
            value = fun();
            this.set(key, value);
        }
        return value;
    }

    /**
     * 写值 (只有key不存在时才写入)
     * @param {string} key 
     * @param {any} value 
     * @returns {SaSetValueInterface}
     */
    setByNull(key, value) {
        if (!this.has(key)) {
            this.set(key, value);
        }
        return this;
    }
}

export default SaSetValueInterface;