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

import SaManager from '../../SaManager.js';
import SaHolder from '../../context/SaHolder.js';
import SaErrorCode from '../../error/SaErrorCode.js';
import NotHttpBasicAuthException from '../../exception/NotHttpBasicAuthException.js';
import SaBase64Util from '../../secure/SaBase64Util.js';
import SaFoxUtil from '../../util/SaFoxUtil.js';
import SaHttpBasicAccount from './SaHttpBasicAccount.js';

/**
 * Sa-Token Http Basic 认证模块
 *
 * @author click33 qirly
 * @since 1.26.0
 */

class SaHttpBasicTemplate {
	
	/**
	 * 默认的 Realm 领域名称
	 */
	static DEFAULT_REALM = "Sa-Token";

	/**
	 * 在校验失败时，设置响应头，并抛出异常
	 * @param {String} realm 领域 
	 */
	throwNotBasicAuthException(realm) {
		SaHolder.getResponse().setStatus(401).setHeader("WWW-Authenticate", "Basic Realm=" + realm);
		throw new NotHttpBasicAuthException().setCode(SaErrorCode.CODE_10311);
	}

	/**
	 * 获取浏览器提交的 Http Basic 参数 （裁剪掉前缀并解码）
	 * @return {String} 值
	 */
	getAuthorizationValue() {
		
		// 获取前端提交的请求头 Authorization 参数
		const authorization = SaHolder.getRequest().getHeader("Authorization");
		
		// 如果不是以 Basic 作为前缀，则视为无效 
		if(authorization == null || ! authorization.startsWith("Basic ")) {
			return null;
		}
		
		// 裁剪前缀并解码 
		return SaBase64Util.decode(authorization.substring(6));
	}

	/**
	 * 获取 Http Basic 账号密码对象
	 * @return {SaHttpBasicAccount}/
	 */
	getHttpBasicAccount() {
		const authorizationValue = this.getAuthorizationValue();
		if(authorizationValue == null) {
			return null;
		}
		return new SaHttpBasicAccount(authorizationValue);
	}

	/**
	 * 对当前会话进行 Basic 校验（使用全局配置的账号密码），校验不通过则抛出异常  
	 */
	// check() {
	// 	check(this.DEFAULT_REALM, SaManager.getConfig().getHttpBasic());
	// }

	/**
	 * 对当前会话进行 Basic 校验（手动设置账号密码），校验不通过则抛出异常  
	 * @param {String} account 账号（格式为 user:password）
	 */
	// check(account = SaManager.getConfig().getHttpBasic()) {
	// 	this.check(SaHttpBasicTemplate.DEFAULT_REALM, account);
	// }

	/**
	 * 对当前会话进行 Basic 校验（手动设置 Realm 和 账号密码），校验不通过则抛出异常 
	 * @param {String} realm 领域 
	 * @param {String} account 账号（格式为 user:password）
	 */
	// check(realm, account) {
	// 	if(SaFoxUtil.isEmpty(account)) {
	// 		account = SaManager.getConfig().getHttpBasic();
	// 	}
	// 	const authorization = this.getAuthorizationValue();
	// 	if(SaFoxUtil.isEmpty(authorization) || authorization !== account) {
	// 		this.throwNotBasicAuthException(realm);
	// 	}
	// }

	check(arg1,arg2) {
		if(arguments.length === 0) {
			/**
			 * 对当前会话进行 Basic 校验（使用全局配置的账号密码），校验不通过则抛出异常  
			 */
			this.check(SaHttpBasicTemplate.DEFAULT_REALM, SaManager.getConfig().getHttpBasic());
		} else if(arguments.length === 1) {
			/**
			 * 对当前会话进行 Basic 校验（手动设置账号密码），校验不通过则抛出异常  
			 * @param arg1 account 账号（格式为 user:password）
			 */
			check(SaHttpBasicTemplate.DEFAULT_REALM, arg1);
		} else if(arguments.length === 2) {

			/**
			 * 对当前会话进行 Basic 校验（手动设置 Realm 和 账号密码），校验不通过则抛出异常 
			 * @param arg1 realm 领域 
			 * @param arg2 account 账号（格式为 user:password）
			 */
			if(SaFoxUtil.isEmpty(arg2)) {
				arg2 = SaManager.getConfig().getHttpBasic();
			}
			const authorization = this.getAuthorizationValue();
			if(SaFoxUtil.isEmpty(authorization) || authorization !== arg2) {
				this.throwNotBasicAuthException(arg1);
			}
		}
	}


}

export default SaHttpBasicTemplate;



