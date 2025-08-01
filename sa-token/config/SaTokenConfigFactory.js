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
 * SaTokenConfigFactory 类，用于从配置文件加载并初始化 SaTokenConfig 对象。
 * 对应 Java 中的 `cn.dev33.satoken.config.SaTokenConfigFactory` 类。
 */



import SaErrorCode from '../error/SaErrorCode';
import SaTokenException from '../exception.SaTokenException';
import SaFoxUtil from '../utils/SaFoxUtil';

import SaTokenConfig from './SaTokenConfig';

/**
 * Sa-Token配置文件的构建工厂类
 *
 * <p> 用于手动读取配置文件初始化 SaTokenConfig 对象，只有在非IOC环境下你才会用到此类 </p>
 * 
 * @author click33
 * @since 1.10.0
 */

class SaTokenConfigFactory {
    /**
     * 配置文件地址 
     * @type {string}
     */
    static configPath = "sa-token.properties";

    /**
     * 私有构造函数，防止实例化。
     */
    constructor() {
        throw new Error("SaTokenConfigFactory 是工具类，禁止实例化！");
    }

    /**
     * 根据 configPath 路径获取配置信息
     * @returns {SaTokenConfig} 初始化后的 SaTokenConfig 对象
     */
    static createConfig() {
        return this.createConfig(this.configPath);
    }

    /**
     * 根据指定路径路径获取配置信息 
     * @param {string} path - 配置文件路径
     * @returns {SaTokenConfig} 初始化后的 SaTokenConfig 对象
     */
    static createConfig(path) {
        const map = this.readPropToMap(path);
        // if (map == null) {
            // throw new RuntimeException("找不到配置文件：" + configPath, null);
        // }
        return this.initPropByMap(map, new SaTokenConfig());
    }

    /**
     * 工具方法: 将指定路径的properties配置文件读取到Map中 
     * @param {string} propertiesPath - 配置文件路径
     * @returns {Map<string, string> | null} 键值对 Map，如果文件不存在则返回 null
     * @throws {Error} 如果文件加载失败，抛出异常
     */
    static readPropToMap(propertiesPath) {
        const map = new Map();
        console.log("js模拟，有问题请在此修改 satokenconfigfactor的readprop to map函数");
        try {
            const properties = require('properties-reader');
            const path = require('path');
            const fs = require('fs');

            const filePath = path.resolve(__dirname, propertiesPath);

            if (!fs.existsSync(filePath)) {
                return null;
            }

            const reader = properties(filePath);
            const map = reader.path();

            return map;
        } catch (error) {
            throw new SaTokenException("配置文件(" + propertiesPath + ")加载失败", e).setCode(SaErrorCode.CODE_10021);
        }
    }

    /**
     * 工具方法: 将 Map 的值映射到一个 Model 上 。
     * @param {Map<string, string>} map - 键值对 Map
     * @param {Object} obj - 待初始化的对象
     * @returns {Object} 初始化后的对象
     * @throws {Error} 如果属性赋值失败，抛出异常
     */
    static initPropByMap(map, obj) {
        console.log("js模拟，有问题请在此修改 satokenconfigfactor的initPropByMap函数");
        if (!map) {
            map = new Map();
        }

        let cs;
        if (obj instanceof Class) {  // 注意：JavaScript 中没有直接的 Class 类型检查
            cs = obj;
            obj = null;
        } else {
            cs = obj.constructor;  // JavaScript 中获取对象的构造函数
        }

        const fields = Object.getOwnPropertyNames(cs.prototype);  // 获取类的属性

        for (const field of fields) {
            const value = map.get(field);
            if (value !== undefined) {
                try {
                    // 模拟 SaFoxUtil.getValueByType 的逻辑
                    const fieldType = typeof obj[field];
                    let valueConvert;

                    switch (fieldType) {
                        case 'boolean':
                            valueConvert = value.toLowerCase() === 'true';
                            break;
                        case 'number':
                            valueConvert = Number(value);
                            break;
                        default:
                            valueConvert = value;
                    }

                    obj[field] = valueConvert;
                } catch (error) {
                    throw new Error(`属性赋值出错：${field}: ${error.message}`);
                }
            }
        }

        return obj;
    }
}

// 导出模块（支持 ES6 模块）
export default SaTokenConfigFactory;