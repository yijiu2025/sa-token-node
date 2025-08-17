'use strict';

var SaTokenException = require('../exception/SaTokenException.js');
var SaErrorCode = require('../error/SaErrorCode.js');
var SaTokenConsts = require('./SaTokenConsts.js');
var dayjs = require('dayjs');
require('dayjs/plugin/utc.js');
require('dayjs/plugin/timezone.js');
require('lodash');

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
 * Sa-Token 内部工具类
 *
 * @author click33 qirly
 * @since 1.18.0
 */
class SaFoxUtil {

    /**
     * 私有构造函数，防止实例化。
     */
    constructor() {
        throw new Error("SaFoxUtil 是工具类，禁止实例化！");
    }

    /**
	 * 打印 Sa-Token-Node 版本字符画
	 */
    static printSaToken() {
        const str = ""
            + "____ ____    ___ ____ _  _ ____ _  _    _  _ ____ ___  ____ \r\n" 
            + "[__  |__| __  |  |  | |_/  |___ |\\ | __ |\\ | |  | |  \\ |___ \r\n"
            + "___] |  |     |  |__| | \\_ |___ | \\|    | \\| |__| |__/ |___ " 
    //		+ SaTokenConsts.VERSION_NO
    //		+ "sa-token："
    //		+ "\r\n" + "DevDoc：" + SaTokenConsts.DEV_DOC_URL // + "\r\n";
            + "\r\n" + SaTokenConsts.DEV_DOC_URL // + "\r\n";
			+ " (" + SaTokenConsts.VERSION_NO + ")"
    		+ "\r\n" + "GitHub：" + SaTokenConsts.GITHUB_URL // + "\r\n";
			;
        console.log(str);
    }

    /**
	 * 生成指定长度的随机字符串
	 *
	 * @param {Int} length 字符串的长度
	 * @return {String} 一个随机字符串
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
	 * 生成指定区间的 int 值
	 *
	 * @param {Int} min 最小值（包括）
	 * @param {Int} max 最大值（包括）
	 * @return {Int} /
	 */
	static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

	/**
	 * 指定元素是否为null或者空字符串
	 * @param {Object} str 指定元素
	 * @return {Boolean} 是否为null或者空字符串
	 */
	static isEmpty(str) {
		return str == null || str === "";
	}

	/**
	 * 指定元素是否不为 (null或者空字符串)
	 * @param {Object} str 指定元素
	 * @return {Boolean} 是否为null或者空字符串
	 */
	static isNotEmpty(str) {
		return !this.isEmpty(str);
	}

	/**
	 * 指定数组是否为null或者空数组
	 * <h3> 该方法已过时，建议使用 isEmptyArray 方法 </h3>
	 * @param {Array} array /
	 * @return {Boolean} /
	 */
	// @Deprecated
	// static isEmpty(array) {
	// 	return this.isEmptyArray(array);
	// }

	/**
	 * 指定数组是否为null或者空数组
	 * @param {Array} array /
	 * @return {Boolean} /
	 */
	static isEmptyArray(array) {
		return array == null || array.length == 0;
	}

	/**
	 * 指定集合是否为null或者空数组
	 * @param {Array} array /list /
	 * @return {Boolean} /
	 */
	static isEmptyList(list) {
		return list == null || list.length === 0;
	}

	/**
	 * 比较两个对象是否相等
	 * @param {Object} a 第一个对象
	 * @param {Object} b 第二个对象
	 * @return {Boolean} 两个对象是否相等
	 */
	static equals(a, b) {
        return (a === b) || (a != null && a === b);
    }
	
	/**
	 * 比较两个对象是否不相等
	 * @param {Object} a 第一个对象
	 * @param {Object} b 第二个对象
	 * @return {Boolean} 两个对象是否不相等
	 */
	static notEquals(a, b) {
        return !this.equals(a, b);
    }

	/**
	 * 以当前时间戳和随机int数字拼接一个随机字符串
	 *
	 * @return {String} 随机字符串
	 */
	static getMarking28() {
		return Date.now() + "" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	}

	/**
	 * 将日期格式化 （yyyy-MM-dd HH:mm:ss）
	 * @param {Date} date 日期
	 * @return {String} 格式化后的时间
	 */
	static formatDate(date) {
		return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
	}

	/**
	 * 将日期格式化带时区 （yyyy-MM-dd HH:mm:ss）
	 * @param {Date} date 日期
	 * @param {String} tz 时区
	 * @return {String} 格式化的时间
	 */
	static formatDateWithTz(date, tz = dayjs.tz.guess()) {
		return dayjs(date).tz(tz).format("YYYY-MM-DD HH:mm:ss");
	}

	/**
	 * 指定毫秒后的时间（格式化 ：yyyy-MM-dd HH:mm:ss）
	 * @param {long} ms 指定毫秒后
	 * @return {String} 格式化后的时间
	 */
	static formatAfterDate(ms) {
		return dayjs(Date.now() + ms).format("YYYY-MM-DD HH:mm:ss");
	}


    /**
     * 从集合里查询数据
     * 支持两种调用方式:
     * 1. searchList(dataList, prefix, keyword, start, size, sortType) - 按前缀和关键字搜索
     * 2. searchList(list, start, size, sortType) - 直接分页查询
     *
     * @param {Array<String>} dataList 数据集合
     * @param {String|Number} prefixOrStart 前缀或起始位置
     * @param {String|Number} keywordOrSize 关键字或获取条数
     * @param {Number|Boolean} [startOrSortType] 起始位置或排序类型
     * @param {Number} [size] 获取条数
     * @param {Boolean} [sortType] 排序类型（true=正序，false=反序）
     * @return {Array<String>} 符合条件的新数据集合
     */
    static searchList(dataList, prefixOrStart, keywordOrSize, startOrSortType, size, sortType) {
        // 判断调用方式
        if (typeof prefixOrStart === 'string' || prefixOrStart === null) {
            // 第一种调用方式: 按前缀和关键字搜索
            const prefix = prefixOrStart || "";
            const keyword = keywordOrSize || "";
            const start = startOrSortType;
            
            // 挑选出所有符合条件的
            let list = [];
            for (const key of dataList) {
                if (key.startsWith(prefix) && key.includes(keyword)) {
                    list.push(key);
                }
            }
            
            // 调用分页逻辑
            return this._searchListPage(list, start, size, sortType);
        } else {
            // 第二种调用方式: 直接分页查询
            return this._searchListPage(dataList, prefixOrStart, keywordOrSize, startOrSortType);
        }
    }

	// /**
	//  * 从集合里查询数据
	//  *
	//  * @param {Collection<String>} dataList 数据集合
	//  * @param {String} prefix   前缀
	//  * @param {String} keyword  关键字
	//  * @param {Int} start    起始位置 (-1代表查询所有)
	//  * @param {Int} size     获取条数
	//  * @param {Boolean} sortType     排序类型（true=正序，false=反序）
	//  *
	//  * @return {List<String>} 符合条件的新数据集合
	//  */
	// static searchList(dataList, prefix, keyword, start, size, sortType) {
	// 	if (prefix == null) {
	// 		prefix = "";
	// 	}
	// 	if (keyword == null) {
	// 		keyword = "";
	// 	}
	// 	// 挑选出所有符合条件的
	// 	let list = [];
	// 	for (const key of dataList) {
	// 		if (key.startsWith(prefix) && key.includes(keyword)) {
	// 			list.push(key);
	// 		}
	// 	}
	// 	// 取指定段数据
	// 	return this.searchList(list, start, size, sortType);
	// }

	/**
	 * 从集合里查询数据
	 *
	 * @param {List<String>} list  数据集合
	 * @param {Int} start 起始位置
	 * @param {Int} size  获取条数 (-1代表从start处一直取到末尾)
	 * @param {Boolean} sortType     排序类型（true=正序，false=反序）
	 *
	 * @return {List<String>} 符合条件的新数据集合
	 */
	static _searchListPage(list, start, size, sortType) {
		// 如果是反序的话
		if (!sortType) {
            list = [...list].reverse();
        }
		// start 至少为0
		if (start < 0) {
			start = 0;
		}
		// size为-1时，代表一直取到末尾，否则取到 start + size
		let end;
		if (size === -1) {
			end = list.length;
		} else {
			end = start + size;
		}
		// 取出的数据放到新集合中
		const list2 = [];
		for (let i = start; i < end; i++) {
			// 如果已经取到list的末尾，则直接退出
			if (i >= list.length) {
				return list2;
			}
			list2.push(list[i]);
		}
		return list2;
	}

	/**
	 * 字符串模糊匹配
	 * <p>example:
	 * <p> user* user-add   --  true
	 * <p> user* art-add    --  false
	 * @param {String} patt 格式:user* art* *name* age*  *name*表达式
	 * @param {String} str 待匹配的字符串
	 * @return {Boolean} 是否可以匹配
	 */
	static vagueMatch(patt, str) {
		// 两者均为 null 时，直接返回 true
		if(patt == null && str == null) {
			return true;
		}
		// 两者其一为 null 时，直接返回 false
		if(patt == null || str == null) {
			return false;
		}
		// 如果表达式不带有*号，则只需简单equals即可 (这样可以使速度提升200倍左右)
		if( !patt.includes("*")) {
			return patt === str;
		}
		// 深入匹配
		return this.vagueMatchMethod(patt, str);
	}

	/**
	 * 字符串模糊匹配
	 *
	 * @param {String} pattern /
	 * @param {String} str    /
	 * @return {Boolean} /
	 */
	static vagueMatchMethod(pattern, str) {
		const m = str.length;
		const n = pattern.length;
		const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(false));
		dp[0][0] = true;
		for (let i = 1; i <= n; ++i) {
			if (pattern.charAt(i - 1) === '*') {
				dp[0][i] = true;
			} else {
				break;
			}
		}
		for (let i = 1; i <= m; ++i) {
			for (let j = 1; j <= n; ++j) {
				if (pattern.charAt(j - 1) === '*') {
					dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
				} else if (str.charAt(i - 1) === pattern.charAt(j - 1)) {
					dp[i][j] = dp[i - 1][j - 1];
				}
			}
		}
		return dp[m][n];
	}

	/**
	 * 判断类型是否为8大包装类型
	 * @param {Class} cs /
	 * @return {Boolean} /
	 */
	static isWrapperType(cs) {
        return cs === Number || cs === Boolean || cs === String || cs === Symbol;
		// return cs == Integer.class || cs == Short.class ||  cs == Long.class ||  cs == Byte.class
		// 	|| cs == Float.class || cs == Double.class ||  cs == Boolean.class ||  cs == Character.class;
	}

	/**
	 * 判断类型是否为基础类型：8大基本数据类型、8大包装类、String
	 * @param {Class} cs /
	 * @return {Boolean} /
	 */
    static isBasicType(cs) {
        // JavaScript中没有明确的基本数据类型概念，这里简化处理
        return typeof cs === 'string' || typeof cs === 'number' || typeof cs === 'boolean' || 
               cs instanceof String || cs instanceof Number || cs instanceof Boolean;
    }
	// public static boolean isBasicType(Class<?> cs) {
	// 	return cs.isPrimitive() || isWrapperType(cs) || cs == String.class;
	// }

	/**
	 * 将指定值转化为指定类型
	 * @param <T> 泛型
	 * @param {Object} obj 值
	 * @param {Class} cs 类型
	 * @return {<T>} 转换后的值
	 */
	// @SuppressWarnings("unchecked")
	static getValueByType(obj, cs) {
		// 如果 obj 为 null 或者本来就是 cs 类型
        if (obj == null || (typeof obj === typeof cs)) {
            return obj;
        }
		// 开始转换
		const obj2 = String(obj);
		let obj3;
		if (cs === String) {
            obj3 = obj2;
        } else if (cs === Number) {
            obj3 = Number(obj2);
        } else if (cs === Boolean) {
            obj3 = Boolean(obj2);
        } else {
            obj3 = obj;
        }
		return obj3;
	}

	/**
	 * 将 Map 转化为 Object
	 * @param {Map<String, Object>} map /
	 * @param {Class} clazz /
	 * @return {Object} /
	 * @param <T> /
	 */
	mapToObject(map, clazz) {
		if(map == null) {
			return null;
		}
		if (clazz === Object || clazz === Map) {
            return map;
        }
		try {
			// 创建目标类实例
        const obj = new clazz();
        
        // 遍历源对象的所有属性
        Object.keys(map).forEach(key => {
            // 如果目标对象有这个属性，则进行赋值
            if (key in obj) {
                obj[key] = map[key];
            }
        });

        return obj;
		} catch (e) {
			throw new Error(`转换失败: ${e.message}`);
		}
	}


    /**
     * 在url上拼接参数
     * 支持两种调用方式:
     * 1. joinParam(url, paramStr) - 直接拼接参数字符串
     * 2. joinParam(url, key, value) - 拼接键值对参数
     * 
     * @param {string} url url
     * @param {string} paramStrOrKey 参数字符串或参数名
     * @param {*} [value] 参数值(当第二个参数为key时使用)
     * @return {string} 拼接后的url字符串
     */
    static joinParam(url, paramStrOrKey, value) {
        // 如果有第三个参数，说明是按 key-value 方式调用
        if (arguments.length === 3) {
            // 如果url或者key为空, 直接返回
            if (this.isEmpty(url) || this.isEmpty(paramStrOrKey)) {
                return url;
            }
            return this.joinParam(url, `${paramStrOrKey}=${value}`);
        }

        // 两个参数的情况 - 直接拼接参数字符串
        const paramStr = paramStrOrKey;
        
        // 如果参数为空, 直接返回
        if (paramStr == null || paramStr.length === 0) {
            return url;
        }
        
        // url为空则使用空字符串
        if (url == null) {
            url = "";
        }
        
        const index = url.lastIndexOf('?');
        
        // ? 不存在
        if (index === -1) {
            return `${url}?${paramStr}`;
        }
        
        // ? 是最后一位
        if (index === url.length - 1) {
            return url + paramStr;
        }
        
        // ? 是其中一位
        if (index < url.length - 1) {
            const separatorChar = "&";
            // 如果最后一位是 不是&, 且 paramStr 第一位不是 &, 就赠送一个 &
            if (url.lastIndexOf(separatorChar) !== url.length - 1 && paramStr.indexOf(separatorChar) !== 0) {
                return url + separatorChar + paramStr;
            } else {
                return url + paramStr;
            }
        }
        // 正常情况下, 代码不可能执行到此
        return url;
    }


	// /**
	//  * 在url上拼接上kv参数并返回
	//  * @param {String} url url
	//  * @param {String} paramStr 参数, 例如 id=1001
	//  * @return {String} 拼接后的url字符串
	//  */
	// static joinParam(url, paramStr) {
	// 	// 如果参数为空, 直接返回
	// 	if(paramStr == null || paramStr.length === 0) {
	// 		return url;
	// 	}
	// 	if(url == null) {
	// 		url = "";
	// 	}
	// 	const index = url.lastIndexOf('?');
	// 	// ? 不存在
	// 	if(index === -1) {
	// 		return url + '?' + paramStr;
	// 	}
	// 	// ? 是最后一位
	// 	if(index === url.length - 1) {
	// 		return url + paramStr;
	// 	}
	// 	// ? 是其中一位
	// 	if(index < url.length - 1) {
	// 		const separatorChar = "&";
	// 		// 如果最后一位是 不是&, 且 paramStr 第一位不是 &, 就赠送一个 &
	// 		if(url.lastIndexOf(separatorChar) !== url.length - 1 && paramStr.indexOf(separatorChar) !== 0) {
	// 			return url + separatorChar + paramStr;
	// 		} else {
	// 			return url + paramStr;
	// 		}
	// 	}
	// 	// 正常情况下, 代码不可能执行到此
	// 	return url;
	// }

	// /**
	//  * 在url上拼接上kv参数并返回
	//  * @param {String} url url
	//  * @param {String} key 参数名称
	//  * @param {Object} value 参数值
	//  * @return {String} 拼接后的url字符串
	//  */
	// static joinParam(url, key, value) {
    //     // 如果url或者key为空, 直接返回
    //     if (this.isEmpty(url) || this.isEmpty(key)) {
    //         return url;
    //     }
    //     return this.joinParam(url, key + "=" + value);
    // }

	/**
	 * 在url上拼接锚参数
	 * @param {String} url url
	 * @param {String} paramStr 参数, 例如 id=1001
	 * @return {String} 拼接后的url字符串
	 */
	static joinSharpParam(url, paramStr, value) {

        // 如果有第三个参数，说明是按 key-value 方式调用
        if (arguments.length === 3) {
            const key = paramStr;
            // 如果url或者key为空, 直接返回
            if (this.isEmpty(url) || this.isEmpty(key)) {
                return url;
            }
            return this.joinParam(url, `${key}=${value}`);
        }

		// 如果参数为空, 直接返回
		if(paramStr == null || paramStr.length === 0) {
			return url;
		}
		if(url == null) {
			url = "";
		}
		const index = url.lastIndexOf('#');
		// # 不存在
		if(index == -1) {
			return url + '#' + paramStr;
		}
		// # 是最后一位
		if(index == url.length - 1) {
			return url + paramStr;
		}
		// # 是其中一位
		if(index < url.length - 1) {
			const separatorChar = "&";
			// 如果最后一位是 不是&, 且 paramStr 第一位不是 &, 就赠送一个 &
			if(url.lastIndexOf(separatorChar) !== url.length - 1 && paramStr.indexOf(separatorChar) !== 0) {
				return url + separatorChar + paramStr;
			} else {
				return url + paramStr;
			}
		}
		// 正常情况下, 代码不可能执行到此
		return url;
	}

	// /**
	//  * 在url上拼接锚参数
	//  * @param url url
	//  * @param key 参数名称
	//  * @param value 参数值
	//  * @return 拼接后的url字符串
	//  */
	// public static String joinSharpParam(String url, String key, Object value) {
	// 	// 如果url或者key为空, 直接返回
	// 	if(isEmpty(url) || isEmpty(key)) {
	// 		return url;
	// 	}
	// 	return joinSharpParam(url, key + "=" + value);
	// }

	/**
	 * 拼接两个url
	 * <p> 例如：url1=http://domain.cn，url2=/sso/auth，则返回：http://domain.cn/sso/auth </p>
	 *
	 * @param {String} url1 第一个url
	 * @param {String} url2 第二个url
	 * @return {String} 拼接完成的url
	 */
	static spliceTwoUrl(url1, url2) {
		// q1、任意一个为空，则直接返回另一个
		if(url1 == null) {
			return url2;
		}
		if(url2 == null) {
			return url1;
		}

		// q2、如果 url2 以 http 开头，将其视为一个完整地址
		if(url2.startsWith("http")) {
			return url2;
		}

		// q3、将两个地址拼接在一起
		return url1 + url2;
	}

	/**
	 * 将数组的所有元素使用逗号拼接在一起
	 * @param {String[]} arr 数组
	 * @return {String} 字符串，例: a,b,c
	 */
	static arrayJoin(arr) {
        if (arr == null) {
            return "";
        }
        return arr.join(",");
    }

	/**
	 * 验证URL的正则表达式
     * @type {string}
	 */
	static URL_REGEX = "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]";

	/**
	 * 使用正则表达式判断一个字符串是否为URL
	 * @param {String} str 字符串
	 * @return {Boolean} 是否为URL
	 */
    static isUrl(str) {
        if (this.isEmpty(str)) {
            return false;
        }
        const regex = new RegExp(this.URL_REGEX, 'i');
        return regex.test(str);
    }

	/**
	 * URL编码
	 * @param {String} url see note
	 * @return {String} see note
	 */
     static encodeUrl(url) {
        try {
            return encodeURIComponent(url);
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_12103);
        }
    }

	/**
	 * URL解码
	 * @param {String} url see note
	 * @return {String} see note
	 */
	static decoderUrl(url) {
        try {
            return decodeURIComponent(url);
        } catch (e) {
            throw new SaTokenException(e).setCode(SaErrorCode.CODE_12104);
        }
    }

	/**
	 * 将指定字符串按照逗号分隔符转化为字符串集合
	 * @param {String} str 字符串
	 * @return {Array} 分割后的字符串集合
	 */
	static convertStringToList(str) {
        const list = [];
        if (this.isEmpty(str)) {
            return list;
        }
        const arr = str.split(",");
        for (const s of arr) {
            const trimmed = s.trim();
            if (!this.isEmpty(trimmed)) {
                list.push(trimmed);
            }
        }
        return list;
    }

	/**
	 * 将指定集合按照逗号连接成一个字符串
	 * @param {Array} list 集合
	 * @return {String} 字符串
	 */
	static convertListToString(list) {
        if (list == null || list.length === 0) {
            return "";
        }
        return list.join(",");
    }

    /**
     * String 转 Array，按照逗号切割
     * @param {String} str 字符串
     * @return {Array} 数组
     */
    static convertStringToArray(str) {
        const list = this.convertStringToList(str);
        return list;
    }

    /**
     * Array 转 String，按照逗号连接
     * @param {Array} arr 数组
     * @return {String} 字符串
     */
    static convertArrayToString(arr) {
        if (arr == null || arr.length === 0) {
            return "";
        }
        return arr.join(",");
    }

    /**
     * 返回一个空集合
     * @param <T> 集合类型
     * @return 空集合
     */
    static emptyList() {
        return [];
    }

    /**
     * String数组转集合
     * @param {String...} str String数组
     * @return {List<String>} 集合
     */
    static toList(...str) {
        return [...str];
    }

	/**
	 * String 集合转数组
	 * @param {Array} list 集合
	 * @return {Array} 数组
	 */
	static toArray(list) {
		return [...list];
	}

    /**
     * 日志级别列表。
     * @type {string[]}
     */
    static logLevelList = ["", "trace", "debug", "info", "warn", "error", "fatal"];

    /**
     * 将日志等级从 String 格式转化为 int 格式
     * @param {String} level /
     * @return {int} /
     */
    static translateLogLevelToInt(level) {
        let levelInt = this.logLevelList.indexOf(level);
        if (levelInt <= 0 || levelInt >= this.logLevelList.length) {
            levelInt = 1;
        }
        return levelInt;
    }

    /**
     * 将日志等级从 String 格式转化为 int 格式
     * @param {Int} level /
     * @return {String} /
     */
    static translateLogLevelToString(level) {
        if (level <= 0 || level >= this.logLevelList.length) {
            level = 1;
        }
        return this.logLevelList[level];
    }

	/**
	 * 判断当前系统是否可以打印彩色日志，判断准确率并非100%，但基本可以满足大部分场景
	 * @return /
	 */
	// @SuppressWarnings("all")
    /**
     * 判断当前系统是否可以打印彩色日志，判断准确率并非100%，但基本可以满足大部分场景
     * @return {boolean} 
     */
    static isCanColorLog() {
        // 获取当前环境相关信息
        // Node.js 中使用 isTTY 替代 Java 的 System.console() 检查
        // 检查是否明确禁用了颜色（常见于 CI 环境）
    if (process.env.NO_COLOR || process.env.CI || process.env.TERM === 'dumb') {
        return false;
    }

    // 检查是否强制启用了颜色
    if (process.env.FORCE_COLOR || process.env.COLORTERM) {
        return true;
    }

    // 检查是否在支持颜色的终端中运行
    const isTTY = process.stdout.isTTY;
    const term = process.env.TERM;

    // 在 VSCode 终端中，isTTY 为 true 但 TERM 可能为 undefined
    // VSCode 终端支持颜色，所以这种情况下应该返回 true
    if (isTTY && (term === undefined || term === 'xterm-256color' || term === 'xterm-color')) {
        return true;
    }

    // 检查常见的支持颜色的 TERM 值
    const colorTerms = [
        'xterm', 'xterm-256color', 'xterm-color',
        'screen', 'screen-256color', 'vt100',
        'color', 'ansi', 'cygwin', 'linux'
    ];
    if (term && colorTerms.some(t => term.includes(t))) {
        return true;
    }

    // Windows 10+ 的终端支持颜色
    if (process.platform === 'win32' && parseInt(process.env.WT_SESSION) >= 0) {
        return true;
    }

    // 默认情况
    return false;
    }
	// public static boolean isCanColorLog() {

	// 	// 获取当前环境相关信息
	// 	Console console = System.console();
	// 	String term = System.getenv().get("TERM");

	// 	// 两者均为 null，一般是在 eclipse、idea 等 IDE 环境下运行的，此时可以打印彩色日志
	// 	if(console == null && term == null) {
	// 		return true;
	// 	}

	// 	// 两者均不为 null，一般是在 linux 环境下控制台运行的，此时可以打印彩色日志
	// 	if(console != null && term != null) {
	// 		return true;
	// 	}

	// 	// console 有值，term 为 null，一般是在 windows 的 cmd 控制台运行的，此时不可以打印彩色日志
	// 	if(console != null && term == null) {
	// 		return false;
	// 	}

	// 	// console 为 null，term 有值，一般是在 linux 的 nohup 命令运行的，此时不可以打印彩色日志
	// 	// 此时也有可能是在 windows 的 git bash 环境下运行的，此时可以打印彩色日志，但此场景无法和上述场景区分，所以统一不打印彩色日志
	// 	if(console == null && term != null) {
	// 		return false;
	// 	}

	// 	// 正常情况下，代码不会走到这里，但是方法又必须要有返回值，所以随便返回一个
	// 	return false;
	// }

	/**
	 * list1 是否完全包含 list2 中所有元素
	 * @param {Array} list1 集合1
	 * @param {Array} list2 集合2
	 * @return {boolean} /
	 */
	static list1ContainList2AllElement(list1, list2) {
        if (list2 == null || list2.length === 0) {
            return true;
        }
        if (list1 == null || list1.length === 0) {
            return false;
        }
        for (const str of list2) {
            if (!list1.includes(str)) {
                return false;
            }
        }
        return true;
    }

	/**
	 * list1 是否包含 list2 中任意一个元素
	 * @param {Array} list1 集合1
	 * @param {Array} list2 集合2
	 * @return {boolean} /
	 */
	static list1ContainList2AnyElement(list1, list2) {
		if (list1 == null || list1.length === 0 || list2 == null || list2.length === 0) {
			return false;
		}
		for (const str of list2) {
			if (list1.includes(str)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 从 list1 中剔除 list2 所包含的元素 （克隆副本操作，不影响 list1）
	 * @param {Array} list1 集合1
	 * @param {Array} list2 集合2
	 * @return {Array} /
	 */
	static list1RemoveByList2(list1, list2) {
        if (list1 == null) {
            return null;
        }
        if (list1.length === 0 || list2 == null || list2.length === 0) {
            return [...list1];
        }
        return list1.filter(item => !list2.includes(item));
    }

	/**
	 * 检查字符串是否包含非可打印 ASCII 字符
	 * @param {string} str /
	 * @return {boolean} /
	 */
	static hasNonPrintableASCII(str) {
		if (str == null) {
			return false;
		}
		for (let i = 0; i < str.length; i++) {
			const c = str.charAt(i);
			// ASCII 范围检查：0-31 或 127
			if ((c <= 31) || (c === 127)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 将 value 转化为 String，如果 value 为 null，则返回空字符串
	 * @param {Object} value /
	 * @return {string} /
	 */
	static valueToString(value) {
		if (value == null) {
			return "";
		}
		return String(value);
	}




}

module.exports = SaFoxUtil;
