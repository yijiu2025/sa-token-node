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

import SaManager from "../SaManager.js";
import SaFoxUtil from "./SaFoxUtil.js";

/**
 * 对请求接口返回 Json 格式数据的简易封装。
 *
 * <p>
 *     所有预留字段：<br>
 * 		code = 状态码 <br>
 * 		msg  = 描述信息 <br>
 * 		data = 携带对象 <br>
 * </p>
 *
 * @author click33 qirly
 * @since 1.22.0
 */
class SaResult extends Map {

	// 序列化版本号
	// private static final long serialVersionUID = 1L;

	// 预定的状态码
	static CODE_SUCCESS = 200;
	static CODE_ERROR = 500;
	static CODE_NOT_PERMISSION = 403;
	static CODE_NOT_LOGIN = 401;


    /**
	 * 构建 
	 */
	constructor(code, msg, data) {
		super();
		
		// 无参构造函数
		if (arguments.length === 0) {
			return;
		}
		
		// 三个参数的构造函数
		if (arguments.length === 3 && typeof code === 'number') {
			this.setCode(code);
			this.setMsg(msg);
			this.setData(data);
			return;
		}
		
		// Map参数构造函数
		if (arguments.length === 1 && typeof code === 'object') {
			this.setMap(code);
			return;
		}
	}

	// /**
	//  * 构建 
	//  */
	// public SaResult() {
	// }

	// /**
	//  * 构建 
	//  * @param code 状态码
	//  * @param msg 信息
	//  * @param data 数据 
	//  */
	// public SaResult(int code, String msg, Object data) {
	// 	this.setCode(code);
	// 	this.setMsg(msg);
	// 	this.setData(data);
	// }

	// /**
	//  * 根据 Map 快速构建 
	//  * @param map / 
	//  */
	// public SaResult(Map<String, ?> map) {
	// 	this.setMap(map);
	// }
	
	/**
	 * 获取code 
	 * @return {Integer} code
	 */
	getCode() {
		return this.get("code");
	}
	/**
	 * 获取msg
	 * @return {String} msg
	 */
	getMsg() {
		return this.get("msg");
	}
	/**
	 * 获取data
	 * @return {Object} data
	 */
	getData() {
		return this.get("data");
	}
	
	/**
	 * 给code赋值，连缀风格
	 * @param {Int} code code
	 * @return {SaResult} 对象自身
	 */
	setCode(code) {
		this.set("code", code);
		return this;
	}
	/**
	 * 给msg赋值，连缀风格
	 * @param {String} msg msg
	 * @return {SaResult} 对象自身
	 */
	setMsg(msg) {
		this.set("msg", msg);
		return this;
	}
	/**
	 * 给data赋值，连缀风格
	 * @param {Object} data data
	 * @return {SaResult} 对象自身
	 */
	setData(data) {
		this.set("data", data);
		return this;
	}

	/**
	 * 写入一个值 自定义key, 连缀风格
	 * @param {String} key key
	 * @param {Object} data data
	 * @return {SaResult} 对象自身 
	 */
	set(key, data) {
		super.set(key, data);
		return this;
	}

	/**
	 * 获取一个值 根据自定义key 
	 * @template T
	 * @param {string} key key
	 * @param {Function} cs 要转换为的类型 
	 * @return {T} 值 
	 */
	getByType(key, cs) {
		return SaFoxUtil.getValueByType(this.get(key), cs);
	}

	/**
	 * 写入一个Map, 连缀风格
	 * @param {Map} map map
	 * @return {SaResult} 对象自身
	 */
	setMap(map) {
		if(map != null) {
			for (const [key, value] of Object.entries(map)) {
				this.set(key, value);
			}
		}
		return this;
	}

	/**
	 * 写入一个 json 字符串, 连缀风格
	 * @param {String} jsonString json 字符串
	 * @return {SaResult} 对象自身
	 */
	setJsonString(jsonString) {
		const map = SaManager.getSaJsonTemplate().jsonToMap(jsonString);
		return this.setMap(map);
	}

	/**
	 * 移除默认属性（code、msg、data）, 连缀风格
	 * @return {SaResult} 对象自身
	 */
	removeDefaultFields() {
		this.delete("code");
		this.delete("msg");
		this.delete("data");
		return this;
	}

	/**
	 * 移除非默认属性（code、msg、data）, 连缀风格
	 * @return {SaResult} 对象自身
	 */
	removeNonDefaultFields() {
		for (const key of this.keys()) {
			if(key === "code" || key === "msg" || key === "data") {
				continue;
			}
			this.delete(key);
		}
		return this;
	}

	
	// ============================  静态方法快速构建  ==================================
	
	// 构建成功
    /**
	 * 构建成功
	 * @return {SaResult} /
	 */
	static ok(msg) {
		if (msg === undefined) {
			return new SaResult(SaResult.CODE_SUCCESS, "ok", null);
		}
		return new SaResult(SaResult.CODE_SUCCESS, msg, null);
	}

	// public static SaResult ok() {
	// 	return new SaResult(CODE_SUCCESS, "ok", null);
	// }
	// public static SaResult ok(String msg) {
	// 	return new SaResult(CODE_SUCCESS, msg, null);
	// }

    /**
	 * 构建指定状态码
	 * @param {number} code /
	 * @return {SaResult} /
	 */
	static code(code) {
		return new SaResult(code, null, null);
	}
	// public static SaResult code(int code) {
	// 	return new SaResult(code, null, null);
	// }

    /**
	 * 构建数据
	 * @param {Object} data /
	 * @return {SaResult} /
	 */
	static data(data) {
		return new SaResult(SaResult.CODE_SUCCESS, "ok", data);
	}
	// public static SaResult data(Object data) {
	// 	return new SaResult(CODE_SUCCESS, "ok", data);
	// }

	/**
	 * 构建失败
	 * @return {SaResult} /
	 */
	static error(msg) {
		if (msg === undefined) {
			return new SaResult(SaResult.CODE_ERROR, "error", null);
		}
		return new SaResult(SaResult.CODE_ERROR, msg, null);
	}
	// // 构建失败
	// public static SaResult error() {
	// 	return new SaResult(CODE_ERROR, "error", null);
	// }
	// public static SaResult error(String msg) {
	// 	return new SaResult(CODE_ERROR, msg, null);
	// }

	// 构建未登录

    /**
	 * 构建未登录
	 * @return {SaResult} /
	 */
	static notLogin() {
		return new SaResult(SaResult.CODE_NOT_LOGIN, "not login", null);
	}
	// public static SaResult notLogin() {
	// 	return new SaResult(CODE_NOT_LOGIN, "not login", null);
	// }

	// 构建无权限
    /**
	 * 构建无权限
	 * @return {SaResult} /
	 */
	static notPermission() {
		return new SaResult(SaResult.CODE_NOT_PERMISSION, "not permission", null);
	}
	// public static SaResult notPermission() {
	// 	return new SaResult(CODE_NOT_PERMISSION, "not permission", null);
	// }



	// 构建指定状态码 
    /**
	 * 构建指定状态码 
	 * @param {number} code /
	 * @param {string} msg /
	 * @param {Object} data /
	 * @return {SaResult} /
	 */
	static get(code, msg, data) {
		return new SaResult(code, msg, data);
	}
	// public static SaResult get(int code, String msg, Object data) {
	// 	return new SaResult(code, msg, data);
	// }

	// 构建一个空的
	/**
	 * 构建一个空的
	 * @return {SaResult} /
	 */
	static empty() {
		return new SaResult();
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	// @Override
    toString() {
		return "{"
				+ "\"code\": " + this.getCode()
				+ ", \"msg\": " + this.transValue(this.getMsg()) 
				+ ", \"data\": " + this.transValue(this.getData()) 
				+ "}";
	}
	// public String toString() {
	// 	return "{"
	// 			+ "\"code\": " + this.getCode()
	// 			+ ", \"msg\": " + transValue(this.getMsg()) 
	// 			+ ", \"data\": " + transValue(this.getData()) 
	// 			+ "}";
	// }

	/**
	 * 转换 value 值：
	 * 	如果 value 值属于 String 类型，则在前后补上引号
	 * 	如果 value 值属于其它类型，则原样返回
	 *
	 * @param {Object} value 具体要操作的值
	 * @return {String} 转换后的值
	 */
	transValue(value) {
		console.log(value)
		if(value == null) {
			return null;
		}
		if(typeof value === 'string') {
			return "\"" + value + "\"";
		}
		return this.toObject(value);
	}

	/* 转换为普通对象 */
    toObject(value) {
        // 深度克隆对象，避免引用问题
        const result = JSON.parse(JSON.stringify(value));
        
        // 特殊处理 Date 对象
        Object.keys(result).forEach(key => {
            if (result[key] instanceof Date) {
                result[key] = result[key].toISOString();
            }
        });
        console.log(result);
        return result;
    }
	toJSON() {
        const obj = {};
        for (const [key, value] of this) {
            obj[key] = value;
        }
        return obj;
    }
	
}

export default SaResult;

// module.exports = {
//     SaResult,
//     // saResultMiddleware
// };