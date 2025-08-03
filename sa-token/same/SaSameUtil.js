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
import SaSameTemplate from './SaSameTemplate.js';

/**
 * Sa Same-Token 同源系统身份认证模块 - 工具类 
 * 
 * <p> 解决同源系统互相调用时的身份认证校验， 例如：微服务网关请求转发鉴权、微服务RPC调用鉴权 
 * 
 * @author click33
 * @since 1.32.0
 */
class SaSameUtil {

	constructor() {
        throw new Error('SaSameUtil is a static utility class, cannot be instantiated.');
    }
	/**
	 * 提交 Same-Token 时，建议使用的参数名称 
	 */
	static SAME_TOKEN = SaSameTemplate.SAME_TOKEN;

	// -------------------- 获取 & 校验 

	/**
	 * 获取当前 Same-Token, 如果不存在，则立即创建并返回 
	 * @return {String} / 
	 */
	static getToken() {
        return SaManager.getSaSameTemplate().getToken();
    }

	/**
	 * 判断一个 Same-Token 是否有效 
	 * @param {String} token / 
	 * @return {Boolean} /
	 */
	static isValid(token) {
        return SaManager.getSaSameTemplate().isValid(token);
    }

	/**
	 * 校验一个 Same-Token 是否有效 (如果无效则抛出异常) 
	 * @param {String} token / 
	 */
	static checkToken(token) {
        SaManager.getSaSameTemplate().checkToken(token);
    }

	/**
	 * 校验当前 Request 上下文提供的 Same-Token 是否有效 (如果无效则抛出异常) 
	 */
	static checkCurrentRequestToken() {
        SaManager.getSaSameTemplate().checkCurrentRequestToken();
    }

	/**
	 * 刷新一次 Same-Token (注意集群环境中不要多个服务重复调用) 
	 * @return {String}  刷新后产生的新 Same-Token 
	 */
	static refreshToken() {
        return SaManager.getSaSameTemplate().refreshToken();
    }

	
	// -------------------- 获取Token 

	/**
	 * 获取 Same-Token，不做任何处理 
	 * @return {String} / 
	 */
	static getTokenNh() {
        return SaManager.getSaSameTemplate().getTokenNh();
    }

	/**
	 * 获取 Past-Same-Token，不做任何处理 
	 * @return {String} / 
	 */
	static getPastTokenNh() {
        return SaManager.getSaSameTemplate().getPastTokenNh();
    }

}

export default SaSameUtil;
