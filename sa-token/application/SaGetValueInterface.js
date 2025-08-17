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

import SaFoxUtil from '../util/SaFoxUtil.js';

/**
 * 对取值的一组方法封装
 * <p> 封装 SaStorage、SaSession、SaApplication 等存取值的一些固定方法，减少重复编码 </p>
 * 
 * @author click33 qirly
 * @since 1.31.0
 */


class SaGetValueInterface {
    /**
     * 需要子类实现的取值方法
     * @param {string} key 
     * @returns {any}
     */
    // get(key) {
    //     throw new Error('Method get() must be implemented');
    // }

    /**
     * 取值 (指定默认值)
     * @param {string} key 
     * @param {T} defaultValue 
     * @returns {T}
     */
    async get(key, defaultValue) {
        return await this.getValueByDefaultValue(await this.get(key), defaultValue);
    }

    /**
     * 取值 (转String类型)
     * @param {string} key 
     * @returns {string|null}
     */
    async getString(key) {
        const value = await this.get(key);
        return value === null ? null : String(value);
    }

    /**
     * 取值 (转int类型)
     * @param {string} key 
     * @returns {number}
     */
    async getInt(key) {
        return await this.getValueByDefaultValue(await this.get(key), 0);
    }

    /**
     * 取值 (转long类型)
     * @param {string} key 
     * @returns {bigint}
     */
    async getLong(key) {
        return await this.getValueByDefaultValue(await this.get(key), 0n);
    }

    /**
     * 取值 (转double类型)
     * @param {string} key 
     * @returns {number}
     */
    async getDouble(key) {
        return await this.getValueByDefaultValue(await this.get(key), 0.0);
    }

    /**
     * 取值 (转float类型)
     * @param {string} key 
     * @returns {number}
     */
    async getFloat(key) {
        return await this.getValueByDefaultValue(await this.get(key), 0.0);
    }

    // /**
    //  * 取值 (指定转换类型)
    //  * @param {string} key 
    //  * @param {Function} cs 类型构造函数
    //  * @returns {T}
    //  */
    // async getModel(key, cs) {
    //     return SaFoxUtil.getValueByType(await this.get(key), cs);
    // }

    /**
     * 取值 (指定转换类型, 并指定默认值)
     * @param {string} key 
     * @param {Function} cs 类型构造函数
     * @param {any} defaultValue 
     * @returns {T}
     */
    async getModel(key, cs, defaultValue = undefined) {
        const value = await this.get(key);
        if (this.valueIsNull(value)) {
            return defaultValue;
        }
        return SaFoxUtil.getValueByType(value, cs);
    }

    /**
     * 是否含有某个 key
     * @param {string} key 
     * @returns {boolean}
     */
    async has(key) {
        return !this.valueIsNull(await this.get(key));
    }

    /**
     * 判断值是否为null
     * @param {any} value 
     * @returns {boolean}
     */
    valueIsNull(value) {
        return value == null || value === "";
    }

    /**
     * 根据默认值来获取值
     * @param {any} value 
     * @param {T} defaultValue 
     * @returns {T}
     */
    async getValueByDefaultValue(value, defaultValue) {
        if (this.valueIsNull(value)) {
            return defaultValue;
        }
        return await SaFoxUtil.getValueByType(value, defaultValue?.constructor);
    }
}

export default SaGetValueInterface;