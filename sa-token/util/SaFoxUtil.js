import SaTokenException from '../exception/SaTokenException.js';
import dayjs from 'dayjs'
import _ from "lodash";

/**
 * SaFoxUtil 工具类，提供常用的工具方法。
 * 对应 Java 中的 `cn.dev33.satoken.util.SaFoxUtil` 类。
 */
class SaFoxUtil {
    /**
     * URL 正则表达式。
     * @type {string}
     */
    static URL_REGEX = "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";

    /**
     * 日志级别列表。
     * @type {string[]}
     */
    static logLevelList = ["", "trace", "debug", "info", "warn", "error", "fatal"];

    /**
     * 私有构造函数，防止实例化。
     */
    constructor() {
        throw new Error("SaFoxUtil 是工具类，禁止实例化！");
    }

    /**
     * 打印 Sa-Token 的 Logo。
     */
    static printSaToken() {
        const str = "____ ____    ___ ____ _  _ ____ _  _ \r\n[__  |__| __  |  |  | |_/  |___ |\\ | \r\n___] |  |     |  |__| | \\_ |___ | \\| \r\nhttps://sa-token.cc (v1.44.0)";
        console.log(str);
    }

    /**
     * 生成随机字符串。
     * @param {number} length - 字符串长度
     * @returns {string} 随机字符串
     */
    static getRandomString(length) {
        const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * str.length);
            result += str.charAt(randomIndex);
        }
        return result;
    }

    /**
     * 生成指定范围内的随机数。
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 随机数
     */
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 判断对象是否为空。
     * @param {Object} obj - 待检查的对象
     * @returns {boolean} 是否为空
     */
    static isEmpty(obj) {
        return obj == null || obj === "";
    }

    /**
     * 判断对象是否非空。
     * @param {Object} obj - 待检查的对象
     * @returns {boolean} 是否非空
     */
    static isNotEmpty(obj) {
        return !this.isEmpty(obj);
    }

    /**
     * 判断数组是否为空。
     * @param {Array} array - 待检查的数组
     * @returns {boolean} 是否为空
     */
    static isEmptyArray(array) {
        return array == null || array.length === 0;
    }

    /**
     * 判断列表是否为空。
     * @param {Array} list - 待检查的列表
     * @returns {boolean} 是否为空
     */
    static isEmptyList(list) {
        return list == null || list.length === 0;
    }

    /**
     * 判断两个对象是否相等。
     * @param {Object} a - 对象 A
     * @param {Object} b - 对象 B
     * @returns {boolean} 是否相等
     */
    static equals(a, b) {
        return a === b || (a !== null && a !== undefined && _.isEqual(a, b));
    }

    /**
     * 判断两个对象是否不相等。
     * @param {Object} a - 对象 A
     * @param {Object} b - 对象 B
     * @returns {boolean} 是否不相等
     */
    static notEquals(a, b) {
        return !this.equals(a, b);
    }

    /**
     * 生成一个唯一的标记字符串。
     * @returns {string} 标记字符串
     */
    static getMarking28() {
        return Date.now() + "" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    /**
     * 格式化日期为字符串。
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    static formatDate(date) {
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    	/**
	 * 指定毫秒后的时间（格式化 ：yyyy-MM-dd HH:mm:ss）
	 * @param {long} ms 指定毫秒后
	 * @return 格式化后的时间
	 */
	static formatAfterDate(ms) {
		//Instant instant = Instant.ofEpochMilli(System.currentTimeMillis() + ms);
        // 创建未来时间点的 Date 对象
		//ZonedDateTime zonedDateTime = ZonedDateTime.ofInstant(instant, ZoneId.systemDefault());
		//return formatDate(zonedDateTime);
        return dayjs().add(ms, 'millisecond').format('YYYY-MM-DD HH:mm:ss');
	}

    /**
     * 模糊匹配字符串。
     * @param {string} pattern - 匹配模式（支持通配符 *）
     * @param {string} str - 待匹配的字符串
     * @returns {boolean} 是否匹配
     */
    static vagueMatch(pattern, str) {
        if (pattern == null && str == null) return true;
        if (pattern == null || str == null) return false;
        if (!pattern.includes("*")) return pattern === str;

        // 动态规划实现模糊匹配
        const m = str.length;
        const n = pattern.length;
        const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
        dp[0][0] = true;

        for (let j = 1; j <= n && pattern[j - 1] === "*"; j++) {
            dp[0][j] = true;
        }

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (pattern[j - 1] !== "*") {
                    dp[i][j] = dp[i - 1][j - 1] && str[i - 1] === pattern[j - 1];
                } else {
                    dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
                }
            }
        }

        return dp[m][n];
    }

    /**
     * 判断是否为基本类型或包装类型。
     * @param {Object} obj - 待检查的对象
     * @returns {boolean} 是否为基本类型或包装类型
     */
    static isBasicType(obj) {
        const type = typeof obj;
        return type === "string" || type === "number" || type === "boolean" || obj == null;
    }


    /**
     * 根据目标类型将输入值转换为指定类型的值。
     * @param {*} obj - 输入值
     * @param {Function} targetType - 目标类型构造函数（如 String, Number, Boolean 等）
     * @returns {*} 转换后的值
     */
    static getValueByType(obj, targetType) {
        // 如果输入值为 null 或已经是目标类型，直接返回
        if (obj == null || obj.constructor === targetType) {
            return obj;
        }

        // 将输入值转为字符串形式
        const strValue = String(obj);
        let convertedValue;

        // 根据目标类型进行转换
        if (targetType === String) {
            convertedValue = strValue;
        } else if (targetType === Number || targetType === 'number') {
            convertedValue = Number(strValue);
        } else if (targetType === Boolean || targetType === 'boolean') {
            convertedValue = Boolean(strValue.toLowerCase() === 'true');
        } else if (targetType === BigInt) {
            convertedValue = BigInt(strValue);
        } else if (targetType === Symbol) {
            convertedValue = Symbol(strValue);
        } else if (targetType === Date) {
            convertedValue = new Date(strValue);
        } else {
            // 其他类型无法转换，直接返回原值
            convertedValue = obj;
        }

        return convertedValue;
    }
    /**
     * 将 Map 转换为对象。
     * @param {Map} map - 键值对 Map
     * @param {Function} clazz - 目标类
     * @returns {Object} 转换后的对象
     */
    static mapToObject(map, clazz) {
        if (map == null) return null;
        if (clazz === Map) return map;

        try {
            const obj = new clazz();
            for (const [key, value] of map) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] = value;
                }
            }
            return obj;
        } catch (error) {
            throw new Error(`转换失败: ${error.message}`);
        }
    }

    /**
     * 将参数拼接到URL上（处理问号和连接符逻辑）
     * @param {string} url - 原始URL
     * @param {string} paramStr - 要拼接的参数（可以是完整参数字符串，如"name=John&age=20"）
     * @returns {string} 拼接后的URL
     */
    static joinParam(url, paramStr) {
        // 如果参数为空，直接返回原URL
        if (!paramStr || paramStr.length === 0) {
            return url || '';
        }

        // 处理URL为null的情况
        url = url || '';

        // 查找URL中最后一个问号的位置（ASCII 63是问号'?'）
        const lastQuestionMarkIndex = url.lastIndexOf('?');

        // 情况1：URL中没有问号
        if (lastQuestionMarkIndex === -1) {
            return `${url}?${paramStr}`;
        } 
        // 情况2：问号是URL的最后一个字符
        else if (lastQuestionMarkIndex === url.length - 1) {
            return url + paramStr;
        } 
        // 情况3：问号不在URL末尾
        else {
            const separator = '&';
            // 检查URL末尾是否有连接符，以及参数开头是否有连接符
            const shouldAddSeparator = 
                url.lastIndexOf(separator) !== url.length - 1 && 
                paramStr.indexOf(separator) !== 0;
            
            return shouldAddSeparator 
                ? `${url}${separator}${paramStr}` 
                : url + paramStr;
        }
    }

    /**
     * 将键值对参数拼接到URL上（便捷方法）
     * @param {string} url - 原始URL
     * @param {string} key - 参数名
     * @param {*} value - 参数值（会自动转为字符串）
     * @returns {string} 拼接后的URL
     */
    static joinParamWithKeyValue(url, key, value) {
        // 检查URL和key是否为空
        if (!url || !key) {
            return url || '';
        }
        
        // 调用主方法拼接"key=value"格式的参数
        return joinParam(url, `${key}=${value}`);
    }


    /**
     * 将参数拼接到URL的哈希部分（处理井号#和连接符逻辑）
     * @param {string} url - 原始URL
     * @param {string} paramStr - 要拼接的参数（可以是完整参数字符串，如"name=John&age=20"）
     * @returns {string} 拼接后的URL
     */
    static joinSharpParam(url, paramStr) {
        // 如果参数为空，直接返回原URL
        if (!paramStr || paramStr.length === 0) {
            return url || '';
        }

        // 处理URL为null的情况
        url = url || '';

        // 查找URL中最后一个井号的位置（ASCII 35是井号'#'）
        const lastHashIndex = url.lastIndexOf('#');

        // 情况1：URL中没有井号
        if (lastHashIndex === -1) {
            return `${url}#${paramStr}`;
        } 
        // 情况2：井号是URL的最后一个字符
        else if (lastHashIndex === url.length - 1) {
            return url + paramStr;
        } 
        // 情况3：井号不在URL末尾
        else {
            const separator = '&';
            // 检查URL末尾是否有连接符，以及参数开头是否有连接符
            const shouldAddSeparator = 
                url.lastIndexOf(separator) !== url.length - 1 && 
                paramStr.indexOf(separator) !== 0;
            
            return shouldAddSeparator 
                ? `${url}${separator}${paramStr}` 
                : url + paramStr;
        }
    }

    /**
     * 将键值对参数拼接到URL的哈希部分（便捷方法）
     * @param {string} url - 原始URL
     * @param {string} key - 参数名
     * @param {*} value - 参数值（会自动转为字符串）
     * @returns {string} 拼接后的URL
     */
    static joinSharpParamWithKeyValue(url, key, value) {
        // 检查URL和key是否为空
        if (!url || !key) {
            return url || '';
        }
        
        // 调用主方法拼接"key=value"格式的参数
        return joinSharpParam(url, `${key}=${value}`);
    }


    /**
     * 拼接两个URL（处理相对路径和绝对路径逻辑）
     * @param {string} url1 - 基础URL
     * @param {string} url2 - 待拼接的URL（可能是相对路径或绝对路径）
     * @returns {string} 拼接后的完整URL
     */
    static spliceTwoUrl(url1, url2) {
        // 处理空值情况
        if (url1 == null) {
            return url2 || '';
        } else if (url2 == null) {
            return url1 || '';
        }

        // 如果url2是绝对路径（以http/https开头），直接返回url2
        if (url2.startsWith('http://') || url2.startsWith('https://')) {
            return url2;
        } else {
            // 否则将url2拼接到url1后面
            return url1 + url2;
        }
    }


    /**
     * 将字符串数组转换为逗号分隔的字符串。
     * @param {string[]} arr - 字符串数组
     * @returns {string} 逗号分隔的字符串
     */
    static arrayJoin(arr) {
        if (arr == null) return "";
        return arr.join(",");
    }

    /**
     * 判断字符串是否为 URL。
     * @param {string} str - 待检查的字符串
     * @returns {boolean} 是否为 URL
     */
    static isUrl(str) {
        if (this.isEmpty(str)) return false;
        return new RegExp(this.URL_REGEX, "i").test(str);
    }

    /**
     * URL编码（兼容UTF-8）
     * @param {string} url - 待编码的URL
     * @returns {string} 编码后的URL
     * @throws {Error} 如果编码失败，抛出异常（模拟Java的SaTokenException）
     */
    static encodeUrl(url) {
        try {
            return encodeURIComponent(url);
        } catch (e) {
            throw (new SaTokenException(e)).setCode(12103);
            //throw new Error("URL编码失败").code = 12103; // 模拟Java的异常码
        }
    }

    /**
     * URL解码（兼容UTF-8）
     * @param {string} url - 待解码的URL
     * @returns {string} 解码后的URL
     * @throws {Error} 如果解码失败，抛出异常（模拟Java的SaTokenException）
     */
    static decoderUrl(url) {
        try {
            return decodeURIComponent(url);
        } catch (e) {
            throw (new SaTokenException(e)).setCode(12104);
            //throw new Error("URL解码失败").code = 12104; // 模拟Java的异常码
        }
    }


    /**
     * 将逗号分隔的字符串转换为数组（自动过滤空值和修剪空格）
     * @param {string} str - 待转换的字符串（如 "a, b, c"）
     * @returns {string[]} 转换后的数组（如 ["a", "b", "c"]），空输入返回空数组
     */
    static convertStringToList(str) {
        if (!str || str.trim() === "") {
            return [];
        }
        return str
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== ""); // 过滤空字符串
    }

    /**
     * 将数组转换为逗号分隔的字符串（自动处理空数组）
     * @param {Array} list - 待转换的数组（如 ["a", "b", "c"]）
     * @returns {string} 转换后的字符串（如 "a,b,c"），空输入返回空字符串
     */
    static convertListToString(list) {
        if (!list || list.length === 0) {
            return "";
        }
        return list.join(",");
    }












    



    /**
     * 将字符串列表转换为数组。
     * @param {string} str - 逗号分隔的字符串
     * @returns {string[]} 字符串数组
     */
    static convertStringToArray(str) {
        if (this.isEmpty(str)) return [];
        return str.split(",").map(s => s.trim()).filter(s => s !== "");
    }

    /**
     * 将字符串数组转换为逗号分隔的字符串（自动处理空数组或null）
     * @param {string[]} arr - 待转换的字符串数组
     * @returns {string} 转换后的字符串（如 "a,b,c"），空数组或null返回空字符串
     */
    static convertArrayToString(arr) {
        return arr && arr.length > 0 ? arr.join(",") : "";
    }

    /**
     * 返回一个空数组（模拟Java的emptyList）
     * @returns {Array} 空数组
     */
    static emptyList() {
        return [];
    }

    /**
     * 将可变参数转换为数组（模拟Java的toList）
     * @param {...string} str - 可变参数（如 "a", "b", "c"）
     * @returns {string[]} 转换后的数组（如 ["a", "b", "c"]）
     */
    static toList(...str) {
        return [...str]; // 或直接返回 str（因为 arguments 已经是数组）
    }

    /**
     * 将字符串列表转换为数组（模拟Java的toArray）
     * @param {string[]} list - 字符串列表（如 ["a", "b", "c"]）
     * @returns {string[]} 转换后的数组（如 ["a", "b", "c"]）
     */
    static toArray(list) {
        return list ? [...list] : []; // 处理null输入
    }



    /**
     * 将日志级别字符串转换为数字。
     * @param {string} level - 日志级别
     * @returns {number} 日志级别数字
     */
    static translateLogLevelToInt(level) {
        const levelInt = this.logLevelList.indexOf(level);
        return levelInt <= 0 || levelInt >= this.logLevelList.length ? 1 : levelInt;
    }

    /**
     * 将日志级别数字转换为字符串。
     * @param {number} level - 日志级别数字
     * @returns {string} 日志级别字符串
     */
    static translateLogLevelToString(level) {
        if (level <= 0 || level >= this.logLevelList.length) level = 1;
        return this.logLevelList[level];
    }

    /**
     * 检查是否支持彩色日志（模拟Java的isCanColorLog）
     * @returns {boolean} 是否支持彩色日志
     */
    static isCanColorLog() {
        // Windows环境下通常不支持ANSI彩色日志（如CMD/PowerShell默认不支持）
        return false; // 直接返回false，简化逻辑
    }

    /**
     * 检查list1是否包含list2的所有元素（模拟Java的list1ContainList2AllElement）
     * @param {string[]} list1 - 目标列表
     * @param {string[]} list2 - 待检查列表
     * @returns {boolean} 是否全部包含
     */
    static list1ContainList2AllElement(list1, list2) {
        if (!list2 || list2.length === 0) return true;
        if (!list1 || list1.length === 0) return false;
        return list2.every(item => list1.includes(item));
    }

    /**
     * 检查list1是否包含list2的任意元素（模拟Java的list1ContainList2AnyElement）
     * @param {string[]} list1 - 目标列表
     * @param {string[]} list2 - 待检查列表
     * @returns {boolean} 是否包含任意元素
     */
    static list1ContainList2AnyElement(list1, list2) {
        if (!list1 || list1.length === 0 || !list2 || list2.length === 0) return false;
        return list2.some(item => list1.includes(item));
    }

    /**
     * 从list1中移除list2的元素（模拟Java的list1RemoveByList2）
     * @param {string[]} list1 - 原始列表
     * @param {string[]} list2 - 待移除元素列表
     * @returns {string[]} 移除后的新列表
     */
    static list1RemoveByList2(list1, list2) {
        if (!list1) return null;
        if (!list2 || list2.length === 0) return [...list1];
        return list1.filter(item => !list2.includes(item));
    }

    /**
     * 检查字符串是否包含非打印ASCII字符（模拟Java的hasNonPrintableASCII）
     * @param {string} str - 待检查字符串
     * @returns {boolean} 是否包含非打印字符
     */
    static hasNonPrintableASCII(str) {
        if (!str) return false;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            if (c <= 31 || c === 127) return true;
        }
        return false;
    }

    /**
     * 安全转换为字符串（模拟Java的valueToString）
     * @param {*} value - 任意值
     * @returns {string} 字符串结果
     */
    static valueToString(value) {
        return value == null ? "" : String(value);
    }



}

// 导出模块（支持 ES6 模块）
export default SaFoxUtil;