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
import SaCookieConfig from "../config/SaCookieConfig.js";
import SaTokenConfig from "../config/SaTokenConfig.js";
import SaHolder from "../context/SaHolder.js";
import SaCookie from "../context/model/SaCookie.js";
import SaRequest from "../context/model/SaRequest.js";
import SaResponse from "../context/model/SaResponse.js";
import SaStorage from "../context/model/SaStorage.js";
import SaTokenDao from "../dao/SaTokenDao.js";
import SaErrorCode from "../error/SaErrorCode.js";
//import exception from "../exception/*";
import SaFunction from "../fun/SaFunction.js";
import SaTwoParamFunction from "../fun/SaTwoParamFunction.js";
import SaTokenEventCenter from "../listener/SaTokenEventCenter.js";
import SaDisableWrapperInfo from "../model/wrapperInfo/SaDisableWrapperInfo.js";
import SaSession from "../session/SaSession.js";
import SaTerminalInfo from "../session/SaTerminalInfo.js";
import SaLoginParameter from "./parameter/SaLoginParameter.js";
import SaLogoutParameter from "./parameter/SaLogoutParameter.js";
import SaLogoutMode from "./parameter/enums/SaLogoutMode.js";
import SaLogoutRange from "./parameter/enums/SaLogoutRange.js";
import SaReplacedRange from "./parameter/enums/SaReplacedRange.js";
import SaStrategy from "../strategy/SaStrategy.js";
import SaFoxUtil from "../util/SaFoxUtil.js";
import SaTokenConsts from "../util/SaTokenConsts.js";
import SaValue2Box from "../util/SaValue2Box.js";
import SaTokenInfo from "./SaTokenInfo.js";

import NotLoginException from "../exception/NotLoginException.js";
import ApiDisabledException from "../exception/ApiDisabledException.js";
import NotRoleException from "../exception/NotRoleException.js";
import SaTokenException from "../exception/SaTokenException.js";
import NotPermissionException from "../exception/NotPermissionException.js";
import DisableServiceException from "../exception/DisableServiceException.js";
import NotSafeException from "../exception/NotSafeException.js";
//import static cn.dev33.satoken.exception.NotLoginException.*;


/**
 * Sa-Token 权限认证，逻辑实现类
 *
 * <p>
 *     Sa-Token 的核心，框架大多数功能均由此类提供具体逻辑实现。
 * </p>
 *
 * @author click33
 * @since 1.10.0
 */
class StpLogic {

	/**
	 * 账号类型标识，多账号体系时（一个系统多套用户表）用此值区分具体要校验的是哪套用户，比如：login、user、admin
     * {String}
	 */
	loginType;

	/**
	 * 初始化 StpLogic, 并指定账号类型
	 *
	 * @param {String} loginType 账号类型标识
	 */

    constructor(loginType) {
		/** 账号类型标识 */
		this.loginType = '';
		/** 配置对象 */
		this.config = null;

        this.setLoginType(loginType);
    }

	/**
	 * 获取当前 StpLogic 账号类型标识
	 *
	 * @return {String} /
	 */
	getLoginType(){
		return this.loginType;
	}

	/**
	 * 安全的重置当前账号类型
	 *
	 * @param {String} loginType 账号类型标识
	 * @return {StpLogic} 对象自身
	 */
	setLoginType(loginType){

		// 先清除此 StpLogic 在全局 SaManager 中的记录
		if(SaFoxUtil.isNotEmpty(this.loginType)) {
			SaManager.removeStpLogic(this.loginType);
		}

		// 赋值
		this.loginType = loginType;

		// 将新的 loginType => StpLogic 映射关系 put 到 SaManager 全局集合中，以便后续根据 LoginType 进行查找此对象
		SaManager.putStpLogic(this);

		return this;
	}

    /**
     * {SaTokenConfig} 配置对象
     */
	config;

	/**
	 * 写入当前 StpLogic 单独使用的配置对象
	 *
	 * @param {SaTokenConfig} config 配置对象
	 * @return {StpLogic} 对象自身
	 */
	setConfig(config) {
		this.config = config;
		return this;
	}

	/**
	 * 返回当前 StpLogic 使用的配置对象，如果当前 StpLogic 没有配置，则返回 null
	 *
	 * @return {SaTokenConfig} /
	 */
	getConfig() {
		return this.config;
	}

	/**
	 * 返回当前 StpLogic 使用的配置对象，如果当前 StpLogic 没有配置，则返回全局配置对象
	 *
	 * @return {SaTokenConfig} /
	 */
	getConfigOrGlobal() {
		const cfg = this.getConfig();
		if(cfg != null) {
			return cfg;
		}
		return SaManager.getConfig();
	}



	// ------------------- 获取 token 相关 -------------------

	/**
	 * 返回 token 名称，此名称在以下地方体现：Cookie 保存 token 时的名称、提交 token 时参数的名称、存储 token 时的 key 前缀
	 *
	 * @return {String} /
	 */
	getTokenName() {
		return this.splicingKeyTokenName();
	}

	/**
	 * 为指定账号创建一个 token （只是把 token 创建出来，并不持久化存储）
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型
	 * @param {long} timeout 有效时间过期时间
	 * @param {Map<String, Object>} extraData 扩展信息
	 * @return {String} 生成的tokenValue
	 */
	createTokenValue(loginId, deviceType, timeout, extraData) {
		return SaStrategy.instance.createToken(loginId, this.loginType);
	}

	/**
	 * 在当前会话写入指定 token 值
	 *
	 * @param {String} tokenValue token 值 
	 * @param {Number|SaLoginParameter} [param] Cookie超时时间(秒)或登录参数对象
	 */
	setTokenValue(tokenValue, param) {
		// 根据param类型确定登录参数
		let loginParameter;
		
		if (param === undefined) {
			// 情况1: setTokenValue(tokenValue)
			loginParameter = this.createSaLoginParameter();
		} else if (typeof param === 'number') {
			// 情况2: setTokenValue(tokenValue, cookieTimeout)
			loginParameter = this.createSaLoginParameter().setTimeout(param);
		} else {
			// 情况3: setTokenValue(tokenValue, loginParameter)
			loginParameter = param;
		}

		// 先判断一下，如果提供 token 为空，则不执行任何动作  
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return;
		}

		// 1、将 token 写入到当前请求的 Storage 存储器里
		this.setTokenValueToStorage(tokenValue);

		// 2. 将 token 写入到当前会话的 Cookie 里
		if (this.getConfigOrGlobal().getIsReadCookie()) {
			this.setTokenValueToCookie(tokenValue, loginParameter.getCookie(), loginParameter.getCookieTimeout());
		}

		// 3. 将 token 写入到当前请求的响应头中 
		if(loginParameter.getIsWriteHeader()) {
			this.setTokenValueToResponseHeader(tokenValue);
		}
	}

	/**
	 * 将 token 写入到当前请求的 Storage 存储器里
	 *
	 * @param {String} tokenValue 要保存的 token 值
	 */
	setTokenValueToStorage(tokenValue){
		// 1、获取当前请求的 Storage 存储器
		const storage = SaHolder.getStorage();

		// 2、保存 token
		//	- 如果没有配置前缀模式，直接保存
		// 	- 如果配置了前缀模式，则拼接上前缀保存
		const tokenPrefix = this.getConfigOrGlobal().getTokenPrefix();
		if( SaFoxUtil.isEmpty(tokenPrefix) ) {
			storage.set(this.splicingKeyJustCreatedSave(), tokenValue);
		} else {
			storage.set(this.splicingKeyJustCreatedSave(), `${tokenPrefix}${SaTokenConsts.TOKEN_CONNECTOR_CHAT}${tokenValue}`);
			//storage.set(this.splicingKeyJustCreatedSave(), tokenPrefix + SaTokenConsts.TOKEN_CONNECTOR_CHAT + tokenValue);
		}

		// 3、以无前缀的方式再写入一次
		storage.set(SaTokenConsts.JUST_CREATED_NOT_PREFIX, tokenValue);
	}

	// /**
	//  * 将 token 写入到当前会话的 Cookie 里
	//  *
	//  * @param {String} tokenValue token 值
	//  * @param {int} cookieTimeout Cookie存活时间（单位：秒，填-1代表为内存Cookie，浏览器关闭后消失）
	//  */
	// setTokenValueToCookie(tokenValue, cookieTimeout){
	// 	setTokenValueToCookie(tokenValue, null, cookieTimeout);
	// }

	/**
	 * 将 token 写入到当前会话的 Cookie 里
	 * 
	 * @param {String} tokenValue token 值
	 * @param {SaCookieConfig|null} cookieConfig Cookie 配置项
	 * @param {int} cookieTimeout Cookie存活时间（单位：秒，填-1代表为内存Cookie，浏览器关闭后消失）
	 */
	setTokenValueToCookie(tokenValue, cookieConfig = null, cookieTimeout) {
		// 如果第二个参数是数字,说明是简单模式调用
		if (typeof cookieConfig === 'number') {
			cookieTimeout = cookieConfig;
			cookieConfig = null;
		}
		
		// 获取配置
		if (cookieConfig == null) {
			cookieConfig = this.getConfigOrGlobal().getCookie();
		}

		// 创建并配置Cookie
		const cookie = new SaCookie()
				.setName(this.getTokenName())
				.setValue(tokenValue)
				.setMaxAge(cookieTimeout)
				.setDomain(cookieConfig.getDomain())
				.setPath(cookieConfig.getPath())
				.setSecure(cookieConfig.getSecure())
				.setHttpOnly(cookieConfig.getHttpOnly())
				.setSameSite(cookieConfig.getSameSite())
				.setExtraAttrs(cookieConfig.getExtraAttrs());

		// 添加Cookie到响应
		SaHolder.getResponse().addCookie(cookie);
	}

	/**
	 * 将 token 写入到当前请求的响应头中
	 *
	 * @param {String} tokenValue token 值
	 */
	setTokenValueToResponseHeader(tokenValue){
		// 写入到响应头
		const tokenName = this.getTokenName();
		const response = SaHolder.getResponse();
		response.setHeader(tokenName, tokenValue);

		// 此处必须在响应头里指定 Access-Control-Expose-Headers: token-name，否则前端无法读取到这个响应头
		response.addHeader(SaResponse.ACCESS_CONTROL_EXPOSE_HEADERS, tokenName);
	}

	// /**
	//  * 获取当前请求的 token 值
	//  *
	//  * @return {String} 当前tokenValue
	//  */
	// getTokenValue(){
	// 	return getTokenValue(false);
	// }

	/**
	 * 获取当前请求的 token 值
	 *
	 * @param {Boolean} noPrefixThrowException 如果提交的 token 不带有指定的前缀，是否抛出异常
	 * @return {String} 当前tokenValue
	 */
	getTokenValue(noPrefixThrowException = false){

		// 1、获取前端提交的 token （包含前缀值）
		let tokenValue = this.getTokenValueNotCut();

		// 2、如果全局配置打开了前缀模式，则二次处理一下
		const tokenPrefix = this.getConfigOrGlobal().getTokenPrefix();
		if (SaFoxUtil.isNotEmpty(tokenPrefix)) {

			// 情况2.1：如果提交的 token 为空，则转为 null
			if (SaFoxUtil.isEmpty(tokenValue)) {
				tokenValue = null;
			}

			// 情况2.2：如果 token 有值，但是并不是以指定的前缀开头
			else if(! tokenValue.startsWith(tokenPrefix + SaTokenConsts.TOKEN_CONNECTOR_CHAT)) {
				if(noPrefixThrowException) {
					throw NotLoginException.newInstance(this.loginType, NotLoginException.NO_PREFIX, NotLoginException.NO_PREFIX_MESSAGE + "，prefix=" + tokenPrefix, null).setCode(SaErrorCode.CODE_11017);
				} else {
					tokenValue = null;
				}
			}

			// 情况2.3：代码至此，说明 token 有值，且是以指定的前缀开头的，现在裁剪掉前缀
			else {
				tokenValue = tokenValue.substring(tokenPrefix.length + SaTokenConsts.TOKEN_CONNECTOR_CHAT.length);
			}
		}

		// 3、返回
		return tokenValue;
	}

	/**
	 * 获取当前请求的 token 值 （不裁剪前缀）
	 *
	 * @return {String} /
	 */
	getTokenValueNotCut() {

		// 获取相应对象
		const storage = SaHolder.getStorage();
		const request = SaHolder.getRequest();
		const config = this.getConfigOrGlobal();
		const keyTokenName = this.getTokenName();
		let tokenValue = null;

		// 1. 先尝试从 Storage 存储器里读取
		if(storage.get(this.splicingKeyJustCreatedSave()) != null) {
			tokenValue = String(storage.get(this.splicingKeyJustCreatedSave()));
		}
		// 2. 再尝试从 请求体 里面读取
		if(SaFoxUtil.isEmpty(tokenValue) && config.getIsReadBody()){
			tokenValue = request.getParam(keyTokenName);
		}
		// 3. 再尝试从 header 头里读取
		if(SaFoxUtil.isEmpty(tokenValue) && config.getIsReadHeader()){
			tokenValue = request.getHeader(keyTokenName);
		}
		// 4. 最后尝试从 cookie 里读取
		if(SaFoxUtil.isEmpty(tokenValue) && config.getIsReadCookie()){
			tokenValue = request.getCookieValue(keyTokenName);
			if(SaFoxUtil.isNotEmpty(tokenValue) && config.getCookieAutoFillPrefix()) {
				tokenValue = config.getTokenPrefix() + SaTokenConsts.TOKEN_CONNECTOR_CHAT + tokenValue;
			}
		}

		// 5. 至此，不管有没有读取到，都不再尝试了，直接返回
		return tokenValue;
	}

	/**
	 * 获取当前请求的 token 值，如果获取不到则抛出异常
	 *
	 * @return {String} /
	 */
	getTokenValueNotNull(){
		const tokenValue = this.getTokenValue(true);
		if(SaFoxUtil.isEmpty(tokenValue)) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.NOT_TOKEN, NotLoginException.NOT_TOKEN_MESSAGE, null).setCode(SaErrorCode.CODE_11001);
		}
		return tokenValue;
	}

	/**
	 * 获取当前会话的 token 参数信息
	 *
	 * @return {SaTokenInfo} token 参数信息
	 */
	getTokenInfo() {
		const info = new SaTokenInfo();
		info.tokenName = this.getTokenName();
		info.tokenValue = this.getTokenValue();
		info.isLogin = this.isLogin();
		info.loginId = this.getLoginIdDefaultNull();
		info.loginType = this.getLoginType();
		info.tokenTimeout = this.getTokenTimeout();
		info.sessionTimeout = this.getSessionTimeout();
		info.tokenSessionTimeout = this.getTokenSessionTimeout();
		info.tokenActiveTimeout = this.getTokenActiveTimeout();
		info.loginDeviceType = this.getLoginDeviceType();
		return info;
	}


	// ------------------- 登录相关操作 -------------------

	// --- 登录

	// /**
	//  * 会话登录
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  */
	// login(id) {
	// 	login(id, this.createSaLoginParameter());
	// }

	// /**
	//  * 会话登录，并指定登录设备类型
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @param {String} deviceType 设备类型
	//  */
	// login(id, deviceType) {
	// 	login(id, this.createSaLoginParameter().setDeviceType(deviceType));
	// }

	// /**
	//  * 会话登录，并指定是否 [记住我]
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @param {boolean} isLastingCookie 是否为持久Cookie，值为 true 时记住我，值为 false 时关闭浏览器需要重新登录
	//  */
	// login(id, isLastingCookie) {
	// 	login(id, this.createSaLoginParameter().setIsLastingCookie(isLastingCookie));
	// }

	// /**
	//  * 会话登录，并指定此次登录 token 的有效期, 单位:秒
	//  *
	//  * @param {Object} id      账号id，建议的类型：（long | int | String）
	//  * @param {long}  timeout 此次登录 token 的有效期, 单位:秒
	//  */
	// login(id, timeout) {
	// 	login(id, this.createSaLoginParameter().setTimeout(timeout));
	// }

	// /**
	//  * 会话登录，并指定所有登录参数 Model
	//  *
	//  * @param {Object} id      账号id，建议的类型：（long | int | String）
	//  * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	//  */
	// login(id, loginParameter) {
	// 	// 1、创建会话
	// 	const token = this.createLoginSession(id, loginParameter);

	// 	// 2、在当前客户端注入 token
	// 	this.setTokenValue(token, loginParameter);
	// }

	/**
     * 会话登录（支持多种参数模式）
     *
     * @param {Object} id 账号id，建议的类型：（long | int | String）
     * @param {String|boolean|number|SaLoginParameter} [arg] 可选参数：设备类型/是否记住我/token有效期/SaLoginParameter
     */
	login(id, arg) {
        let loginParameter = this.createSaLoginParameter();

        if (typeof arg === 'string') {
            // 设备类型
            loginParameter.setDeviceType(arg);
        } else if (typeof arg === 'boolean') {
            // 是否记住我
            loginParameter.setIsLastingCookie(arg);
        } else if (typeof arg === 'number') {
            // token有效期
            loginParameter.setTimeout(arg);
        } else if (arg && typeof arg === 'object') {
            // SaLoginParameter对象
            loginParameter = arg;
        }
        // 创建会话
        const token = this.createLoginSession(id, loginParameter);
        // 注入token
        this.setTokenValue(token, loginParameter);
    }

	// /**
	//  * 创建指定账号 id 的登录会话数据
	//  *
	//  * @param {Object} id 账号id，建议的类型：（long | int | String）
	//  * @return {String} 返回会话令牌
	//  */
	// createLoginSession(id) {
	// 	return createLoginSession(id, createSaLoginParameter());
	// }

	/**
	 * 创建指定账号 id 的登录会话数据
	 *
	 * @param {Object} id      账号id，建议的类型：（long | int | String）
	 * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	 * @return {String} 返回会话令牌
	 */
	createLoginSession(id, loginParameter = this.createSaLoginParameter()) {

		// 1、先检查一下，传入的参数是否有效
		this.checkLoginArgs(id, loginParameter);

		// 2、给这个账号分配一个可用的 token
		const tokenValue = this.distUsableToken(id, loginParameter);

		// 3、获取此账号的 Account-Session , 续期
		const session = this.getSessionByLoginId(id, true, loginParameter.getTimeout());
		session.updateMinTimeout(loginParameter.getTimeout());

		// 4、在 Account-Session 上记录本次登录的终端信息
		const terminalInfo = new SaTerminalInfo()
				.setDeviceType(loginParameter.getDeviceType())
				.setDeviceId(loginParameter.getDeviceId())
				.setTokenValue(tokenValue)
				.setExtraData(loginParameter.getTerminalExtraData())
				.setCreateTime(Date.now());
		session.addTerminal(terminalInfo);

		// 5、保存 token => id 的映射关系，方便日后根据 token 找账号 id
		this.saveTokenToIdMapping(tokenValue, id, loginParameter.getTimeout());

		// 6、写入这个 token 的最后活跃时间 token-last-active
		if(this.isOpenCheckActiveTimeout()) {
			this.setLastActiveToNow(tokenValue, loginParameter.getActiveTimeout(), loginParameter.getTimeout());
		}

		// 7、如果该 token 对应的 Token-Session 已经存在，则需要给其续期
		const tokenSession = this.getTokenSessionByToken(tokenValue, loginParameter.getRightNowCreateTokenSession());
		if(tokenSession != null) {
			tokenSession.updateMinTimeout(loginParameter.getTimeout());
		}

		// 8、$$ 发布全局事件：账号 xxx 登录成功
		SaTokenEventCenter.doLogin(this.loginType, id, tokenValue, loginParameter);

		// 9、检查此账号会话数量是否超出最大值，如果超过，则按照登录时间顺序，把最开始登录的给注销掉
		if(loginParameter.getMaxLoginCount() !== -1) {
			this.logoutByMaxLoginCount(id, session, null, loginParameter.getMaxLoginCount(), loginParameter.getOverflowLogoutMode());
		}

		// 10、一切处理完毕，返回会话凭证 token
		return tokenValue;
	}

	/**
	 * 为指定账号 id 的登录操作，分配一个可用的 token
	 *
	 * @param {Object} id              账号id，建议的类型：（long | int | String）
	 * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	 * @return {String} 返回 token
	 */
	distUsableToken(id, loginParameter) {

		// 1、获取全局配置的 isConcurrent 参数
		//    如果配置为：不允许一个账号多地同时登录，则需要先将这个账号的历史登录会话标记为：被顶下线
		if( ! loginParameter.getIsConcurrent()) {
			if(loginParameter.getReplacedRange() == SaReplacedRange.CURR_DEVICE_TYPE) {
				this.replaced(id, loginParameter.getDeviceType());
			}
			if(loginParameter.getReplacedRange() == SaReplacedRange.ALL_DEVICE_TYPE) {
				this.replaced(id, this.createSaLogoutParameter());
			}
		}

		// 2、如果调用者预定了要生成的 token，则直接返回这个预定的值，框架无需再操心了
		if(SaFoxUtil.isNotEmpty(loginParameter.getToken())) {
			return loginParameter.getToken();
		}

		// 3、只有在配置了 [ 允许一个账号多地同时登录 ] 时，才尝试复用旧 token，这样可以避免不必要地查询，节省开销
		if(loginParameter.getIsConcurrent()) {

			// 3.1、如果配置了允许复用旧 token
			if(this.isSupportShareToken() && loginParameter.getIsShare()) {

				// 根据 账号id + 设备类型，尝试获取旧的 token
				const tokenValue = this.getTokenValueByLoginId(id, loginParameter.getDeviceType());

				// 如果有值，那就直接复用
				if(SaFoxUtil.isNotEmpty(tokenValue)) {
					return tokenValue;
				}

				// 如果没值，那还是要继续往下走，尝试新建 token
				// ↓↓↓
			}
		}

		// 4、如果代码走到此处，说明未能成功复用旧 token，需要根据算法新建 token
		return SaStrategy.instance.generateUniqueToken(
				"token",
				this.getConfigOfMaxTryTimes(loginParameter),
				() => {
					return this.createTokenValue(id, loginParameter.getDeviceType(), loginParameter.getTimeout(), loginParameter.getExtraData());
				},
				tokenValue => {
					return this.getLoginIdNotHandle(tokenValue) == null;
				}
		);
	}

	/**
	 * 校验登录时的参数有效性，如果有问题会打印警告或抛出异常
	 *
	 * @param {Object} id 账号id
	 * @param {SaLoginParameter} loginParameter 此次登录的参数Model
	 */
	checkLoginArgs(id, loginParameter) {

		// 1、账号 id 不能为空
		if(SaFoxUtil.isEmpty(id)) {
			throw new SaTokenException("loginId 不能为空").setCode(SaErrorCode.CODE_11002);
		}

		// 2、账号 id 不能是异常标记值
		if(NotLoginException.ABNORMAL_LIST.includes(String(id))) {
			throw new SaTokenException("loginId 不能为以下值：" + NotLoginException.ABNORMAL_LIST);
		}

		// 3、账号 id 不能是复杂类型
		if( ! SaFoxUtil.isBasicType(typeof id)) {
			SaManager.log.warn("loginId 应该为简单类型，例如：String | int | long，不推荐使用复杂类型：" + typeof id);
		}

		// 4、判断当前 StpLogic 是否支持 extra 扩展参数
		if( ! this.isSupportExtra()) {
			// 如果不支持，开发者却传入了 extra 扩展参数，那么就打印警告信息
			if(loginParameter.haveExtraData()) {
				SaManager.log.warn("当前 StpLogic 不支持 extra 扩展参数模式，传入的 extra 参数将被忽略");
			}
		}

		// 5、如果全局配置未启动动态 activeTimeout 功能，但是此次登录却传入了 activeTimeout 参数，那么就打印警告信息
		if( ! this.getConfigOrGlobal().getDynamicActiveTimeout() && loginParameter.getActiveTimeout() != null) {
			SaManager.log.warn("当前全局配置未开启动态 activeTimeout 功能，传入的 activeTimeout 参数将被忽略");
		}

	}

	/**
	 * 获取指定账号 id 的登录会话数据，如果获取不到则创建并返回
	 *
	 * @param {Object} id 账号id，建议的类型：（long | int | String）
	 * @return {String} 返回会话令牌
	 */
	getOrCreateLoginSession(id) {
		let tokenValue = this.getTokenValueByLoginId(id);
		if(tokenValue == null) {
			tokenValue = this.createLoginSession(id, this.createSaLoginParameter());
		}
		return tokenValue;
	}

	// // --- 注销 (根据 token)

	// /**
	//  * 在当前客户端会话注销
	//  */
	// logout() {
	// 	logout(createSaLogoutParameter());
	// }

	/**
	 * 在当前客户端会话注销，根据注销参数
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	logoutByToken(logoutParameter = this.createSaLogoutParameter()) {
		// 1、如果本次请求连 Token 都没有提交，那么它本身也不属于登录状态，此时无需执行任何操作
		const tokenValue = this.getTokenValue();
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return;
		}

		// 2、如果打开了 Cookie 模式，则先把 Cookie 数据清除掉
		if(this.getConfigOrGlobal().getIsReadCookie()){
			const cfg = this.getConfigOrGlobal().getCookie();
			const cookie = new SaCookie()		
					.setName(this.getTokenName())
					.setValue(null)
					// 有效期指定为0，做到以增代删
					.setMaxAge(0)
					.setDomain(cfg.getDomain())
					.setPath(cfg.getPath())
					.setSecure(cfg.getSecure())
					.setHttpOnly(cfg.getHttpOnly())
					.setSameSite(cfg.getSameSite())
					;
			SaHolder.getResponse().addCookie(cookie);
		}

		// 3、然后从当前 Storage 存储器里删除 Token
		const storage = SaHolder.getStorage();
		storage.delete(this.splicingKeyJustCreatedSave());

		// 4、清除当前上下文的 [ 活跃度校验 check 标记 ]
		storage.delete(SaTokenConsts.TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY);

		// 5、清除这个 token 的其它相关信息
		if(logoutParameter.getRange() == SaLogoutRange.TOKEN) {
			this.logoutByTokenValue(tokenValue, logoutParameter);
		} else {
			const loginId = this.getLoginIdByTokenNotThinkFreeze(tokenValue);
			if(loginId != null) {
				if(!logoutParameter.getIsKeepFreezeOps() && this.isFreeze(tokenValue)) {
					return;
				}
				this.logout(loginId, logoutParameter);
			}
		}
	}

	// /**
	//  * 注销下线，根据指定 token
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// logoutByTokenValue(tokenValue) {
	// 	this.logoutByTokenValue(tokenValue, this.createSaLogoutParameter());
	// }

	/**
	 * 注销下线，根据指定 token、注销参数
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	logoutByTokenValue(tokenValue, logoutParameter = this.createSaLogoutParameter()) {
		this._logoutByTokenValue(tokenValue, logoutParameter.setMode(SaLogoutMode.LOGOUT));
	}

	// /**
	//  * 踢人下线，根据指定 token
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// kickoutByTokenValue(tokenValue) {
	// 	this.kickoutByTokenValue(tokenValue, this.createSaLogoutParameter());
	// }

	/**
	 * 踢人下线，根据指定 token、注销参数
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	kickoutByTokenValue(tokenValue, logoutParameter = this.createSaLogoutParameter()) {
		this._logoutByTokenValue(tokenValue, logoutParameter.setMode(SaLogoutMode.KICKOUT));
	}

	// /**
	//  * 顶人下线，根据指定 token
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {String} tokenValue 指定 token
	//  */
	// replacedByTokenValue(tokenValue) {
	// 	this.replacedByTokenValue(tokenValue, this.createSaLogoutParameter());
	// }

	/**
	 * 顶人下线，根据指定 token、注销参数
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	replacedByTokenValue(tokenValue, logoutParameter = this.createSaLogoutParameter()) {
		this._logoutByTokenValue(tokenValue, logoutParameter.setMode(SaLogoutMode.REPLACED));
	}

	/**
	 * [work] 注销下线，根据指定 token 、注销参数
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	_logoutByTokenValue(tokenValue, logoutParameter) {

		// 1、判断一下：如果此 token 映射的是一个无效 loginId，则此处立即返回，不需要再往下处理了
		// 		如果不提前截止，则后续的操作可能会写入意外数据
		const loginId = this.getLoginIdByTokenNotThinkFreeze(tokenValue);
		if( SaFoxUtil.isEmpty(loginId) ) {
			return;
		}
		if(!logoutParameter.getIsKeepFreezeOps() && this.isFreeze(tokenValue)) {
			return;
		}

		// 2、清除这个 token 的最后活跃时间记录
		if(this.isOpenCheckActiveTimeout()) {
			this.clearLastActive(tokenValue);
		}

		// 3、清除 Token-Session
		if( ! logoutParameter.getIsKeepTokenSession()) {
			this.deleteTokenSession(tokenValue);
		}

		// 4、清理或更改 Token 映射
		// 5、发布事件通知
		// 		SaLogoutMode.LOGOUT：注销下线
		if(logoutParameter.getMode() == SaLogoutMode.LOGOUT) {
			this.deleteTokenToIdMapping(tokenValue);
			SaTokenEventCenter.doLogout(this.loginType, loginId, tokenValue);
		}
		// 		SaLogoutMode.LOGOUT：踢人下线
		if(logoutParameter.getMode() == SaLogoutMode.KICKOUT) {
			this.updateTokenToIdMapping(tokenValue, NotLoginException.KICK_OUT);
			SaTokenEventCenter.doKickout(this.loginType, loginId, tokenValue);
		}
		//		SaLogoutMode.REPLACED：顶人下线
		if(logoutParameter.getMode() == SaLogoutMode.REPLACED) {
			this.updateTokenToIdMapping(tokenValue, NotLoginException.BE_REPLACED);
			SaTokenEventCenter.doReplaced(this.loginType, loginId, tokenValue);
		}

		// 6、清理这个账号的 Account-Session 上的 terminal 信息，并且尝试注销掉 Account-Session
		const session = this.getSessionByLoginId(loginId, false);
		if(session != null) {
			session.removeTerminal(tokenValue);
			session.logoutByTerminalCountToZero();
		}
	}

	// --- 注销 (根据 loginId)

	/**
	 * 会话注销方法 - 支持多种注销方式
	 * 
	 * @param {Object|SaLogoutParameter} arg1 账号id或注销参数对象 
	 * @param {String|SaLogoutParameter} [arg2] 设备类型或注销参数对象
	 */
	logout(arg1, arg2) {
		// 情况1: logout(logoutParameter)
		if(arg1 instanceof SaLogoutParameter || arg1 === undefined) {
			const logoutParameter = arg1 || this.createSaLogoutParameter();
			//logout() and logout(logoutParameter)
			this.logoutByToken(logoutParameter);
			return;
		}

		// 情况2: logout(loginId)
		if(arg2 === undefined) {
			this._logout(arg1, this.createSaLogoutParameter().setMode(SaLogoutMode.LOGOUT));
			return;
		}

		// 情况3: logout(loginId, deviceType)
		if(typeof arg2 === 'string') {
			this._logout(arg1, this.createSaLogoutParameter()
				.setDeviceType(arg2)
				.setMode(SaLogoutMode.LOGOUT));
			return;
		}

		// 情况4: logout(loginId, logoutParameter) 
		if(arg2 instanceof SaLogoutParameter) {
			this._logout(arg1, arg2.setMode(SaLogoutMode.LOGOUT));
			return;
		}

		// 参数错误
		throw new Error('Invalid logout parameters');
	}


	// /**
	//  * 会话注销，根据账号id
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// logout(loginId) {
	// 	this.logout(loginId, this.createSaLogoutParameter());
	// }

	// /**
	//  * 会话注销，根据账号id 和 设备类型
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 (填 null 代表注销该账号的所有设备类型)
	//  */
	// logout(loginId, deviceType) {
	// 	logout(loginId, createSaLogoutParameter().setDeviceType(deviceType));
	// }

	// /**
	//  * 会话注销，根据账号id 和 注销参数
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// logout(loginId, logoutParameter) {
	// 	_logout(loginId, logoutParameter.setMode(SaLogoutMode.LOGOUT));
	// }


	/**
	 * 踢人下线方法 - 支持多种参数模式
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String|SaLogoutParameter} [arg] 可选参数：设备类型或注销参数对象
	 */
	kickout(loginId, arg) {
		// 参数检查
		// if(SaFoxUtil.isEmpty(loginId)) {
		// 	throw new Error('loginId cannot be empty');
		// }

		// 情况1: kickout(loginId)
		if(arg === undefined) {
			this._logout(loginId, this.createSaLogoutParameter()
				.setMode(SaLogoutMode.KICKOUT));
			return;
		}

		// 情况2: kickout(loginId, deviceType)
		if(typeof arg === 'string' || arg === null) {
			this._logout(loginId, this.createSaLogoutParameter()
				.setDeviceType(arg)
				.setMode(SaLogoutMode.KICKOUT));
			return;  
		}

		// 情况3: kickout(loginId, logoutParameter)
		if(arg instanceof SaLogoutParameter) {
			this._logout(loginId, arg.setMode(SaLogoutMode.KICKOUT));
			return;
		}

		// 参数错误
		throw new Error('Invalid kickout parameters');
	}

	// /**
	//  * 踢人下线，根据账号id
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// kickout(loginId) {
	// 	kickout(loginId, createSaLogoutParameter());
	// }

	// /**
	//  * 踢人下线，根据账号id 和 设备类型
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 (填 null 代表踢出该账号的所有设备类型)
	//  */
	// kickout(loginId, deviceType) {
	// 	kickout(loginId, createSaLogoutParameter().setDeviceType(deviceType));
	// }

	// /**
	//  * 踢人下线，根据账号id 和 注销参数
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-5 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// kickout(loginId, logoutParameter) {
	// 	_logout(loginId, logoutParameter.setMode(SaLogoutMode.KICKOUT));
	// }


	/**
	 * 顶人下线方法 - 支持多种参数模式 
	 * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String|SaLogoutParameter} [arg] 可选参数：设备类型或注销参数对象
	 */
	replaced(loginId, arg) {
		// 参数检查 
		// if(SaFoxUtil.isEmpty(loginId)) {
		// 	throw new Error('loginId cannot be empty');
		// }

		// 情况1: replaced(loginId)
		if(arg === undefined) {
			this._logout(loginId, this.createSaLogoutParameter()
				.setMode(SaLogoutMode.REPLACED));
			return;
		}

		// 情况2: replaced(loginId, deviceType) 
		if(typeof arg === 'string' || arg === null) {
			this._logout(loginId, this.createSaLogoutParameter()
				.setDeviceType(arg)
				.setMode(SaLogoutMode.REPLACED));
			return;
		}

		// 情况3: replaced(loginId, logoutParameter)
		if(arg instanceof SaLogoutParameter) {
			this._logout(loginId, arg.setMode(SaLogoutMode.REPLACED));
			return;
		}

		// 参数错误
		throw new Error('Invalid replaced parameters');
	}




	// /**
	//  * 顶人下线，根据账号id
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// replaced(loginId) {
	// 	replaced(loginId, createSaLogoutParameter());
	// }

	// /**
	//  * 顶人下线，根据账号id 和 设备类型
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} deviceType 设备类型 （填 null 代表顶替该账号的所有设备类型）
	//  */
	// replaced(loginId, deviceType) {
	// 	replaced(loginId, createSaLogoutParameter().setDeviceType(deviceType));
	// }

	// /**
	//  * 顶人下线，根据账号id 和 注销参数
	//  * <p> 当对方再次访问系统时，会抛出 NotLoginException 异常，场景值=-4 </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {SaLogoutParameter} logoutParameter 注销参数
	//  */
	// replaced(loginId, logoutParameter) {
	// 	_logout(loginId, logoutParameter.setMode(SaLogoutMode.REPLACED));
	// }

	/**
	 * [work] 会话注销，根据账号id 和 注销参数
	 *
	 * @param {Object} loginId 账号id
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	_logout(loginId, logoutParameter) {
		// 1、获取此账号的 Account-Session，上面记录了此账号的所有登录客户端数据
		const session = this.getSessionByLoginId(loginId, false);
		if(session != null) {

			// 2、遍历此 SaTerminalInfo 客户端列表，清除相关数据
			const terminalList = session.terminalListCopy();
			for (const terminal of terminalList) {
				// 不符合 deviceType 的跳过
				if( ! SaFoxUtil.isEmpty(logoutParameter.getDeviceType()) &&  logoutParameter.getDeviceType() !== terminal.getDeviceType()) {
					continue;
				}
				// 不符合 deviceId 的跳过
				if( ! SaFoxUtil.isEmpty(logoutParameter.getDeviceId()) &&  logoutParameter.getDeviceId() !== terminal.getDeviceId()) {
					continue;
				}
				this._removeTerminal(session, terminal, logoutParameter);
			}

			// 3、如果代码走到这里的时候，此账号已经没有客户端在登录了，则直接注销掉这个 Account-Session
			if(logoutParameter.getMode() == SaLogoutMode.REPLACED) {
				// 因为调用顶替下线时，一般都是在新客户端正在登录，所以此种情况不需要清除该账号的 Account-Session
				// 如果清除了 Account-Session，将可能导致 Account-Session 被注销后又立刻创建出来，造成不必要的性能浪费
			} else {
				session.logoutByTerminalCountToZero();
			}
		}
	}

	// --- 注销 (会话管理辅助方法)

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (注销下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	removeTerminalByLogout(session, terminal) {
		this._removeTerminal(session, terminal, this.createSaLogoutParameter().setMode(SaLogoutMode.LOGOUT));
	}

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (踢人下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	removeTerminalByKickout(session, terminal) {
		this._removeTerminal(session, terminal, this.createSaLogoutParameter().setMode(SaLogoutMode.KICKOUT));
	}

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (顶人下线方式)
	 * @param {SaSession} session /
	 * @param {SaTerminalInfo} terminal /
	 */
	removeTerminalByReplaced(session, terminal) {
		this._removeTerminal(session, terminal, this.createSaLogoutParameter().setMode(SaLogoutMode.REPLACED));
	}

	/**
	 * 在 Account-Session 上移除 Terminal 信息 (内部方法，仅为减少重复代码，外部调用意义不大)
	 * @param {SaSession} session Account-Session
	 * @param {SaTerminalInfo} terminal 设备信息
	 * @param {SaLogoutParameter} logoutParameter 注销参数
	 */
	_removeTerminal(session, terminal, logoutParameter) {

		const loginId = session.getLoginId();
		const tokenValue = terminal.getTokenValue();

		// 1、从 Account-Session 上清除此设备信息
		session.removeTerminal(tokenValue);

		// 2、清除这个 token 的最后活跃时间记录
		if(this.isOpenCheckActiveTimeout()) {
			this.clearLastActive(tokenValue);
		}

		// 3、清除这个 token 的 Token-Session 对象
		if( ! logoutParameter.getIsKeepTokenSession()) {
			this.deleteTokenSession(tokenValue);
		}

		// 4、清理或更改 Token 映射
		// 5、发布事件通知
		// 		SaLogoutMode.LOGOUT：注销下线
		if(logoutParameter.getMode() == SaLogoutMode.LOGOUT) {
			this.deleteTokenToIdMapping(tokenValue);
			SaTokenEventCenter.doLogout(this.loginType, loginId, tokenValue);
		}
		// 		SaLogoutMode.LOGOUT：踢人下线
		if(logoutParameter.getMode() == SaLogoutMode.KICKOUT) {
			this.updateTokenToIdMapping(tokenValue, NotLoginException.KICK_OUT);
			SaTokenEventCenter.doKickout(this.loginType, loginId, tokenValue);
		}
		//		SaLogoutMode.REPLACED：顶人下线
		if(logoutParameter.getMode() == SaLogoutMode.REPLACED) {
			this.updateTokenToIdMapping(tokenValue, NotLoginException.BE_REPLACED);
			SaTokenEventCenter.doReplaced(this.loginType, loginId, tokenValue);
		}
	}

	/**
	 * 如果指定账号 id、设备类型的登录客户端已经超过了指定数量，则按照登录时间顺序，把最开始登录的给注销掉
	 *
	 * @param {Object} loginId 账号id
	 * @param {SaSession} session 此账号的 Account-Session 对象，可填写 null，框架将自动获取
	 * @param {String} deviceType 设备类型（填 null 代表注销此账号所有设备类型的登录）
	 * @param {int} maxLoginCount 最大登录数量，超过此数量的将被注销
	 * @param {SaLogoutMode} logoutMode 超出的客户端将以何种方式被注销
	 */
	logoutByMaxLoginCount(loginId, session, deviceType, maxLoginCount, logoutMode) {

		// 1、如果调用者提供的  Account-Session 对象为空，则我们先手动获取一下
		if(session == null) {
			session = this.getSessionByLoginId(loginId, false);
			if(session == null) {
				return;
			}
		}

		// 2、获取这个账号指定设备类型下的所有登录客户端
		const list = session.getTerminalListByDeviceType(deviceType);

		// 3、按照登录时间倒叙，超过 maxLoginCount 数量的，全部注销掉
		for (let i = 0; i < list.length - maxLoginCount; i++) {
			this._removeTerminal(session, list[i], this.createSaLogoutParameter().setMode(logoutMode));
		}

		// 4、如果代码走到这里的时候，此账号已经没有客户端在登录了，则直接注销掉这个 Account-Session
		session.logoutByTerminalCountToZero();
	}


	// ---- 会话查询

	/**
	 * 判断会话登录状态
	 * 
	 * @param {Object} [loginId] 账号id，可选参数
	 * @return {boolean} 已登录返回 true，未登录返回 false 
	 */
	isLogin(loginId) {
		// 判断是否传入了 loginId 参数
		if(loginId !== undefined) {
			// 有 loginId 参数时判断指定账号是否登录
			// 判断条件：能否根据 loginId 查询到对应的 terminal 值
			const terminalList = this.getTerminalListByLoginId(loginId, null);
			return Array.isArray(terminalList) && terminalList.length > 0;
		} else {
			// 无参数时判断当前会话是否登录
			// 判断条件：
			// 1、获取到的 loginId 不为 null
			// 2、并且不在异常项集合里(此项在 getLoginIdDefaultNull() 方法里完成判断) 
			return this.getLoginIdDefaultNull() != null;
		}
	}
	/**
	 * 判断当前会话是否已经登录
	 *
	 * @return {boolean} 已登录返回 true，未登录返回 false
	 */
	// isLogin() {
	// 	// 判断条件：
	// 	// 		1、获取到的 loginId 不为 null，
	// 	// 		2、并且不在异常项集合里（此项在 getLoginIdDefaultNull() 方法里完成判断）
	// 	return getLoginIdDefaultNull() != null;
	// }

	// /**
	//  * 判断指定账号是否已经登录
	//  *
	//  * @return {boolean} 已登录返回 true，未登录返回 false
	//  */
	// isLogin(loginId) {
	// 	// 判断条件：能否根据 loginId 查询到对应的 terminal 值
	// 	return !this.getTerminalListByLoginId(loginId, null).isEmpty();
	// }

	/**
	 * 检验当前会话是否已经登录，如未登录，则抛出异常
	 */
	checkLogin() {
		// 效果与 getLoginId() 相同，只是 checkLogin() 更加语义化一些
		this.getLoginId();
	}

	/**
	 * 获取当前会话账号id，如果未登录，则抛出异常
	 *
	 * @return {Object} 账号id
	 */
	getLoginId(defaultValue) {
		if(defaultValue !== undefined) {
			// 如果传入了默认值，则尝试获取当前会话的 loginId
			const loginId = this.getLoginIdDefaultNull();
			// 如果 loginId 为 null，则返回默认值
			if(loginId == null) {
				return defaultValue;
			}
			// 3、loginId 不为 null，则开始尝试类型转换
			if(defaultValue == null) {
				return loginId;
			}
			return SaFoxUtil.getValueByType(loginId, typeof defaultValue);
		}


		// 1、先判断一下当前会话是否正在 [ 临时身份切换 ], 如果是则返回临时身份
		if(this.isSwitch()) {
			return this.getSwitchLoginId();
		}

		// 2、如果前端没有提交 token，则抛出异常: 未能读取到有效 token
		const tokenValue = this.getTokenValue(true);
		if(SaFoxUtil.isEmpty(tokenValue)) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.NOT_TOKEN, NotLoginException.NOT_TOKEN_MESSAGE, null).setCode(SaErrorCode.CODE_11011);
		}

		// 3、查找此 token 对应的 loginId，如果找不到则抛出：token 无效
		const loginId = getLoginIdNotHandle(tokenValue);
		if(SaFoxUtil.isEmpty(loginId)) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.INVALID_TOKEN, NotLoginException.INVALID_TOKEN_MESSAGE, tokenValue).setCode(SaErrorCode.CODE_11012);
		}

		// 4、如果这个 token 指向的是值是：过期标记，则抛出：token 已过期
		if(loginId == NotLoginException.TOKEN_TIMEOUT) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.TOKEN_TIMEOUT, NotLoginException.TOKEN_TIMEOUT_MESSAGE, tokenValue).setCode(SaErrorCode.CODE_11013);
		}

		// 5、如果这个 token 指向的是值是：被顶替标记，则抛出：token 已被顶下线
		if(loginId == NotLoginException.BE_REPLACED) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.BE_REPLACED, NotLoginException.BE_REPLACED_MESSAGE, tokenValue).setCode(SaErrorCode.CODE_11014);
		}

		// 6、如果这个 token 指向的是值是：被踢下线标记，则抛出：token 已被踢下线
		if(loginId == NotLoginException.KICK_OUT) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.KICK_OUT, NotLoginException.KICK_OUT_MESSAGE, tokenValue).setCode(SaErrorCode.CODE_11015);
		}

		// 7、token 活跃频率检查
		this.checkActiveTimeoutByConfig(tokenValue);

		// ------ 至此，loginId 已经是一个合法的值，代表当前会话是一个正常的登录状态了

		// 8、返回 loginId
		return loginId;
	}

	// /**
	//  * 获取当前会话账号id, 如果未登录，则返回默认值
	//  *
	//  * @param {T} <T> 返回类型
	//  * @param {<T>} defaultValue 默认值
	//  * @return 登录id
	//  */
	// // @SuppressWarnings("unchecked")
	// getLoginId(defaultValue) {
	// 	// 1、先正常获取一下当前会话的 loginId
	// 	const loginId = this.getLoginIdDefaultNull();

	// 	// 2、如果 loginId 为 null，则返回默认值
	// 	if(loginId == null) {
	// 		return defaultValue;
	// 	}
	// 	// 3、loginId 不为 null，则开始尝试类型转换
	// 	if(defaultValue == null) {
	// 		return loginId;
	// 	}
	// 	return SaFoxUtil.getValueByType(loginId, typeof defaultValue);
	// }

	/**
	 * 获取当前会话账号id, 如果未登录，则返回null
	 *
	 * @return {Object} 账号id
	 */
	getLoginIdDefaultNull() {

		// 1、先判断一下当前会话是否正在 [ 临时身份切换 ], 如果是则返回临时身份
		if(this.isSwitch()) {
			return this.getSwitchLoginId();
		}

		// 2、如果前端连 token 都没有提交，则直接返回 null
		const tokenValue = this.getTokenValue();
		if(tokenValue == null) {
			return null;
		}

		// 3、根据 token 找到对应的 loginId，如果 loginId 为 null 或者属于异常标记里面，均视为未登录, 统一返回 null
		const loginId = this.getLoginIdNotHandle(tokenValue);
		if( ! this.isValidLoginId(loginId) ) {
			return null;
		}

		// 4、如果 token 已被冻结，也返回 null
		if(this.getTokenActiveTimeoutByToken(tokenValue) == SaTokenDao.NOT_VALUE_EXPIRE) {
			return null;
		}

		// 5、执行到此，证明此 loginId 已经是个正常合法的账号id了，可以返回
		return loginId;
	}

	/**
	 * 获取当前会话账号id, 并转换为 String 类型
	 *
	 * @return {String} 账号id
	 */
	getLoginIdAsString() {
		return String(this.getLoginId());
	}

	/**
	 * 获取当前会话账号id, 并转换为 int 类型
	 *
	 * @return {int} 账号id
	 */
	getLoginIdAsInt() {
		const loginId = this.getLoginId();
		const value = parseInt(String(loginId));
		// if(isNaN(value)) {
		//     throw new Error('LoginId cannot be converted to integer');
		// }
		return value;
	}
	// getLoginIdAsInt() {
	// 	return Integer.parseInt(String.valueOf(getLoginId()));
	// }

	/**
	 * 获取当前会话账号id, 并转换为 long 类型
	 *
	 * @return {long} 账号id
	 */
	getLoginIdAsLong() {
		const loginId = this.getLoginId(); 
		// Node.js中的Number可以处理比较大的整数
		const value = Number(String(loginId));
		// if(isNaN(value)) {
		// 	throw new Error('LoginId cannot be converted to number');
		// }
		return value;
	}
	// getLoginIdAsLong() {
	// 	return Long.parseLong(String.valueOf(getLoginId()));
	// }

	/**
	 * 获取指定 token 对应的账号id，如果 token 无效或 token 处于被踢、被顶、被冻结等状态，则返回 null
	 *
	 * @param {String} tokenValue token
	 * @return {Object} 账号id
	 */
	getLoginIdByToken(tokenValue) {

		const loginId = this.getLoginIdByTokenNotThinkFreeze(tokenValue);

		if( SaFoxUtil.isNotEmpty(loginId) ) {
			// 如果 token 已被冻结，也返回 null
			const activeTimeout = this.getTokenActiveTimeoutByToken(tokenValue);
			if(activeTimeout == SaTokenDao.NOT_VALUE_EXPIRE) {
				return null;
			}
		}

		return loginId;
	}

	/**
	 * 获取指定 token 对应的账号id，如果 token 无效或 token 处于被踢、被顶等状态 (不考虑被冻结)，则返回 null
	 *
	 * @param {String} tokenValue token
	 * @return {Object} 账号id
	 */
	getLoginIdByTokenNotThinkFreeze(tokenValue) {

		// 1、如果提供的 token 为空，则直接返回 null
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return null;
		}

		// 2、查找此 token 对应的 loginId，如果找不到或找的到但属于无效值，则返回 null
		const loginId = this.getLoginIdNotHandle(tokenValue);
		if( ! this.isValidLoginId(loginId) ) {
			return null;
		}

		// 3、返回
		return loginId;
	}

	/**
	 * 获取指定 token 对应的账号id （不做任何特殊处理）
	 *
	 * @param {String} tokenValue token 值
	 * @return {String} 账号id
	 */
	getLoginIdNotHandle(tokenValue) {
		return this.getSaTokenDao().get(this.splicingKeyTokenValue(tokenValue));
	}


	/**
	 * 获取 Token 的扩展信息（此函数只在jwt模式下生效）
	 *
	 * @param {String} keyOrToken 键值或指定的Token值
	 * @param {String} [key] 键值(当第一个参数为token时使用)
	 * @return {Object} 对应的扩展数据
	 * @throws {ApiDisabledException} 当未集成jwt插件时抛出异常
	 */
	getExtra(keyOrToken, key) {
		// 抛出异常提示需要集成 jwt 插件
		throw new ApiDisabledException("只有在集成 sa-token-jwt 插件后才可以使用 extra 扩展参数")
			.setCode(SaErrorCode.CODE_11031);
	}
	// /**
	//  * 获取当前 Token 的扩展信息（此函数只在jwt模式下生效）
	//  *
	//  * @param {String} key 键值
	//  * @return {Object} 对应的扩展数据
	//  */
	// getExtra(key) {
	// 	throw new ApiDisabledException("只有在集成 sa-token-jwt 插件后才可以使用 extra 扩展参数").setCode(SaErrorCode.CODE_11031);
	// }

	// /**
	//  * 获取指定 Token 的扩展信息（此函数只在jwt模式下生效）
	//  *
	//  * @param {String} tokenValue 指定的 Token 值
	//  * @param {String} key 键值
	//  * @return {Object} 对应的扩展数据
	//  */
	// getExtra(tokenValue, key) {
	// 	throw new ApiDisabledException("只有在集成 sa-token-jwt 插件后才可以使用 extra 扩展参数").setCode(SaErrorCode.CODE_11031);
	// }

	// ---- 其它操作

	/**
	 * 判断一个 loginId 是否是有效的 (判断标准：不为 null、空字符串，且不在异常标记项里面)
	 *
	 * @param {Object} loginId 账号id
	 * @return {boolean} /
	 */
	isValidLoginId(loginId) {
		return SaFoxUtil.isNotEmpty(loginId) && !NotLoginException.ABNORMAL_LIST.includes(String(loginId));
	}

	/**
	 * 判断一个 token 是否是有效的 (判断标准：使用此 token 查询到的 loginId 不为 Empty )
	 *
	 * @param {String} tokenValue /
	 * @return {boolean} /
	 */
	isValidToken(tokenValue) {
		const loginId = this.getLoginIdByToken(tokenValue);
		return SaFoxUtil.isNotEmpty(loginId);
	}

	/**
	 * 存储 token - id 映射关系
	 *
	 * @param {String} tokenValue token值
	 * @param {String} loginId 账号id
	 * @param {long} timeout 会话有效期 (单位: 秒)
	 */
	saveTokenToIdMapping(tokenValue, loginId, timeout) {
		this.getSaTokenDao().set(this.splicingKeyTokenValue(tokenValue), String(loginId), timeout);
	}

	/**
	 * 更改 token - id 映射关系
	 *
	 * @param {String} tokenValue token值
	 * @param {Object} loginId 新的账号Id值
	 */
	updateTokenToIdMapping(tokenValue, loginId) {
		// 先判断一下，是否传入了空值
		SaTokenException.notTrue(SaFoxUtil.isEmpty(loginId), "loginId 不能为空", SaErrorCode.CODE_11003);

		// 更新缓存中的 token 指向
		this.getSaTokenDao().update(this.splicingKeyTokenValue(tokenValue), String(loginId));
	}

	/**
	 * 删除 token - id 映射
	 *
	 * @param {String} tokenValue token值
	 */
	deleteTokenToIdMapping(tokenValue) {
		this.getSaTokenDao().delete(this.splicingKeyTokenValue(tokenValue));
	}


	// ------------------- Account-Session 相关 -------------------

	/**
	 * 获取指定 key 的 SaSession, 如果该 SaSession 尚未创建，isCreate = 是否立即新建并返回
	 *
	 * @param {String} sessionId SessionId
	 * @param {boolean} isCreate 是否新建
	 * @param {Long} timeout 如果这个 SaSession 是新建的，则使用此值作为过期值（单位：秒），可填 null，代表使用全局 timeout 值
	 * @param {Consumer<SaSession>} appendOperation 如果这个 SaSession 是新建的，则要追加执行的动作，可填 null，代表无追加动作
	 * @return {SaSession} Session对象
	 */
	getSessionBySessionId(sessionId, isCreate = false, timeout = null, appendOperation = null) {

		// 如果提供的 sessionId 为 null，则直接返回 null
		if(SaFoxUtil.isEmpty(sessionId)) {
			throw new SaTokenException("SessionId 不能为空").setCode(SaErrorCode.CODE_11072);
		}

		// 先检查这个 SaSession 是否已经存在，如果不存在且 isCreate=true，则新建并返回
		const session = this.getSaTokenDao().getSession(sessionId);

		if(session == null && isCreate) {
			// 创建这个 SaSession
			session = SaStrategy.instance.createSession(sessionId);

			// 追加操作
			if(appendOperation != null) {
				appendOperation(session);
			}

			// 如果未提供 timeout，则根据相应规则设定默认的 timeout
			if(timeout == null) {
				// 如果是 Token-Session，则使用对用 token 的有效期，使 token 和 token-session 保持相同ttl，同步失效
				if(SaTokenConsts.SESSION_TYPE__TOKEN==session.getType()) {
					timeout = this.getTokenTimeout(session.getToken());
					if(timeout == SaTokenDao.NOT_VALUE_EXPIRE) {
						timeout = this.getConfigOrGlobal().getTimeout();
					}
				} else {
					// 否则使用全局配置的 timeout
					timeout = this.getConfigOrGlobal().getTimeout();
				}
			}

			// 将这个 SaSession 入库
			this.getSaTokenDao().setSession(session, timeout);
		}
		return session;
	}

	// /**
	//  * 获取指定 key 的 SaSession, 如果该 SaSession 尚未创建，则返回 null
	//  *
	//  * @param {String} sessionId SessionId
	//  * @return {SaSession} Session对象
	//  */
	// getSessionBySessionId(sessionId) {
	// 	return getSessionBySessionId(sessionId, false, null, null);
	// }

	/**
	 * 获取指定账号 id 的 Account-Session, 如果该 SaSession 尚未创建，isCreate=是否新建并返回
	 *
	 * @param {Object} loginId 账号id
	 * @param {boolean} isCreate 是否新建
	 * @param {Long} timeout 如果这个 SaSession 是新建的，则使用此值作为过期值（单位：秒），可填 null，代表使用全局 timeout 值
	 * @return {SaSession} SaSession 对象
	 */
	getSessionByLoginId(loginId, isCreate = true, timeout = null) {
		if(SaFoxUtil.isEmpty(loginId)) {
			throw new SaTokenException("Account-Session 获取失败：loginId 不能为空");
		}
		return this.getSessionBySessionId(this.splicingKeySession(loginId), isCreate, timeout, session => {
			// 这里是该 Account-Session 首次创建时才会被执行的方法：
			// 		设定这个 SaSession 的各种基础信息：类型、账号体系、账号id
			session.setType(SaTokenConsts.SESSION_TYPE__ACCOUNT);
			session.setLoginType(this.getLoginType());
			session.setLoginId(loginId);
		});
	}

	// /**
	//  * 获取指定账号 id 的 Account-Session, 如果该 SaSession 尚未创建，isCreate=是否新建并返回
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {boolean} isCreate 是否新建
	//  * @return {SaSession} SaSession 对象
	//  */
	// getSessionByLoginId(loginId, isCreate) {
	// 	return getSessionByLoginId(loginId, isCreate, null);
	// }

	// /**
	//  * 获取指定账号 id 的 Account-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {SaSession} SaSession 对象
	//  */
	// getSessionByLoginId(loginId) {
	// 	return getSessionByLoginId(loginId, true, null);
	// }

	/**
	 * 获取当前已登录账号的 Account-Session, 如果该 SaSession 尚未创建，isCreate=是否新建并返回
	 *
	 * @param {boolean} isCreate 是否新建
	 * @return {SaSession} SaSession 对象
	 */
	getSession(isCreate = true) {
		return this.getSessionByLoginId(this.getLoginId(), isCreate);
	}

	// /**
	//  * 获取当前已登录账号的 Account-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @return {SaSession} Saession对象
	//  */
	// getSession() {
	// 	return this.getSession(true);
	// }


	// ------------------- Token-Session 相关 -------------------

	/**
	 * 获取指定 token 的 Token-Session，如果该 SaSession 尚未创建，isCreate代表是否新建并返回
	 *
	 * @param {String} tokenValue token值
	 * @param {boolean} isCreate 是否新建
	 * @return {SaSession} session对象
	 */
	getTokenSessionByToken(tokenValue, isCreate = true) {
		// 1、token 为空，不允许创建
		if(SaFoxUtil.isEmpty(tokenValue)) {
			throw new SaTokenException("Token-Session 获取失败：token 为空").setCode(SaErrorCode.CODE_11073);
		}

		// 2、如果能查询到旧记录，则直接返回
		const sessionId = this.splicingKeyTokenSession(tokenValue);
		const tokenSession = this.getSaTokenDao().getSession(sessionId);
		if(tokenSession != null) {
			return tokenSession;
		}
		// 以下是查不到的情况

		// 3、指定了不需要创建，返回 null
		if( ! isCreate) {
			return null;
		}
		// 以下是需要创建的情况

		// 4、检查一下这个 token 是否为有效 token，无效 token 不允许创建
		if(this.getConfigOrGlobal().getTokenSessionCheckLogin() && ! this.isValidToken(tokenValue)) {
			throw new SaTokenException("Token-Session 获取失败，token 无效: " + tokenValue).setCode(SaErrorCode.CODE_11074);
		}

		// 5、创建 Token-Session 并返回
		return this.getSessionBySessionId(sessionId, true, null, session => {
			// 这里是该 Token-Session 首次创建时才会被执行的方法：
			// 		设定这个 SaSession 的各种基础信息：类型、账号体系、Token 值
			session.setType(SaTokenConsts.SESSION_TYPE__TOKEN);
			session.setLoginType(this.getLoginType());
			session.setToken(tokenValue);
		});
	}

	// /**
	//  * 获取指定 token 的 Token-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @param {String} tokenValue Token值
	//  * @return {SaSession} SaSession 对象
	//  */
	// getTokenSessionByToken(tokenValue) {
	// 	return getTokenSessionByToken(tokenValue, true);
	// }

	/**
	 * 获取当前 token 的 Token-Session，如果该 SaSession 尚未创建，isCreate代表是否新建并返回
	 *
	 * @param {boolean} isCreate 是否新建
	 * @return {SaSession} Token-Session 对象
	 */
	getTokenSession(isCreate = true) {
		const tokenValue = this.getTokenValue();
		this.checkActiveTimeoutByConfig(tokenValue);
		return this.getTokenSessionByToken(tokenValue, isCreate);
	}

	// /**
	//  * 获取当前 token 的 Token-Session，如果该 SaSession 尚未创建，则新建并返回
	//  *
	//  * @return {SaSession} Session对象
	//  */
	// getTokenSession() {
	// 	return this.getTokenSession(true);
	// }

	/**
	 * 获取当前匿名 Token-Session （可在未登录情况下使用的 Token-Session）
	 *
	 * @param {boolean} isCreate 在 Token-Session 尚未创建的情况是否新建并返回
	 * @return {SaSession} Token-Session 对象
	 */
	getAnonTokenSession(isCreate = true) {
		/*
		 * 情况1、如果调用方提供了有效 Token，则：直接返回其 [Token-Session]
		 * 情况2、如果调用方提供了无效 Token，或根本没有提供 Token，则：创建新 Token => 返回 [ Token-Session ]
		 */
		let tokenValue = this.getTokenValue();

		// q1 —— 判断这个 Token 是否有效，两个条件符合其一即可：
		/*
		 * 条件1、能查出 Token-Session
		 * 条件2、能查出 LoginId
		 */
		if(SaFoxUtil.isNotEmpty(tokenValue)) {

			// 符合条件1
			const session = this.getTokenSessionByToken(tokenValue, false);
			if(session != null) {
				return session;
			}

			// 符合条件2
			const loginId = this.getLoginIdNotHandle(tokenValue);
			if(this.isValidLoginId(loginId)) {
				return this.getTokenSessionByToken(tokenValue, isCreate);
			}
		}

		// q2 —— 此时q2分两种情况：
		/*
		 * 情况 2.1、isCreate=true：说明调用方想让框架帮其创建一个 SaSession，那框架就创建并返回
		 * 情况 2.2、isCreate=false：说明调用方并不想让框架帮其创建一个 SaSession，那框架就直接返回 null
		 */
		if(isCreate) {
			// 随机创建一个 Token
			tokenValue = SaStrategy.instance.generateUniqueToken(
					"token",
					this.getConfigOfMaxTryTimes(this.createSaLoginParameter()),
					() => {
						return this.createTokenValue(null, null, this.getConfigOrGlobal().getTimeout(), null);
					},
					token => {
						return this.getTokenSessionByToken(token, false) == null;
					}
			);

			// 写入此 token 的最后活跃时间
			if(this.isOpenCheckActiveTimeout()) {
				this.setLastActiveToNow(tokenValue, null, null);
			}

			// 在当前上下文写入此 TokenValue
			this.setTokenValue(tokenValue);

			// 返回其 Token-Session 对象
			const finalTokenValue = tokenValue;
			return this.getSessionBySessionId(this.splicingKeyTokenSession(tokenValue), isCreate, this.getConfigOrGlobal().getTimeout(), session => {
				// 这里是该 Anon-Token-Session 首次创建时才会被执行的方法：
				// 		设定这个 SaSession 的各种基础信息：类型、账号体系、Token 值
				session.setType(SaTokenConsts.SESSION_TYPE__ANON);
				session.setLoginType(this.getLoginType());
				session.setToken(finalTokenValue);
			});
		}
		else {
			return null;
		}
	}

	// /**
	//  * 获取当前匿名 Token-Session （可在未登录情况下使用的Token-Session）
	//  *
	//  * @return {SaSession} Token-Session 对象
	//  */
	// getAnonTokenSession() {
	// 	return this.getAnonTokenSession(true);
	// }

	/**
	 * 删除指定 token 的 Token-Session
	 *
	 * @param {String} tokenValue token值
	 */
	deleteTokenSession(tokenValue) {
		this.getSaTokenDao().delete(this.splicingKeyTokenSession(tokenValue));
	}


	// ------------------- Active-Timeout token 最低活跃度 验证相关 -------------------

	/**
	 * 写入指定 token 的 [ 最后活跃时间 ] 为当前时间戳 √√√
	 *
	 * @param {String} tokenValue 指定token
	 * @param {Long} activeTimeout 这个 token 的最低活跃频率，单位：秒，填 null 代表使用全局配置的 activeTimeout 值
	 * @param {Long} timeout 保存数据时使用的 ttl 值，单位：秒，填 null 代表使用全局配置的 timeout 值
	 */
	setLastActiveToNow(tokenValue, activeTimeout, timeout) {

		// 如果提供的 timeout 为null，则使用全局配置的 timeout 值
		const config = this.getConfigOrGlobal();
		if(timeout == null) {
			timeout = config.getTimeout();
		}
		// activeTimeout 变量无需赋值默认值，因为当缓存中没有这个值时，会自动使用全局配置的值

		// 将此 token 的 [ 最后活跃时间 ] 标记为当前时间戳
		const key = this.splicingKeyLastActiveTime(tokenValue);
		const value = String(Date.now());
		if(config.getDynamicActiveTimeout() && activeTimeout != null) {
			value += "," + activeTimeout;
		}
		this.getSaTokenDao().set(key, value, timeout);
	}

	/**
	 * 续签指定 token：将这个 token 的 [ 最后活跃时间 ] 更新为当前时间戳
	 *
	 * @param {String} tokenValue 指定token
	 */
	updateLastActiveToNow(tokenValue = this.getTokenValue()) {
		const key = this.splicingKeyLastActiveTime(tokenValue);
		const value = new SaValue2Box(Date.now(), this.getTokenUseActiveTimeout(tokenValue)).toString();
		this.getSaTokenDao().update(key, value);
	}

	// /**
	//  * 续签当前 token：(将 [最后操作时间] 更新为当前时间戳)
	//  * <h2>
	//  * 		请注意: 即使 token 已被冻结 也可续签成功，
	//  * 		如果此场景下需要提示续签失败，可在此之前调用 checkActiveTimeout() 强制检查是否冻结即可
	//  * </h2>
	//  */
	// updateLastActiveToNow() {
	// 	updateLastActiveToNow(getTokenValue());
	// }

	/**
	 * 清除指定 Token 的 [ 最后活跃时间记录 ]
	 *
	 * @param {String} tokenValue 指定 token
	 */
	clearLastActive(tokenValue) {
		this.getSaTokenDao().delete(this.splicingKeyLastActiveTime(tokenValue));
	}

	/**
	 * 判断指定 token 是否已被冻结
	 *
	 * @param {String} tokenValue 指定 token
	 */
	isFreeze(tokenValue) {

		// 1、获取这个 token 的剩余活跃有效期
		const activeTimeout = this.getTokenActiveTimeoutByToken(tokenValue);

		// 2、值为 -1 代表此 token 已经被设置永不冻结
		if(activeTimeout == SaTokenDao.NEVER_EXPIRE) {
			return false;
		}

		// 3、值为 -2 代表已被冻结
		if(activeTimeout == SaTokenDao.NOT_VALUE_EXPIRE) {
			return true;
		}
		return false;
	}

	/**
	 * 根据全局配置决定是否校验指定 token 的活跃度
	 *
	 * @param {String} tokenValue 指定 token
	 */
	checkActiveTimeoutByConfig(tokenValue) {
		if(this.isOpenCheckActiveTimeout()) {
			// storage.get(key, () => {}) 可以避免一次请求多次校验，造成不必要的性能消耗
			SaHolder.getStorage().get(SaTokenConsts.TOKEN_ACTIVE_TIMEOUT_CHECKED_KEY, () => {

				// 1、检查此 token 的最后活跃时间是否已经超过了 active-timeout 的限制，如果是则代表其已被冻结，需要抛出：token 已被冻结
				this.checkActiveTimeout(tokenValue);

				// 2、如果配置了自动续签功能, 则: 更新这个 token 的最后活跃时间 （注意此处的续签是在续 active-timeout，而非 timeout）
				if(SaStrategy.instance.autoRenew.apply(this)) {
					this.updateLastActiveToNow(tokenValue);
				}

				return true;
			});
		}
	}

	/**
	 * 检查指定 token 是否已被冻结，如果是则抛出异常
	 *
	 * @param {String} tokenValue 指定 token
	 */
	checkActiveTimeout(tokenValue = this.getTokenValue()) {
		if (this.isFreeze(tokenValue)) {
			throw NotLoginException.newInstance(this.loginType, NotLoginException.TOKEN_FREEZE, NotLoginException.TOKEN_FREEZE_MESSAGE, tokenValue).setCode(SaErrorCode.CODE_11016);
		}
	}

	// /**
	//  * 检查当前 token 是否已被冻结，如果是则抛出异常
	//  */
	// checkActiveTimeout() {
	// 	this.checkActiveTimeout(getTokenValue());
	// }

	/**
	 * 获取指定 token 在缓存中的 activeTimeout 值，如果不存在则返回 null
	 *
	 * @param {String} tokenValue 指定token
	 * @return {Long} /
	 */
	getTokenUseActiveTimeout(tokenValue) {
		// 在未启用动态 activeTimeout 功能时，直接返回 null
		if( ! this.getConfigOrGlobal().getDynamicActiveTimeout()) {
			return null;
		}

		// 先取出这个 token 的最后活跃时间值
		const key = this.splicingKeyLastActiveTime(tokenValue);
		const value = this.getSaTokenDao().get(key);

		// 解析，无值的情况下返回 null
		const box = new SaValue2Box(value);
		return box.getValue2AsLong(null);
	}

	/**
	 * 获取指定 token 在缓存中的 activeTimeout 值，如果不存在则返回全局配置的 activeTimeout 值
	 *
	 * @param {String} tokenValue 指定token
	 * @return {Long} /
	 */
	getTokenUseActiveTimeoutOrGlobalConfig(tokenValue) {
		const activeTimeout = this.getTokenUseActiveTimeout(tokenValue);
		if(activeTimeout == null) {
			return this.getConfigOrGlobal().getActiveTimeout();
		}
		return activeTimeout;
	}

	/**
	 * 获取指定 token 的最后活跃时间（13位时间戳），如果不存在则返回 -2
	 *
	 * @param {String} tokenValue 指定token
	 * @return {Long} /
	 */
	getTokenLastActiveTime(tokenValue = this.getTokenValue()) {
		// 1、如果提供的 token 为 null，则返回 -2
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}

		// 2、获取这个 token 的最后活跃时间，13位时间戳
		const key = this.splicingKeyLastActiveTime(tokenValue);
		const lastActiveTimeString = this.getSaTokenDao().get(key);

		// 3、查不到，返回-2
		if(lastActiveTimeString == null) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}

		// 4、根据逗号切割字符串
		return new SaValue2Box(lastActiveTimeString).getValue1AsLong();
	}

	// /**
	//  * 获取当前 token 的最后活跃时间（13位时间戳），如果不存在则返回 -2
	//  *
	//  * @return {Long} /
	//  */
	// getTokenLastActiveTime() {
	// 	return this.getTokenLastActiveTime(this.getTokenValue());
	// }


	// ------------------- 过期时间相关 -------------------

	// /**
	//  * 获取当前会话 token 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	//  *
	//  * @return {Long} /token剩余有效时间
	//  */
	// getTokenTimeout() {
	// 	return this.getTokenTimeout(this.getTokenValue());
	// }

	/**
	 * 获取指定 token 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @param {String} token 指定token
	 * @return {Long} token剩余有效时间
	 */
	getTokenTimeout(token = this.getTokenValue()) {
		return this.getSaTokenDao().getTimeout(this.splicingKeyTokenValue(token));
	}

	/**
	 * 获取指定账号 id 的 token 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @param {Object} loginId 指定loginId
	 * @return {Long} token剩余有效时间
	 */
	getTokenTimeoutByLoginId(loginId) {
		return this.getSaTokenDao().getTimeout(this.splicingKeyTokenValue(this.getTokenValueByLoginId(loginId)));
	}

	/**
	 * 获取当前登录账号的 Account-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @return {Long} token剩余有效时间
	 */
	getSessionTimeout() {
		return this.getSessionTimeoutByLoginId(this.getLoginIdDefaultNull());
	}

	/**
	 * 获取指定账号 id 的 Account-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @param {Object} loginId 指定loginId
	 * @return {Long} token剩余有效时间
	 */
	getSessionTimeoutByLoginId(loginId) {
		return this.getSaTokenDao().getSessionTimeout(this.splicingKeySession(loginId));
	}

	/**
	 * 获取当前 token 的 Token-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @return {Long} token剩余有效时间
	 */
	getTokenSessionTimeout() {
		return this.getTokenSessionTimeoutByTokenValue(this.getTokenValue());
	}

	/**
	 * 获取指定 token 的 Token-Session 剩余有效时间（单位: 秒，返回 -1 代表永久有效，-2 代表没有这个值）
	 *
	 * @param {String} tokenValue 指定token
	 * @return {Long} token 剩余有效时间
	 */
	getTokenSessionTimeoutByTokenValue(tokenValue) {
		return this.getSaTokenDao().getSessionTimeout(this.splicingKeyTokenSession(tokenValue));
	}

	/**
	 * 获取当前 token 剩余活跃有效期：当前 token 距离被冻结还剩多少时间（单位: 秒，返回 -1 代表永不冻结，-2 代表没有这个值或 token 已被冻结了）
	 *
	 * @return {Long} /
	 */
	getTokenActiveTimeout() {
		return this.getTokenActiveTimeoutByToken(this.getTokenValue());
	}

	/**
	 * 获取指定 token 剩余活跃有效期：这个 token 距离被冻结还剩多少时间（单位: 秒，返回 -1 代表永不冻结，-2 代表没有这个值或 token 已被冻结了）
	 *
	 * @param {String} tokenValue 指定 token
	 * @return {Long} /
	 */
	getTokenActiveTimeoutByToken(tokenValue) {

		// 如果全局配置了永不冻结, 则返回 -1
		if( ! this.isOpenCheckActiveTimeout() ) {
			return SaTokenDao.NEVER_EXPIRE;
		}

		// ------ 开始查询

		// 先获取这个 token 的最后活跃时间，13位时间戳
		const lastActiveTime = this.getTokenLastActiveTime(tokenValue);
		if(lastActiveTime == SaTokenDao.NOT_VALUE_EXPIRE) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}

		// 实际时间差
		const timeDiff = (Date.now() - lastActiveTime) / 1000;
		// 该 token 允许的时间差
		const allowTimeDiff = this.getTokenUseActiveTimeoutOrGlobalConfig(tokenValue);
		if(allowTimeDiff == SaTokenDao.NEVER_EXPIRE) {
			// 如果允许的时间差为 -1 ，则代表永不冻结，此处需要立即返回 -1 ，无需后续计算
			return SaTokenDao.NEVER_EXPIRE;
		}

		// 校验这个时间差是否超过了允许的值
		//    计算公式为: 允许的最大时间差 - 实际时间差，判断是否 < 0， 如果是则代表已经被冻结 ，返回-2
		let activeTimeout = allowTimeDiff - timeDiff;
		if(activeTimeout < 0) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		} else {
			// 否则代表没冻结，返回剩余有效时间
			return activeTimeout;
		}
	}


	/**
	 * 对指定 token 的 timeout 值进行续期
	 *
	 * @param {String|Long} tokenOrTimeout token值或超时时间
	 * @param {Long} [timeout] 要修改成为的有效时间 (单位: 秒，填 -1 代表要续为永久有效)  
	 */
	renewTimeout(tokenOrTimeout, timeout) {
		// 情况1: renewTimeout(timeout) - 续期当前token
		if(typeof tokenOrTimeout === 'number') {
			timeout = tokenOrTimeout;
			const tokenValue = this.getTokenValue();
			
			// 1、续期缓存数据
			this._renewTimeout(tokenValue, timeout);

			// 2、续期客户端 Cookie 有效期
			if(this.getConfigOrGlobal().getIsReadCookie()) {
				// 如果 timeout = -1，代表永久，但是一般浏览器不支持永久 Cookie，所以此处设置为 int 最大值
				// 如果 timeout 大于 int 最大值，会造成数据溢出，所以也要将其设置为 int 最大值
				if(timeout == SaTokenDao.NEVER_EXPIRE || timeout > Number.MAX_SAFE_INTEGER) {
					timeout = Number.MAX_SAFE_INTEGER;
				}
				this.setTokenValueToCookie(tokenValue, timeout);
			}
			return;
		}

		// 情况2: renewTimeout(tokenValue, timeout) - 续期指定token
		const tokenValue = tokenOrTimeout;
		this._renewTimeout(tokenValue, timeout);
}

	// /**
	//  * 对当前 token 的 timeout 值进行续期
	//  *
	//  * @param {Long} timeout 要修改成为的有效时间 (单位: 秒)
	//  */
	// renewTimeout(timeout) {
	// 	// 1、续期缓存数据
	// 	const tokenValue = this.getTokenValue();
	// 	this.renewTimeout(tokenValue, timeout);

	// 	// 2、续期客户端 Cookie 有效期
	// 	if(this.getConfigOrGlobal().getIsReadCookie()) {
	// 		// 如果 timeout = -1，代表永久，但是一般浏览器不支持永久 Cookie，所以此处设置为 int 最大值
	// 		// 如果 timeout 大于 int 最大值，会造成数据溢出，所以也要将其设置为 int 最大值
	// 		if(timeout == SaTokenDao.NEVER_EXPIRE || timeout > Number.MAX_SAFE_INTEGER) {
	// 			timeout = Number.MAX_SAFE_INTEGER;
	// 		}
	// 		this.setTokenValueToCookie(tokenValue, timeout);
	// 	}
	// }

	/**
	 * 对指定 token 的 timeout 值进行续期
	 *
	 * @param {String} tokenValue 指定 token
	 * @param {Long} timeout 要修改成为的有效时间 (单位: 秒，填 -1 代表要续为永久有效)
	 */
	_renewTimeout(tokenValue, timeout) {

		// 1、如果 token 指向的 loginId 为空，或者属于异常项时，不进行续期操作
		const loginId = this.getLoginIdByToken(tokenValue);
		if(loginId == null) {
			return;
		}

		// 2、检查 token 合法性
		const session = this.getSessionByLoginId(loginId);
		if(session == null) {
			throw new SaTokenException("未能查询到对应 Access-Session 会话，无法续期");
		}
		if(session.getTerminal(tokenValue) == null) {
			throw new SaTokenException("未能查询到对应终端信息，无法续期");
		}

		// 3、续期此 token 本身的有效期 （改 ttl）
		const dao = this.getSaTokenDao();
		dao.updateTimeout(this.splicingKeyTokenValue(tokenValue), timeout);

		// 4、续期此 token 的 Token-Session 有效期
		const tokenSession = this.getTokenSessionByToken(tokenValue, false);
		if(tokenSession != null) {
			tokenSession.updateTimeout(timeout);
		}

		// 5、续期此 token 指向的账号的 Account-Session 有效期
		session.updateMinTimeout(timeout);

		// 6、更新此 token 的最后活跃时间
		if(this.isOpenCheckActiveTimeout()) {
			dao.updateTimeout(this.splicingKeyLastActiveTime(tokenValue), timeout);
		}

		// 7、$$ 发布事件：某某 token 被续期了
		SaTokenEventCenter.doRenewTimeout(this.loginType, loginId, tokenValue, timeout);
	}


	// ------------------- 角色认证操作 -------------------

	// /**
	//  * 获取：当前账号的角色集合
	//  *
	//  * @return {List<String>} /
	//  */
	// getRoleList() {
	// 	return this.getRoleList(this.getLoginId());
	// }

	/**
	 * 获取：指定账号的角色集合
	 *
	 * @param {Object} loginId 指定账号id
	 * @return {List<String>} /
	 */
	getRoleList(loginId = this.getLoginId()) {
		return SaManager.getStpInterface().getRoleList(loginId, this.loginType);
	}


	/**
	 * 判断账号是否拥有指定角色
	 * 
	 * @param {String|Object} roleOrLoginId 角色标识或账号id
	 * @param {String} [role] 角色标识(当第一个参数为账号id时使用) 
	 * @return {Boolean} 是否含有指定角色
	 */
	hasRole(roleOrLoginId, role) {
		// 情况1: hasRole(role) - 判断当前账号是否拥有角色
		if(typeof roleOrLoginId === 'string' && role === undefined) {
			try {
				return this.hasElement(this.getRoleList(this.getLoginId()), roleOrLoginId);
			} catch(e) {
				return false;
			}
		}
		
		// 情况2: hasRole(loginId, role) - 判断指定账号是否含有角色
		return this.hasElement(this.getRoleList(roleOrLoginId), role);
	}

	// /**
	//  * 判断：当前账号是否拥有指定角色, 返回 true 或 false
	//  *
	//  * @param {String} role 角色
	//  * @return {Boolean} /
	//  */
	// hasRole(role) {
	// 	try {
	// 		return this.hasRole(this.getLoginId(), role);
	// 	} catch (e) {
	// 		return false;
	// 	}
	// }

	// /**
	//  * 判断：指定账号是否含有指定角色标识, 返回 true 或 false
	//  *
	//  * @param {Object} loginId 账号id
	//  * @param {String} role 角色标识
	//  * @return {Boolean} /是否含有指定角色标识
	//  */
	// hasRole(loginId, role) {
	// 	return this.hasElement(this.getRoleList(loginId), role);
	// }

	/**
	 * 判断：当前账号是否含有指定角色标识 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 * @return {Boolean}  是否含有指定角色标识true或false
	 */
	hasRoleAnd(...roleArray){
		try {
			this.checkRoleAnd(...roleArray);
			return true;
		} catch (e) {
			if (e instanceof NotLoginException || e instanceof NotRoleException) {
                return false;
            }
            throw e;
        }
	}

	/**
	 * 判断：当前账号是否含有指定角色标识 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 * @return {Boolean} true或false
	 */
	hasRoleOr(...roleArray){
		try {
			this.checkRoleOr(...roleArray);
			return true;
		} catch (e) {
			if (e instanceof NotLoginException || e instanceof NotRoleException) {
                return false;
            }
            throw e;
		}
	}

	/**
	 * 校验：当前账号是否含有指定角色标识, 如果验证未通过，则抛出异常: NotRoleException
	 *
	 * @param {String} role 角色标识
	 */
	checkRole(role) {
		if( ! this.hasRole(this.getLoginId(), role)) {
			throw new NotRoleException(role, this.loginType).setCode(SaErrorCode.CODE_11041);
		}
	}

	/**
	 * 校验：当前账号是否含有指定角色标识 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 */
	checkRoleAnd(...roleArray){
		// 先获取当前是哪个账号id
		const loginId = this.getLoginId();

		// 如果没有指定要校验的角色，那么直接跳过
		if(roleArray == null || roleArray.length === 0) {
			return;
		}

		// 开始校验
		const roleList = this.getRoleList(loginId);
		for (const role of roleArray) {
			if(!this.hasElement(roleList, role)) {
				throw new NotRoleException(role, this.loginType).setCode(SaErrorCode.CODE_11041);
			}
		}
	}

	/**
	 * 校验：当前账号是否含有指定角色标识 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} roleArray 角色标识数组
	 */
	checkRoleOr(...roleArray){
		// 先获取当前是哪个账号id
		const loginId = this.getLoginId();

		// 如果没有指定权限，那么直接跳过
		if(roleArray == null || roleArray.length === 0) {
			return;
		}

		// 开始校验
		const roleList = this.getRoleList(loginId);
		for (const role of roleArray) {
			if(this.hasElement(roleList, role)) {
				// 有的话提前退出
				return;
			}
		}

		// 代码至此，说明一个都没通过，需要抛出无角色异常
		throw new NotRoleException(roleArray[0], this.loginType).setCode(SaErrorCode.CODE_11041);
	}


	// ------------------- 权限认证操作 -------------------

	// /**
	//  * 获取：当前账号的权限码集合
	//  *
	//  * @return {List<String>} /
	//  */
	// getPermissionList() {
	// 	return this.getPermissionList(this.getLoginId());
	// }

	/**
	 * 获取：指定账号的权限码集合
	 *
	 * @param {Object} loginId 指定账号id
	 * @return {List<String>} /
	 */
	getPermissionList(loginId = this.getLoginId()) {
		return SaManager.getStpInterface().getPermissionList(loginId, this.loginType);
	}


	/**
	 * 判断账号是否拥有指定权限
	 * 
	 * @param {String|Object} permissionOrLoginId 权限码或账号id 
	 * @param {String} [permission] 权限码(当第一个参数为账号id时使用)
	 * @return {Boolean} 是否含有指定权限
	 */
	hasPermission(permissionOrLoginId, permission) {
		// 情况1: hasPermission(permission) - 判断当前账号是否拥有权限
		if(typeof permissionOrLoginId === 'string' && permission === undefined) {
			try {
				return this.hasElement(this.getPermissionList(this.getLoginId()), permissionOrLoginId);
			} catch(e) {
				return false;
			}
		}
		
		// 情况2: hasPermission(loginId, permission) - 判断指定账号是否含有权限
		return this.hasElement(this.getPermissionList(permissionOrLoginId), permission);
	}

	// /**
	//  * 判断：当前账号是否含有指定权限, 返回 true 或 false
	//  *
	//  * @param {String} permission 权限码
	//  * @return {Boolean} 是否含有指定权限
	//  */
	// hasPermission(permission) {
	// 	try {
	// 		return this.hasPermission(this.getLoginId(), permission);
	// 	} catch (e) {
	// 		return false;
	// 	}
	// }

	// /**
	//  * 判断：指定账号 id 是否含有指定权限, 返回 true 或 false
	//  *
	//  * @param {Object} loginId 账号 id
	//  * @param {String} permission 权限码
	//  * @return {Boolean} 是否含有指定权限
	//  */
	// hasPermission(loginId, permission) {
	// 	return this.hasElement(this.getPermissionList(loginId), permission);
	// }

	/**
	 * 判断：当前账号是否含有指定权限 [ 指定多个，必须全部具有 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 * @return {Boolean} true 或 false
	 */
	hasPermissionAnd(...permissionArray){
		try {
			this.checkPermissionAnd(...permissionArray);
			return true;
		} catch (e) {
			if (e instanceof NotLoginException || e instanceof NotPermissionException) {
                return false;
            }
            throw e;
		}
	}

	/**
	 * 判断：当前账号是否含有指定权限 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 * @return {Boolean} true 或 false
	 */
	hasPermissionOr(...permissionArray){
		try {
			this.checkPermissionOr(...permissionArray);
			return true;
		} catch (e) {
			if (e instanceof NotLoginException || e instanceof NotPermissionException) {
                return false;
            }
            throw e;
		}
	}

	/**
	 * 校验：当前账号是否含有指定权限, 如果验证未通过，则抛出异常: NotPermissionException
	 *
	 * @param {String} permission 权限码
	 */
	checkPermission(permission) {
		if( ! this.hasPermission(this.getLoginId(), permission)) {
			throw new NotPermissionException(permission, this.loginType).setCode(SaErrorCode.CODE_11051);
		}
	}

	/**
	 * 校验：当前账号是否含有指定权限 [ 指定多个，必须全部验证通过 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 */
	checkPermissionAnd(...permissionArray){
		// 先获取当前是哪个账号id
		const loginId = this.getLoginId();

		// 如果没有指定权限，那么直接跳过
		if(permissionArray == null || permissionArray.length === 0) {
			return;
		}

		// 开始校验
		const permissionList = this.getPermissionList(loginId);
		for (const permission of permissionArray) {
			if(!this.hasElement(permissionList, permission)) {
				throw new NotPermissionException(permission, this.loginType).setCode(SaErrorCode.CODE_11051);
			}
		}
	}

	/**
	 * 校验：当前账号是否含有指定权限 [ 指定多个，只要其一验证通过即可 ]
	 *
	 * @param {String...} permissionArray 权限码数组
	 */
	checkPermissionOr(...permissionArray){
		// 先获取当前是哪个账号id
		const loginId = this.getLoginId();

		// 如果没有指定要校验的权限，那么直接跳过
		if(permissionArray == null || permissionArray.length === 0) {
			return;
		}

		// 开始校验
		const permissionList = this.getPermissionList(loginId);
		for (const permission of permissionArray) {
			if(this.hasElement(permissionList, permission)) {
				// 有的话提前退出
				return;
			}
		}

		// 代码至此，说明一个都没通过，需要抛出无权限异常
		throw new NotPermissionException(permissionArray[0], this.loginType).setCode(SaErrorCode.CODE_11051);
	}



	// ------------------- id 反查 token 相关操作 -------------------

	// /**
	//  * 获取指定账号 id 的 token
	//  * <p>
	//  * 		在配置为允许并发登录时，此方法只会返回队列的最后一个 token，
	//  * 		如果你需要返回此账号 id 的所有 token，请调用 getTokenValueListByLoginId
	//  * </p>
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {String} token值
	//  */
	// getTokenValueByLoginId(loginId) {
	// 	return this.getTokenValueByLoginId(loginId, null);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的 token
	 * <p>
	 * 		在配置为允许并发登录时，此方法只会返回队列的最后一个 token，
	 * 		如果你需要返回此账号 id 的所有 token，请调用 getTokenValueListByLoginId
	 * </p>
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {String} token值
	 */
	getTokenValueByLoginId(loginId, deviceType = null) {
		const tokenValueList = this.getTokenValueListByLoginId(loginId, deviceType);
		return tokenValueList.length > 0 ? tokenValueList[tokenValueList.length - 1] : null;
	}

	// /**
	//  * 获取指定账号 id 的 token 集合
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {List<String>} 此 loginId 的所有相关 token
	//  */
	// getTokenValueListByLoginId(loginId) {
	// 	return this.getTokenValueListByLoginId(loginId, null);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的 token 集合
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {List<String>} 此 loginId 的所有登录 token
	 */
	getTokenValueListByLoginId(loginId, deviceType = null) {
		// 如果该账号的 Account-Session 为 null，说明此账号尚没有客户端在登录，此时返回空集合
		const session = this.getSessionByLoginId(loginId, false);
		if(session == null) {
			return [];
		}

		// 按照设备类型进行筛选
		return session.getTokenValueListByDeviceType(deviceType);
	}

	// /**
	//  * 获取指定账号 id 已登录设备信息集合
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {List<SaTerminalInfo>} 此 loginId 的所有登录 token
	//  */
	// getTerminalListByLoginId(loginId) {
	// 	return this.getTerminalListByLoginId(loginId, null);
	// }

	/**
	 * 获取指定账号 id 指定设备类型端的已登录设备信息集合
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} deviceType 设备类型，填 null 代表不限设备类型
	 * @return {List<SaTerminalInfo>} 此 loginId 的所有登录 token
	 */
	getTerminalListByLoginId(loginId, deviceType = null) {
		// 如果该账号的 Account-Session 为 null，说明此账号尚没有客户端在登录，此时返回空集合
		const session = this.getSessionByLoginId(loginId, false);
		if(session == null) {
			return [];
		}

		// 按照设备类型进行筛选
		return session.getTerminalListByDeviceType(deviceType);
	}

	/**
	 * 获取指定账号 id 已登录设备信息集合，执行特定函数
	 *
	 * @param {Object} loginId 账号id
	 * @param {SaTwoParamFunction<SaSession, SaTerminalInfo>} function 需要执行的函数
	 */
	forEachTerminalList(loginId, func) {
		// 如果该账号的 Account-Session 为 null，说明此账号尚没有客户端在登录，此时无需遍历
		const session = this.getSessionByLoginId(loginId, false);
		if(session == null) {
			return;
		}

		// 遍历
		session.forEachTerminalList(func);
	}

	/**
	 * 返回当前 token 指向的 SaTerminalInfo 设备信息，如果 token 无效则返回 null
	 *
	 * @return {SaTerminalInfo} /
	 */
	getTerminalInfo() {
		return this.getTerminalInfoByToken(this.getTokenValue());
	}

	/**
	 * 返回指定 token 指向的 SaTerminalInfo 设备信息，如果 Token 无效则返回 null
	 *
	 * @param {String} tokenValue 指定 token
	 * @return {SaTerminalInfo} /
	 */
	getTerminalInfoByToken(tokenValue) {
		// 1、如果 token 为 null，直接提前返回
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return null;
		}

		// 2、判断 Token 是否有效
		const loginId = this.getLoginIdNotHandle(tokenValue);
		if( ! this.isValidLoginId(loginId)) {
			return null;
		}

		// 3、判断 Account-Session 是否存在
		const session = this.getSessionByLoginId(loginId, false);
		if(session == null) {
			return null;
		}

		// 4、判断 Token 是否已被冻结
		if(this.isFreeze(tokenValue)) {
			return null;
		}

		// 5、遍历 Account-Session 上的客户端 token 列表，寻找当前 token 对应的设备类型
		const terminalList = session.terminalListCopy();
		for (const terminal of terminalList) {
			if(terminal.getTokenValue()===tokenValue) {
				return terminal;
			}
		}

		// 6、没有找到，还是返回 null
		return null;
	}

	/**
	 * 返回当前会话的登录设备类型
	 *
	 * @return {String} 当前令牌的登录设备类型
	 */
	getLoginDeviceType() {
		return this.getLoginDeviceTypeByToken(this.getTokenValue());
	}

	/**
	 * 返回指定 token 会话的登录设备类型
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} 当前令牌的登录设备类型
	 */
	getLoginDeviceTypeByToken(tokenValue) {
		const terminalInfo = this.getTerminalInfoByToken(tokenValue);
		return terminalInfo == null ? null : terminalInfo.getDeviceType();
	}

	/**
	 * 返回当前会话的登录设备 ID
	 *
	 * @return {String}  /
	 */
	getLoginDeviceId() {
		return this.getLoginDeviceIdByToken(this.getTokenValue());
	}

	/**
	 * 返回指定 token 会话的登录设备 ID
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} /
	 */
	getLoginDeviceIdByToken(tokenValue) {
		const terminalInfo = this.getTerminalInfoByToken(tokenValue);
		return terminalInfo == null ? null : terminalInfo.getDeviceId();
	}

	/**
	 * 判断对于指定 loginId 来讲，指定设备 id 是否为可信任设备
     * 
	 * @param {Object} userId  /
	 * @param {String} deviceId /
	 * @return {boolean} /
	 */
	isTrustDeviceId(userId, deviceId) {
		// 先查询此账号的 Account-Session，如果连 Account-Session 都没有，那么此账号尚未登录，直接返回 false
		const session = this.getSessionByLoginId(userId, false);
		if(session == null) {
			return false;
		}

		// 判断
		return session.isTrustDeviceId(deviceId);
	}


	// ------------------- 会话管理 -------------------

	/**
	 * 根据条件查询缓存中所有的 token
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量 (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return token集合
	 */
	searchTokenValue(keyword, start, size, sortType) {
		return this.getSaTokenDao().searchData(this.splicingKeyTokenValue(""), (keyword == null ? "" : keyword), start, size, sortType);
	}

	/**
	 * 根据条件查询缓存中所有的 SessionId
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量  (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return {List<String} sessionId集合
	 */
	searchSessionId(keyword, start, size, sortType) {
		return this.getSaTokenDao().searchData(this.splicingKeySession(""), (keyword == null ? "" : keyword), start, size, sortType);
	}

	/**
	 * 根据条件查询缓存中所有的 Token-Session-Id
	 *
	 * @param {String} keyword 关键字
	 * @param {int} start 开始处索引
	 * @param {int} size 获取数量 (-1代表一直获取到末尾)
	 * @param {boolean} sortType 排序类型（true=正序，false=反序）
	 *
	 * @return {List<String} sessionId集合
	 */
	searchTokenSessionId(keyword, start, size, sortType) {
		return this.getSaTokenDao().searchData(this.splicingKeyTokenSession(""), (keyword == null ? "" : keyword), start, size, sortType);
	}


	// ------------------- 账号封禁 -------------------
	// ------------------- 分类封禁 -------------------
	// /**
	//  * 封禁：指定账号
	//  * <p> 此方法不会直接将此账号id踢下线，如需封禁后立即掉线，请追加调用 StpUtil.logout(id)
	//  *
	//  * @param {Object} loginId  账号id指定账号id
	//  * @param {long | String} timeOrService 封禁时间, 单位: 秒 （-1=永久封禁）|指定服务
	//  */
	// disable(loginId, timeOrService, time) {
	// 	if(arguments.length === 2) {
	// 		this.disableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.DEFAULT_DISABLE_LEVEL, timeOrService);
	// 	}else{
	// 		this.disableLevel(loginId, timeOrService, SaTokenConsts.DEFAULT_DISABLE_LEVEL, time);
	// 	}
	// 	//this.disableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.DEFAULT_DISABLE_LEVEL, time);
	// }
		
	/**
	 * 封禁：指定账号的指定服务
	 * <p> 此方法不会直接将此账号id踢下线，如需封禁后立即掉线，请追加调用 StpUtil.logout(id)
	 *
	 * @param {Object} loginId 指定账号id
	 * @param {String} service 指定服务
	 * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	 */
	disable(loginId, service, time) {
		if(arguments.length === 2) {
			//第二个参数作为time传递
			time = service;  
			this.disableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.DEFAULT_DISABLE_LEVEL, time);
		} else {
			this.disableLevel(loginId, service, SaTokenConsts.DEFAULT_DISABLE_LEVEL, time);
		}
		
	}

	// /**
	//  * 判断：指定账号是否已被封禁 (true=已被封禁, false=未被封禁)
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {boolean} /
	//  */
	// isDisable(loginId) {
	// 	return this.isDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.MIN_DISABLE_LEVEL);
	// }

	/**
	 * 判断：指定账号的指定服务 是否已被封禁（true=已被封禁, false=未被封禁）
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} service 指定服务 可不指定
	 * @return {boolean} /
	 */
	isDisable(loginId, service = SaTokenConsts.DEFAULT_DISABLE_SERVICE) {
		return this.isDisableLevel(loginId, service, SaTokenConsts.MIN_DISABLE_LEVEL);
	}



	// /**
	//  * 校验：指定账号是否已被封禁，如果被封禁则抛出异常
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// checkDisable(loginId) {
	// 	this.checkDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.MIN_DISABLE_LEVEL);
	// }


	/**
	 * 校验：指定账号 指定服务 是否已被封禁，如果被封禁则抛出异常
	 *
	 * @param {Object} loginId 账号id
	 * @param {String...} services 指定服务，可以指定多个
	 */
	checkDisable(loginId, ...services) {
		if(arguments.length === 1) {
			this.checkDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, SaTokenConsts.MIN_DISABLE_LEVEL);
		} else {
			if(services != null) {
				for (const service of services) {
					this.checkDisableLevel(loginId, service, SaTokenConsts.MIN_DISABLE_LEVEL);
				}
			}
		}
	}

	// /**
	//  * 获取：指定账号剩余封禁时间，单位：秒（-1=永久封禁，-2=未被封禁）
	//  *
	//  * @param {Object} loginId 账号id
	//  * @return {long} /
	//  */
	// getDisableTime(loginId) {
	// 	return this.getDisableTime(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE);
	// }

	/**
	 * 获取：指定账号 指定服务 剩余封禁时间，单位：秒（-1=永久封禁，-2=未被封禁）
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} service 指定服务
	 * @return {long} see note
	 */
	getDisableTime(loginId, service = SaTokenConsts.DEFAULT_DISABLE_SERVICE) {
		return this.getSaTokenDao().getTimeout(this.splicingKeyDisable(loginId, service));
	}

	// /**
	//  * 解封：指定账号
	//  *
	//  * @param {Object} loginId 账号id
	//  */
	// untieDisable(loginId) {
	// 	this.untieDisable(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE);
	// }

	

	/**
	 * 解封：指定账号、指定服务
	 *
	 * @param {Object} loginId 账号id
	 * @param {String...} services 指定服务，可以指定多个
	 */
	untieDisable(loginId, ...services) {

		// 先检查提供的参数是否有效
		if(SaFoxUtil.isEmpty(loginId)) {
			throw new SaTokenException("请提供要解禁的账号").setCode(SaErrorCode.CODE_11062);
		}

		// 如果没有传入 services,则解封默认服务
		if(services.length === 0) {
			services = [SaTokenConsts.DEFAULT_DISABLE_SERVICE];
		}

		if(services == null || services.length == 0) {
			throw new SaTokenException("请提供要解禁的服务").setCode(SaErrorCode.CODE_11063);
		}

		// 遍历逐个解禁
		for (const service of services) {
			// 解封
			this.getSaTokenDao().delete(this.splicingKeyDisable(loginId, service));

			// $$ 发布事件
			SaTokenEventCenter.doUntieDisable(this.loginType, loginId, service);
		}
	}


	// ------------------- 阶梯封禁 -------------------


	/**
	 * 封禁账号并指定封禁等级 - 支持多种参数模式
	 *
	 * @param {Object} loginId 指定账号id  
	 * @param {String|Number} serviceOrLevel 指定服务名称或封禁等级
	 * @param {Number} levelOrTime 指定封禁等级或封禁时间
	 * @param {Number} [time] 封禁时间(单位：秒,-1=永久封禁)
	 */
	disableLevel(loginId, serviceOrLevel, levelOrTime, time) {
		// 情况1: disableLevel(loginId, level, time)  
		if(typeof serviceOrLevel === 'number') {
			this.disableLevel(
				loginId,
				SaTokenConsts.DEFAULT_DISABLE_SERVICE, 
				serviceOrLevel,
				levelOrTime
			);
			return;
		}

		// 情况2: disableLevel(loginId, service, level, time)
		// 参数检查
		if(SaFoxUtil.isEmpty(loginId)) {
			throw new SaTokenException("请提供要封禁的账号")
				.setCode(SaErrorCode.CODE_11062);
		}
		if(SaFoxUtil.isEmpty(serviceOrLevel)) {
			throw new SaTokenException("请提供要封禁的服务")
				.setCode(SaErrorCode.CODE_11063); 
		}
		if(levelOrTime < SaTokenConsts.MIN_DISABLE_LEVEL && levelOrTime != 0) {
			throw new SaTokenException(
				"封禁等级不可以小于最小值：" + SaTokenConsts.MIN_DISABLE_LEVEL + " (0除外)"
			).setCode(SaErrorCode.CODE_11064);
		}

		// 打上封禁标记
		this.getSaTokenDao().set(
			this.splicingKeyDisable(loginId, serviceOrLevel),
			String(levelOrTime),
			time
		);

		// 发布事件
		SaTokenEventCenter.doDisable(
			this.loginType,
			loginId, 
			serviceOrLevel,
			levelOrTime,
			time
		);
	}

	// /**
	//  * 封禁：指定账号，并指定封禁等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 指定封禁等级
	//  * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	//  */
	// disableLevel(loginId, level, time) {
	// 	disableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, level, time);
	// }

	// /**
	//  * 封禁：指定账号的指定服务，并指定封禁等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 指定封禁等级
	//  * @param {long} time 封禁时间, 单位: 秒 （-1=永久封禁）
	//  */
	// disableLevel(loginId, service, level, time) {
	// 	// 先检查提供的参数是否有效
	// 	if(SaFoxUtil.isEmpty(loginId)) {
	// 		throw new SaTokenException("请提供要封禁的账号").setCode(SaErrorCode.CODE_11062);
	// 	}
	// 	if(SaFoxUtil.isEmpty(service)) {
	// 		throw new SaTokenException("请提供要封禁的服务").setCode(SaErrorCode.CODE_11063);
	// 	}
	// 	if(level < SaTokenConsts.MIN_DISABLE_LEVEL && level != 0) {
	// 		throw new SaTokenException("封禁等级不可以小于最小值：" + SaTokenConsts.MIN_DISABLE_LEVEL + " (0除外)").setCode(SaErrorCode.CODE_11064);
	// 	}

	// 	// 打上封禁标记
	// 	getSaTokenDao().set(splicingKeyDisable(loginId, service), String.valueOf(level), time);

	// 	// $$ 发布事件
	// 	SaTokenEventCenter.doDisable(this.loginType, loginId, service, level, time);
	// }


	/**
	 * 判断账号是否已被封禁到指定等级
	 * 
	 * @param {Object} loginId 指定账号id
	 * @param {String|Number} serviceOrLevel 指定服务或封禁等级
	 * @param {Number} [level] 指定封禁等级(当第一个参数为服务时使用)
	 * @return {boolean} 是否已被封禁到指定等级
	 */
	isDisableLevel(loginId, serviceOrLevel, level) {
		// 情况1: isDisableLevel(loginId, level) - 使用默认服务
		if(typeof serviceOrLevel === 'number') {
			return this.isDisableLevel(
				loginId, 
				SaTokenConsts.DEFAULT_DISABLE_SERVICE, 
				serviceOrLevel
			);
		}

		// 情况2: isDisableLevel(loginId, service, level) - 指定服务和等级
		// 1、先前置检查一下这个账号是否被封禁了
		const disableLevel = this.getDisableLevel(loginId, serviceOrLevel);
		if(disableLevel == SaTokenConsts.NOT_DISABLE_LEVEL) {
			return false; 
		}

		// 2、再判断被封禁的等级是否达到了指定级别
		return disableLevel >= level;
	}
	// /**
	//  * 判断：指定账号是否已被封禁到指定等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 指定封禁等级
	//  * @return {boolean} /
	//  */
	// isDisableLevel(loginId, level) {
	// 	return isDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, level);
	// }

	// /**
	//  * 判断：指定账号的指定服务，是否已被封禁到指定等级
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 指定封禁等级
	//  * @return {boolean} /
	//  */
	// isDisableLevel(loginId, service, level) {
	// 	// 1、先前置检查一下这个账号是否被封禁了
	// 	const disableLevel = getDisableLevel(loginId, service);
	// 	if(disableLevel == SaTokenConsts.NOT_DISABLE_LEVEL) {
	// 		return false;
	// 	}

	// 	// 2、再判断被封禁的等级是否达到了指定级别
	// 	return disableLevel >= level;
	// }



	/**
	 * 校验账号是否已被封禁到指定等级 - 支持多种参数模式
	 * 
	 * @param {Object} loginId 指定账号id
	 * @param {String|Number} serviceOrLevel 指定服务或封禁等级 
	 * @param {Number} [level] 封禁等级(当第一个参数为服务时使用)
	 * @throws {DisableServiceException} 如果已被封禁则抛出异常
	 */
	checkDisableLevel(loginId, serviceOrLevel, level) {
		// 情况1: checkDisableLevel(loginId, level)
		if(typeof serviceOrLevel === 'number') {
			this.checkDisableLevel(
				loginId,
				SaTokenConsts.DEFAULT_DISABLE_SERVICE, 
				serviceOrLevel
			);
			return;
		}

		// 情况2: checkDisableLevel(loginId, service, level)
		// 1、先前置检查一下这个账号是否被封禁了
		const disableLevel = this.getDisableLevel(loginId, serviceOrLevel);
		if(disableLevel === SaTokenConsts.NOT_DISABLE_LEVEL) {
			return;
		}

		// 2、再判断被封禁的等级是否达到了指定级别
		if(disableLevel >= level) {
			throw new DisableServiceException(
				this.loginType,
				loginId, 
				serviceOrLevel,
				disableLevel,
				level,
				this.getDisableTime(loginId, serviceOrLevel)
			).setCode(SaErrorCode.CODE_11061);
		}
	}

	// /**
	//  * 校验：指定账号是否已被封禁到指定等级（如果已经达到，则抛出异常）
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {int} level 封禁等级 （只有 封禁等级 ≥ 此值 才会抛出异常）
	//  */
	// checkDisableLevel(loginId, level) {
	// 	checkDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE, level);
	// }

	// /**
	//  * 校验：指定账号的指定服务，是否已被封禁到指定等级（如果已经达到，则抛出异常）
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @param {String} service 指定封禁服务
	//  * @param {int} level 封禁等级 （只有 封禁等级 ≥ 此值 才会抛出异常）
	//  */
	// checkDisableLevel(loginId, service, level) {
	// 	// 1、先前置检查一下这个账号是否被封禁了
	// 	const disableLevel = getDisableLevel(loginId, service);
	// 	if(disableLevel == SaTokenConsts.NOT_DISABLE_LEVEL) {
	// 		return;
	// 	}

	// 	// 2、再判断被封禁的等级是否达到了指定级别
	// 	if(disableLevel >= level) {
	// 		throw new DisableServiceException(this.loginType, loginId, service, disableLevel, level, getDisableTime(loginId, service))
	// 				.setCode(SaErrorCode.CODE_11061);
	// 	}
	// }

	// /**
	//  * 获取：指定账号被封禁的等级，如果未被封禁则返回-2
	//  *
	//  * @param {Object} loginId 指定账号id
	//  * @return {int} /
	//  */
	// getDisableLevel(loginId) {
	// 	return getDisableLevel(loginId, SaTokenConsts.DEFAULT_DISABLE_SERVICE);
	// }

	/**
	 * 获取：指定账号的 指定服务 被封禁的等级，如果未被封禁则返回-2
	 *
	 * @param {Object} loginId 指定账号id
	 * @param {String} service 指定封禁服务
	 * @return {int} /
	 */
	getDisableLevel(loginId, service = SaTokenConsts.DEFAULT_DISABLE_SERVICE) {
		// 1、先从缓存中查询数据，缓存中有值，以缓存值优先
		const value = this.getSaTokenDao().get(this.splicingKeyDisable(loginId, service));
		if(SaFoxUtil.isNotEmpty(value)) {
			return SaFoxUtil.getValueByType(value, Number);
		}

		// 2、如果缓存中无数据，则从"数据加载器"中再次查询
		const disableWrapperInfo = SaManager.getStpInterface().isDisabled(loginId, service);

		// 如果返回值 disableTime 有效，则代表返回结果需要写入缓存
		if(disableWrapperInfo.disableTime == SaTokenDao.NEVER_EXPIRE || disableWrapperInfo.disableTime > 0) {
			this.disableLevel(loginId, service, disableWrapperInfo.disableLevel, disableWrapperInfo.disableTime);
		}

		// 返回查询结果
		return disableWrapperInfo.disableLevel;
	}


	// ------------------- 临时身份切换 -------------------

	/**
	 * 临时切换身份为指定账号id
	 *
	 * @param {Object} loginId 指定loginId
	 */
	switchTo(loginId) {
		SaHolder.getStorage().set(this.splicingKeySwitch(), loginId);
	}

	/**
	 * 结束临时切换身份
	 */
	endSwitch() {
		SaHolder.getStorage().delete(this.splicingKeySwitch());
	}

	/**
	 * 判断当前请求是否正处于 [ 身份临时切换 ] 中
	 *
	 * @return {boolean} /
	 */
	isSwitch() {
		return SaHolder.getStorage().get(this.splicingKeySwitch()) != null;
	}

	/**
	 * 返回 [ 身份临时切换 ] 的 loginId
	 *
	 * @return {Object} /
	 */
	getSwitchLoginId() {
		return SaHolder.getStorage().get(this.splicingKeySwitch());
	}

	/**
	 * 在一个 lambda 代码段里，临时切换身份为指定账号id，lambda 结束后自动恢复
	 *
	 * @param {Object} loginId 指定账号id
	 * @param {SaFunction} function 要执行的方法
	 */
	switchTo(loginId, func) {
		try {
			SaHolder.getStorage().set(this.splicingKeySwitch(), loginId);
			if(func) {
				func();
			}
		} finally {
			this.endSwitch();
		}
	}


	// ------------------- 二级认证 -------------------


	/**
	 * 在当前会话开启二级认证 - 支持多种参数模式
	 * 
	 * @param {String|Number} serviceOrSafeTime 业务标识或维持时间(单位:秒)
	 * @param {Number} [safeTime] 维持时间(单位:秒,当第一个参数为业务标识时使用)
	 */
	openSafe(serviceOrSafeTime, safeTime) {
		// 1、开启二级认证前必须处于登录状态，否则抛出异常  
		this.checkLogin();

		// 2、获取 token 值，如果不存在则抛出异常
		const tokenValue = this.getTokenValueNotNull();

		// 3、判断参数模式
		let service, timeout;
		
		// 情况1: openSafe(safeTime) - 使用默认业务标识
		if(typeof serviceOrSafeTime === 'number') {
			service = SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE;
			timeout = serviceOrSafeTime;
		}
		// 情况2: openSafe(service, safeTime) - 指定业务标识
		else {
			service = serviceOrSafeTime; 
			timeout = safeTime;
		}

		// 4、写入指定标记，打开二级认证
		this.getSaTokenDao().set(
			this.splicingKeySafe(tokenValue, service),
			SaTokenConsts.SAFE_AUTH_SAVE_VALUE,
			timeout
		);

		// 5、发布事件
		SaTokenEventCenter.doOpenSafe(
			this.loginType,
			tokenValue,
			service,
			timeout
		);
	}

	// /**
	//  * 在当前会话 开启二级认证
	//  *
	//  * @param {long} safeTime 维持时间 (单位: 秒)
	//  */
	// openSafe(safeTime) {
	// 	this.openSafe(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE, safeTime);
	// }

	// /**
	//  * 在当前会话 开启二级认证
	//  *
	//  * @param {String} service 业务标识
	//  * @param {long} safeTime 维持时间 (单位: 秒)
	//  */
	// openSafe(service, safeTime) {
	// 	// 1、开启二级认证前必须处于登录状态，否则抛出异常
	// 	checkLogin();

	// 	// 2、写入指定的 可以 标记，打开二级认证
	// 	const tokenValue = getTokenValueNotNull();
	// 	getSaTokenDao().set(splicingKeySafe(tokenValue, service), SaTokenConsts.SAFE_AUTH_SAVE_VALUE, safeTime);

	// 	// 3、$$ 发布事件，某某 token 令牌开启了二级认证
	// 	SaTokenEventCenter.doOpenSafe(this.loginType, tokenValue, service, safeTime);
	// }


	/**
	 * 判断当前会话是否处于二级认证时间内 - 支持多种参数模式
	 * 
	 * @param {String} [serviceOrTokenValue] 业务标识
	 * @param {String} [service] Token值(当传入service时可用)
	 * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	 */
	isSafe(serviceOrTokenValue, service) {
		// 情况1: isSafe() - 判断当前会话默认业务
		if(arguments.length === 0) {
			return this.isSafe(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE);
		}

		// 情况2: isSafe(service) - 判断当前会话指定业务
		if(arguments.length === 1) {
			return this.isSafe(this.getTokenValue(), serviceOrTokenValue);
		}

		// 情况3: isSafe(service, tokenValue) - 判断指定token的指定业务
		// 1、如果提供的 Token 为空，则直接视为未认证
		if(SaFoxUtil.isEmpty(serviceOrTokenValue)) {
			return false;
		}

		// 2、如果此 token 不处于登录状态，也将其视为未认证
		const loginId = this.getLoginIdNotHandle(serviceOrTokenValue);
		if(!this.isValidLoginId(loginId)) {
			return false;
		}

		// 3、如果缓存中可以查询出指定的键值，则代表已认证，否则视为未认证
		const value = this.getSaTokenDao().get(this.splicingKeySafe(serviceOrTokenValue, service));
		return !SaFoxUtil.isEmpty(value);
	}

	// /**
	//  * 判断：当前会话是否处于二级认证时间内
	//  *
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// isSafe() {
	// 	return isSafe(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE);
	// }

	// /**
	//  * 判断：当前会话 是否处于指定业务的二级认证时间内
	//  *
	//  * @param {String} service 业务标识
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// isSafe(service) {
	// 	return isSafe(getTokenValue(), service);
	// }

	// /**
	//  * 判断：指定 token 是否处于二级认证时间内
	//  *
	//  * @param {String} tokenValue Token 值
	//  * @param {String} service 业务标识
	//  * @return {boolean} true=二级认证已通过, false=尚未进行二级认证或认证已超时
	//  */
	// isSafe(tokenValue, service) {
	// 	// 1、如果提供的 Token 为空，则直接视为未认证
	// 	if(SaFoxUtil.isEmpty(tokenValue)) {
	// 		return false;
	// 	}

	// 	// 2、如果此 token 不处于登录状态，也将其视为未认证
	// 	const loginId = getLoginIdNotHandle(tokenValue);
	// 	if( ! isValidLoginId(loginId) ) {
	// 		return false;
	// 	}

	// 	// 3、如果缓存中可以查询出指定的键值，则代表已认证，否则视为未认证
	// 	const value = getSaTokenDao().get(splicingKeySafe(tokenValue, service));
	// 	return !(SaFoxUtil.isEmpty(value));
	// }



	
	// /**
	//  * 校验：当前会话是否已通过二级认证，如未通过则抛出异常
	//  */
	// checkSafe() {
	// 	checkSafe(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE);
	// }

	/**
	 * 校验：检查当前会话是否已通过指定业务的二级认证，如未通过则抛出异常
	 *
	 * @param {String} service 业务标识
	 */
	checkSafe(service = SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE) {
		// 1、必须先通过登录校验
		this.checkLogin();

		// 2、再进行二级认证校验
		// 		如果缓存中可以查询出指定的键值，则代表已认证，否则视为未认证
		const tokenValue = this.getTokenValue();
		const value = this.getSaTokenDao().get(this.splicingKeySafe(tokenValue, service));
		if(SaFoxUtil.isEmpty(value)) {
			throw new NotSafeException(this.loginType, tokenValue, service).setCode(SaErrorCode.CODE_11071);
		}
	}

	// /**
	//  * 获取：当前会话的二级认证剩余有效时间（单位: 秒, 返回-2代表尚未通过二级认证）
	//  *
	//  * @return {long} 剩余有效时间
	//  */
	// getSafeTime() {
	// 	return getSafeTime(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE);
	// }

	/**
	 * 获取：当前会话的二级认证剩余有效时间（单位: 秒, 返回-2代表尚未通过二级认证）
	 *
	 * @param {String} service 业务标识
	 * @return {long} 剩余有效时间
	 */
	getSafeTime(service = SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE) {
		// 1、如果前端没有提交 Token，则直接视为未认证
		const tokenValue = this.getTokenValue();
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return SaTokenDao.NOT_VALUE_EXPIRE;
		}

		// 2、从缓存中查询这个 key 的剩余有效期
		return this.getSaTokenDao().getTimeout(this.splicingKeySafe(tokenValue, service));
	}

	// /**
	//  * 在当前会话 结束二级认证
	//  */
	// closeSafe() {
	// 	closeSafe(SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE);
	// }

	/**
	 * 在当前会话 结束指定业务标识的二级认证
	 *
	 * @param {String} service 业务标识
	 */
	closeSafe(service = SaTokenConsts.DEFAULT_SAFE_AUTH_SERVICE) {
		// 1、如果前端没有提交 Token，则无需任何操作
		const tokenValue = this.getTokenValue();
		if(SaFoxUtil.isEmpty(tokenValue)) {
			return;
		}

		// 2、删除 key
		this.getSaTokenDao().delete(this.splicingKeySafe(tokenValue, service));

		// 3、$$ 发布事件，某某 token 令牌关闭了二级认证
		SaTokenEventCenter.doCloseSafe(this.loginType, tokenValue, service);
	}


	// ------------------- 拼接相应key -------------------

	/**
	 * 获取：客户端 tokenName
	 *
	 * @return {String} key
	 */
	splicingKeyTokenName() {
		return this.getConfigOrGlobal().getTokenName();
	}

	/**
	 * 拼接： 在保存 token - id 映射关系时，应该使用的key
	 *
	 * @param {String} tokenValue token值
	 * @return {String} key
	 */
	splicingKeyTokenValue(tokenValue) {
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":token:" + tokenValue;
	}

	/**
	 * 拼接： 在保存 Account-Session 时，应该使用的 key
	 *
	 * @param {Object} loginId 账号id
	 * @return {String} key
	 */
	splicingKeySession(loginId) {
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":session:" + loginId;
	}

	/**
	 * 拼接：在保存 Token-Session 时，应该使用的 key
	 *
	 * @param {String} tokenValue token值
	 * @return {String} key
	 */
	splicingKeyTokenSession(tokenValue) {
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":token-session:" + tokenValue;
	}

	/**
	 * 拼接： 在保存 token 最后活跃时间时，应该使用的 key
	 *
	 * @param {String} tokenValue token值
	 * @return {String} key
	 */
	splicingKeyLastActiveTime(tokenValue) {
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":last-active:" + tokenValue;
	}

	/**
	 * 拼接：在进行临时身份切换时，应该使用的 key
	 *
	 * @return {String} key
	 */
	splicingKeySwitch() {
		return SaTokenConsts.SWITCH_TO_SAVE_KEY + this.loginType;
	}

	/**
	 * 如果 token 为本次请求新创建的，则以此字符串为 key 存储在当前 request 中
	 *
	 * @return {String} key
	 */
	splicingKeyJustCreatedSave() {
		//		return SaTokenConsts.JUST_CREATED_SAVE_KEY + loginType;
		return SaTokenConsts.JUST_CREATED;
	}

	/**
	 * 拼接： 在保存服务封禁标记时，应该使用的 key
	 *
	 * @param {Object} loginId 账号id
	 * @param {String} service 具体封禁的服务
	 * @return {String} key
	 */
	splicingKeyDisable(loginId, service) {
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":disable:" + service + ":" + loginId;
	}

	/**
	 * 拼接： 在保存业务二级认证标记时，应该使用的 key
	 *
	 * @param {String} tokenValue 要认证的 Token
	 * @param {String} service 要认证的业务标识
	 * @return {String} key
	 */
	splicingKeySafe(tokenValue, service) {
		// 格式：<Token名称>:<账号类型>:<safe>:<业务标识>:<Token值>
		// 形如：satoken:login:safe:important:gr_SwoIN0MC1ewxHX_vfCW3BothWDZMMtx__
		return this.getConfigOrGlobal().getTokenName() + ":" + this.loginType + ":safe:" + service + ":" + tokenValue;
	}


	// ------------------- Bean 对象、字段代理 -------------------

	/**
	 * 返回当前 StpLogic 使用的持久化对象
	 *
	 * @return {SaTokenDao} /
	 */
	getSaTokenDao() {
		return SaManager.getSaTokenDao();
	}

	/**
	 * 返回当前 StpLogic 是否支持共享 token 策略
	 *
	 * @return {boolean} /
	 */
	isSupportShareToken() {
		return this.getConfigOrGlobal().getIsShare();
	}

	/**
	 * 返回全局配置是否开启了 Token 活跃度校验，返回 true 代表已打开，返回 false 代表不打开，此时永不冻结 token
	 *
	 * @return {boolean} /
	 */
	isOpenCheckActiveTimeout() {
		const cfg = this.getConfigOrGlobal();
		return cfg.getActiveTimeout() != SaTokenDao.NEVER_EXPIRE || cfg.getDynamicActiveTimeout();
	}

	/**
	 * 返回全局配置的 Cookie 保存时长，单位：秒 （根据全局 timeout 计算）
	 *
	 * @return {int} Cookie 应该保存的时长
	 */
	getConfigOfCookieTimeout() {
		const timeout = this.getConfigOrGlobal().getTimeout();
		if(timeout == SaTokenDao.NEVER_EXPIRE) {
			return Number.MAX_SAFE_INTEGER;
		}
		return timeout;
	}

	/**
	 * 返回全局配置的 maxTryTimes 值，在每次创建 token 时，对其唯一性测试的最高次数（-1=不测试）
	 *
	 * @param {SaLoginParameter} loginParameter /
	 * @return {int} /
	 */
	getConfigOfMaxTryTimes(loginParameter) {
		return loginParameter.getMaxTryTimes();
	}

	/**
	 * 判断：集合中是否包含指定元素（模糊匹配）
	 *
	 * @param {List<String>} list 集合
	 * @param {String} element 元素
	 * @return {boolean} /
	 */
	hasElement(list, element) {
		return SaStrategy.instance.hasElement(list, element);
	}

	/**
	 * 当前 StpLogic 对象是否支持 token 扩展参数
	 *
	 * @return {boolean} /
	 */
	isSupportExtra() {
		return false;
	}

	/**
	 * 根据当前配置对象创建一个 SaLoginParameter 对象
	 *
	 * @return {SaLoginParameter} /
	 */
	createSaLoginParameter() {
		return new SaLoginParameter(this.getConfigOrGlobal());
	}

	/**
	 * 根据当前配置对象创建一个 SaLogoutParameter 对象
	 *
	 * @return {SaLogoutParameter} /
	 */
	createSaLogoutParameter() {
		return new SaLogoutParameter(this.getConfigOrGlobal());
	}



	// ------------------- 过期方法 -------------------

	/**
	 * <h2>请更换为 getLoginDeviceType </h2>
	 * 返回当前会话的登录设备类型
	 *
	 * @return {String} 当前令牌的登录设备类型
	 */
	// @Deprecated
	getLoginDevice() {
		return this.getLoginDeviceType();
	}

	/**
	 * <h2>请更换为 getLoginDeviceTypeByToken </h2>
	 * 返回指定 token 会话的登录设备类型
	 *
	 * @param {String} tokenValue 指定token
	 * @return {String} 当前令牌的登录设备类型
	 */
	// @Deprecated
	getLoginDeviceByToken(tokenValue) {
		return this.getLoginDeviceTypeByToken(tokenValue);
	}

}
export default StpLogic;
