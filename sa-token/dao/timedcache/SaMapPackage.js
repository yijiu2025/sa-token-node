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
 * Map 包装类
 *
 * @author click33 qirly
 * @since 1.41.0
 */

/**
 * Map 包装器接口 (JavaScript实现)
 * @template V 值类型
 */
class SaMapPackage {
    /**
     * 获取底层被包装的源对象
     * @returns {object}
     */
    getSource() {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取值
     * @param {string} key 键
     * @returns {V}
     */
    get(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 设置值
     * @param {string} key 键
     * @param {V} value 值
     */
    put(key, value) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 删除值
     * @param {string} key 键
     */
    remove(key) {
        throw new Error('抽象方法必须被实现');
    }

    /**
     * 获取所有键集合
     * @returns {Set<string>}
     */
    keySet() {
        throw new Error('抽象方法必须被实现');
    }
}

// 冻结原型防止修改
Object.freeze(SaMapPackage.prototype);

export default SaMapPackage;
