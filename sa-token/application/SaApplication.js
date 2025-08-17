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


import SaManager from '../SaManager.js';
import SaTokenDao from '../dao/SaTokenDao.js';
import SaSetValueInterface from './SaSetValueInterface.js';

/**
 * Application Model，全局作用域的读取值对象。
 *
 * <p> 在应用全局范围内: 存值、取值。数据在应用重启后失效，如果集成了 Redis，则在 Redis 重启后失效。
 * 
 * @author click33 qirly
 * @since 1.31.0
 */


class SaApplication extends SaSetValueInterface {

    /**
     * 默认实例
     */
    static defaultInstance = new SaApplication();


    // ---- 实现存取值方法 ----

    /**
     * 取值
     * @param {string} key 键名
     * @returns {any} 存储的值
     */
    async get(key) {
        const saTokenDao = await SaManager.getSaTokenDao();
        return saTokenDao.getObject(await this.splicingDataKey(key));
    }

    // /**
    //  * 写值（永不过期）
    //  * @param {string} key 键名
    //  * @param {any} value 值
    //  * @returns {SaApplication} 对象自身（链式调用）
    //  */
    // set(key, value) {
    //     return this.set(key, value, SaTokenDao.NEVER_EXPIRE);  // -1 表示永不过期
    // }

    /**
     * 删值
     * @param {string} key 键名
     * @returns {SaApplication} 对象自身（链式调用）
     */
    async delete(key) {
        const saTokenDao = await SaManager.getSaTokenDao();
        saTokenDao.deleteObject(await this.splicingDataKey(key));
        return this;
    }

    // ---- 其它方法 ----

    /**
     * 写值（带过期时间）
     * @param {string} key 键名
     * @param {any} value 值
     * @param {number} ttl 有效时间（单位：秒）
     * @returns {SaApplication} 对象自身（链式调用）
     */
    async set(key, value, ttl = SaTokenDao.NEVER_EXPIRE) {  //SaTokenDao.NEVER_EXPIRE  // -1 表示永不过期
        const saTokenDao = await SaManager.getSaTokenDao();
        await saTokenDao.setObject(await this.splicingDataKey(key), value, ttl);
        return this;
    }

    /**
     * 返回当前存入的所有 key
     * @returns {string[]} key 列表
     */
    async keys() {
        // 从缓存中查询出所有此前缀的 key
        const prefix = await this.splicingDataKey("");
        const list = await (await SaManager.getSaTokenDao()).searchData(prefix, "", 0, -1, true);
        
        // 裁减掉固定前缀，保留 key 名称
        const prefixLength = prefix.length;
        const list2 = [];
        if (list) {
            for (const key of list) {
                list2.push(key.substring(prefixLength));
            }
        }
        
        return list2;
    }
    
    /**
     * 清空当前存入的所有 key
     */
    async clear() {
        const keys = await this.keys();
        for (const key of keys) {
            await this.delete(key);
        }
    }

    /**
     * 拼接key：当存入一个变量时，应该使用的 key
     * @param {string} key 原始 key
     * @returns {string} 拼接后的 key 值
     */
    async splicingDataKey(key) {
        const config = await SaManager.getConfig();
        return `${config.getTokenName()}:var:${key}`;
    }


}

// const saApplication = new SaApplication();
// Object.freeze(saApplication);

// 导出默认实例和类本身
export { SaApplication as default, SaApplication };
