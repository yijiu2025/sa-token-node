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
import SaLoginParameter from '../stp/parameter/SaLoginParameter.js';
import SaTokenListener from './SaTokenListener.js';
/**
 * Sa-Token 侦听器，默认空实现 
 * 
 * <p> 对所有事件方法提供空实现，方便开发者通过继承此类快速实现一个可用的侦听器 </p>
 * 
 * @author click33
 * @since 1.31.0
 */
class SaTokenListenerForSimple extends SaTokenListener {

    /**
     * 每次登录时触发 
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值 
     * @param {SaLoginParameter} loginParameter 登录参数
     */
	@Override
	doLogin(loginType, loginId, tokenValue, loginParameter) {
		
	}

    /**
     * 每次被踢下线时触发   
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
     */
	@Override
	doLogout(loginType, loginId, tokenValue) {
	}

    /**
     * 每次被踢下线时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值
      */
	@Override
	doKickout(loginType, loginId, tokenValue) {
		
	}

    /**
     * 每次token被顶下线时触发 
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值 
     */
	@Override
	doReplaced(loginType, loginId, tokenValue) {
		
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
		
	}

    /** 
     * 每次被解封时触发
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} service 指定服务 
     */
	@Override
	doUntieDisable(loginType, loginId, service) {
		
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
		
	}

    /**
     * 每次关闭二级认证时触发
     * @param {String} loginType 账号类别
     * @param {String} tokenValue token值
     * @param {String} service 指定服务
     */
	@Override
	doCloseSafe(loginType, tokenValue, service) {
		
	}

    /**
     * 每次创建会话时触发
     * @param {String} id 会话id
     */
	@Override
	doCreateSession(id) {
		
	}

    /**
     * 每次销毁会话时触发
     * @param {String} id 会话id 
     */
	@Override
	doLogoutSession(id) {
		
	}

    /**
     * 每次续签时触发 
     * @param {String} loginType 账号类别
     * @param {Object} loginId 账号id
     * @param {String} tokenValue token值 
     * @param {long} timeout 持续时常，单位: 秒
     */
	@Override
	doRenewTimeout(loginType, loginId, tokenValue, timeout) {

	}
}

export default SaTokenListenerForSimple