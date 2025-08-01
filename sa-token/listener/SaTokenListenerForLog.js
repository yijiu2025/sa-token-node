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

import SaAnnotationHandlerInterface from '../annotation/handler/SaAnnotationHandlerInterface.js'
import SaTokenConfig from '../config/SaTokenConfig.js'
import StpLogic from '../stp/StpLogic.js'
import SaLoginParameter from '../stp/parameter/SaLoginParameter.js'
import SaFoxUtil from '../util/SaFoxUtil.js'
import SaTokenListener from './SaTokenListener.js'

import {log} from '../SaManager.js'

/**
 * Sa-Token 侦听器的一个实现：Log 打印
 * 
 * @author click33
 * @since 1.33.0
 */

class SaTokenListenerForLog extends SaTokenListener {

	/**
	 * 每次登录时触发 
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值 
     * @param {SaLoginParameter} loginParameter 登录参数
	 */
	@Override
	doLogin(loginType, loginId, tokenValue, loginParameter) {
		log.info("账号 {} 登录成功 (loginType={}), 会话凭证 token={}", loginId, loginType, tokenValue);
	}

	/**
	 * 每次注销时触发 
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
	 */
	@Override
	doLogout(loginType, loginId, tokenValue) {
		log.info("账号 {} 注销登录 (loginType={}), 会话凭证 token={}", loginId, loginType, tokenValue);
	}

	/**
	 * 每次被踢下线时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
	 */
	@Override
	doKickout(loginType, loginId, tokenValue) {
		log.info("账号 {} 被踢下线 (loginType={}), 会话凭证 token={}", loginId, loginType, tokenValue);
	}

	/**
	 * 每次被顶下线时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
	 */
	@Override
	doReplaced(loginType, loginId, tokenValue) {
		log.info("账号 {} 被顶下线 (loginType={}), 会话凭证 token={}", loginId, loginType, tokenValue);
	}

	/**
	 * 每次被封禁时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} service 指定服务 
     * @param {int} level 封禁等级 
     * @param {long} disableTime 封禁时长，单位: 秒
	 */
	@Override
	doDisable(loginType, loginId, service, level, disableTime) {
		log.info("账号 {} [{}服务] 被封禁 (loginType={}), 封禁等级={}, 解封时间为 {}", loginId, loginType, service, level, SaFoxUtil.formatAfterDate(disableTime * 1000));
	}

	/**
	 * 每次被解封时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} service 指定服务
	 */
	@Override
	doUntieDisable(loginType, loginId, service) {
		log.info("账号 {} [{}服务] 解封成功 (loginType={})", loginId, service, loginType);
	}
	
	/**
	 * 每次打开二级认证时触发
     * @param {String} loginType 账号类别
     * @param {String} tokenValue token值
     * @param {String} service 指定服务 
     * @param {long} safeTime 认证时间，单位：秒
	 */
	@Override
	doOpenSafe(loginType, tokenValue, service, safeTime) {
		log.info("token 二级认证成功, 业务标识={}, 有效期={}秒, Token值={}", service, safeTime, tokenValue);
	}

	/**
	 * 每次关闭二级认证时触发
     * @param {String} loginType 账号类别
     * @param {String} tokenValue token值
     * @param {String} service 指定服务
	 */
	@Override
	doCloseSafe(loginType, tokenValue, service) {
		log.info("token 二级认证关闭, 业务标识={}, Token值={}", service, tokenValue);
	}

	/**
	 * 每次创建Session时触发
     * @param {String} id 会话id
	 */
	@Override
	doCreateSession(id) {
		log.info("SaSession [{}] 创建成功", id);
	}

	/**
	 * 每次注销Session时触发
     * @param {String} id 会话id
	 */
	@Override
	doLogoutSession(id) {
		log.info("SaSession [{}] 注销成功", id);
	}

	/**
	 * 每次 Token 续期时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
     * @param {long} timeout 到期时间，单位 秒
	 */
	@Override
	doRenewTimeout(loginType, loginId, tokenValue, timeout) {
		log.info("token 续期成功, {} 秒后到期, 帐号={}, token值={} ", timeout, loginId, tokenValue);
	}

	/**
	 * 全局组件载入 
	 * @param { String } compName 组件名称
	 * @param { Object } compObj 组件对象
	 */
	@Override
	doRegisterComponent(compName, compObj) {
		const canonicalName = compObj == null ? null : compObj.getClass().getCanonicalName();
		log.info("全局组件 {} 载入成功: {}", compName, canonicalName);
	}

	/**
	 * 注册了自定义注解处理器
	 * @param { SaAnnotationHandlerInterface<?> } handler 注解处理器
	 */
	@Override
	doRegisterAnnotationHandler(handler) {
		if(handler != null) {
			log.info("注解扩展 @{} (处理器: {})", handler.getHandlerAnnotationClass().getSimpleName(), handler.getClass().getCanonicalName());
		}
	}

	/**
	 * StpLogic 对象替换 
	 * @param { StpLogic }stpLogic / 
	 */
	@Override
	doSetStpLogic(stpLogic) {
		if(stpLogic != null) {
			log.info("会话组件 StpLogic(type={}) 重置成功: {}", stpLogic.getLoginType(), stpLogic.getClass());
		}
	}

	/**
	 * 载入全局配置 
	 * @param { SaTokenConfig }config / 
	 */
	@Override
	doSetConfig(config) {
		if(config != null) {
			log.info("全局配置 {} ", config);
		}
	}

}

export default SaTokenListenerForLog;












