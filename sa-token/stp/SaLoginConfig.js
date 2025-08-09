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
import SaLoginParameter from "./parameter/SaLoginParameter.js";

/**
 * <h2> 请更换为 new SaLoginParameter() </h2>
 *
 * 快速、简洁的构建：调用 `StpUtil.login()` 时的 [ 配置参数 SaLoginParameter ]
 *
 * <pre>
 *     	// 例如：在登录时指定 token 有效期为七天，代码如下：
 *     	StpUtil.login(10001, SaLoginConfig.setTimeout(60 * 60 * 24 * 7));
 *
 *     	// 上面的代码与下面的代码等价
 *     	StpUtil.login(10001, new SaLoginParameter().setTimeout(60 * 60 * 24 * 7));
 * </pre>
 * 
 * @author click33
 * @since 1.29.0
 */
// @Deprecated
class SaLoginConfig {
	
	/** 私有构造方法 */
    constructor() {
        throw new Error("SaLoginConfig 已废弃，请使用 SaLoginParameter");
    }

	/**
	 * @param {String} device 此次登录的客户端设备类型 
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setDevice(device) {
		return this.create().setDeviceType(device);
	}

	/**
	 * @param {Boolean} isLastingCookie 是否为持久Cookie（临时Cookie在浏览器关闭时会自动删除，持久Cookie在重新打开后依然存在）
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setIsLastingCookie(isLastingCookie) {
		return this.create().setIsLastingCookie(isLastingCookie);
	}

	/**
	 * @param {long} timeout 指定此次登录token的有效期, 单位:秒 （如未指定，自动取全局配置的timeout值）
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setTimeout(timeout) {
		return this.create().setTimeout(timeout);
	}

	/**
	 * @param {long} activeTimeout 指定此次登录 token 最低活跃频率，单位：秒（如未指定，自动取全局配置的 activeTimeout 值）
	 * @return {SaLoginParameter} 对象自身
	 */
	static setActiveTimeout(activeTimeout) {
		return this.create().setActiveTimeout(activeTimeout);
	}

	/**
	 * @param {Map<String, Object>} extraData 扩展信息（只在jwt模式下生效）
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setExtraData(extraData) {
		return this.create().setExtraData(extraData);
	}

	/**
	 * @param {String} token 预定Token（预定本次登录生成的Token值）
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setToken(token) {
		return this.create().setToken(token);
	}

	/**
	 * 写入扩展数据（只在jwt模式下生效） 
	 * @param {String} key 键
	 * @param {Object} value 值 
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setExtra(key, value) {
		return this.create().setExtra(key, value);
	}

	/**
	 * @param {Boolean} isWriteHeader 是否在登录后将 Token 写入到响应头
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setIsWriteHeader(isWriteHeader) {
		return this.create().setIsWriteHeader(isWriteHeader);
	}

	/**
	 * 设置 本次登录挂载到 TokenSign 的数据
	 *
	 * @param {Map<String, Object>} tokenSignTag /
	 * @return {SaLoginParameter} 登录参数 Model
	 */
	static setTokenSignTag(tokenSignTag) {
		return this.create().setTerminalExtraData(tokenSignTag);
	}

	/**
	 * 静态方法获取一个 SaLoginParameter 对象
	 * @return {SaLoginParameter} SaLoginParameter 对象
	 */
	static create() {
		return new SaLoginParameter(SaManager.getConfig());
	}

}
export default SaLoginConfig;
