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
import SaLoginParameter from '../stp/parameter/SaLoginParameter.js'
import StpLogic from '../stp/StpLogic.js'

/**
 * Sa-Token 侦听器
 *
 * <p> 你可以通过实现此接口在用户登录、退出等关键性操作时进行一些AOP切面操作 </p>
 *
 * @author click33
 * @since 1.17.0
 */

class SaTokenListener {

	/**
	 * 每次登录时触发 
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } tokenValue 本次登录产生的 token 值 
	 * @param { SaLoginParameter } loginParameter 登录参数
	 */
	doLogin(loginType, loginId, tokenValue, loginParameter) {};
			
	/**
	 * 每次注销时触发 
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } tokenValue token值
	 */
	doLogout(loginType, loginId, tokenValue) {};
	
	/**
	 * 每次被踢下线时触发 
	 * @param { String } loginType 账号类别 
	 * @param { Object } loginId 账号id 
	 * @param { String } tokenValue token值 
	 */
	doKickout(loginType, loginId, tokenValue) {};

	/**
	 * 每次被顶下线时触发
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } tokenValue token值
	 */
	doReplaced( loginType, loginId, tokenValue) {};

	/**
	 * 每次被封禁时触发
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } service 指定服务 
	 * @param { int } level 封禁等级 
	 * @param { long } disableTime 封禁时长，单位: 秒
	 */
	doDisable(loginType, loginId, service, level, disableTime) {};
	
	/**
	 * 每次被解封时触发
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } service 指定服务 
	 */
	doUntieDisable(loginType, loginId, service) {};

	/**
	 * 每次打开二级认证时触发
	 * @param { String } loginType 账号类别
	 * @param { String } tokenValue token值
	 * @param { String } service 指定服务 
	 * @param { long } safeTime 认证时间，单位：秒 
	 */
	doOpenSafe(loginType, tokenValue, service, safeTime) {};

	/**
	 * 每次关闭二级认证时触发
	 * @param { String } loginType 账号类别
	 * @param { String } tokenValue token值
	 * @param { String } service 指定服务 
	 */
	doCloseSafe(loginType, tokenValue, service) {};

	/**
	 * 每次创建 SaSession 时触发
	 * @param { String } id SessionId
	 */
	doCreateSession(id) {};
	
	/**
	 * 每次注销 SaSession 时触发
	 * @param { String } id SessionId
	 */
	doLogoutSession(id) {};

	/**
	 * 每次 Token 续期时触发（注意：是 timeout 续期，而不是 active-timeout 续期）
	 *
	 * @param { String } loginType 账号类别
	 * @param { Object } loginId 账号id
	 * @param { String } tokenValue token 值
	 * @param { long } timeout 续期时间 
	 */
	doRenewTimeout(loginType, loginId, tokenValue, timeout) {};

	/**
	 * 全局组件载入 
	 * @param { String } compName 组件名称
	 * @param { Object } compObj 组件对象
	 */
	doRegisterComponent(compName, compObj) {}

	/**
	 * 注册了自定义注解处理器
	 * @param { SaAnnotationHandlerInterface<?> }handler 注解处理器
	 */
	doRegisterAnnotationHandler(handler) {}

	/**
	 * StpLogic 对象替换 
	 * @param { StpLogic } stpLogic / 
	 */
	doSetStpLogic(stpLogic) {}

	/**
	 * 载入全局配置 
	 * @param { SaTokenConfig }config /  
	 */
	doSetConfig(config) {}

}

export default SaTokenListener

