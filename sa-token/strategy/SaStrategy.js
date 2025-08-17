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
import SaErrorCode from "../error/SaErrorCode.js";
import NotImplException from "../exception/NotImplException.js";
import SaTokenException from "../exception/SaTokenException.js";
import SaSession from "../session/SaSession.js";
import StpLogic from "../stp/StpLogic.js";
import SaFoxUtil from "../util/SaFoxUtil.js";
import SaTokenConsts from "../util/SaTokenConsts.js";
import { randomUUID } from 'crypto';
//import { v4 as uuidv4 } from 'uuid';

//import cn.dev33.satoken.fun.strategy.*;

/**
 * Sa-Token 策略对象
 * <p>
 * 此类统一定义框架内的一些关键性逻辑算法，方便开发者进行按需重写，例：
 * </p>
 * <pre>
 // SaStrategy全局单例，所有方法都用以下形式重写
 SaStrategy.instance.setCreateToken((loginId, loginType) -》 {
 // 自定义Token生成的算法
 return "xxxx";
 });
 * </pre>
 *
 * @author click33
 * @since 1.27.0
 */
class SaStrategy {

	constructor() {
        // 私有构造函数
    }

	/**
	 * 获取 SaStrategy 对象的单例引用
	 */

    static get instance() {
        if (!this._instance) {
            this._instance = new SaStrategy();
        }
        return this._instance;
    }
	// public static final SaStrategy instance = new SaStrategy();


	// ----------------------- 所有策略

	/**
	 * 创建 Token 的策略
	 */
	createToken = async (loginId, loginType) => {
		// 根据配置的tokenStyle生成不同风格的token
		const tokenStyle = (await SaManager.getStpLogic(loginType).getConfigOrGlobal()).getTokenStyle();

		switch (tokenStyle) {
			// uuid
			case SaTokenConsts.TOKEN_STYLE_UUID:
				return randomUUID();

			// 简单uuid (不带下划线)
			case SaTokenConsts.TOKEN_STYLE_SIMPLE_UUID:
				return randomUUID().replaceAll("-", "");

			// 32位随机字符串
			case SaTokenConsts.TOKEN_STYLE_RANDOM_32:
				return SaFoxUtil.getRandomString(32);

			// 64位随机字符串
			case SaTokenConsts.TOKEN_STYLE_RANDOM_64:
				return SaFoxUtil.getRandomString(64);

			// 128位随机字符串
			case SaTokenConsts.TOKEN_STYLE_RANDOM_128:
				return SaFoxUtil.getRandomString(128);

			// tik风格 (2_14_16)
			case SaTokenConsts.TOKEN_STYLE_TIK:
				return SaFoxUtil.getRandomString(2) + "_" + SaFoxUtil.getRandomString(14) + "_" + SaFoxUtil.getRandomString(16) + "__";

			// 默认，还是uuid
			default:
				SaManager.getLog().warn("配置的 tokenStyle 值无效：{}，仅允许以下取值: " +
						"uuid、simple-uuid、random-32、random-64、random-128、tik", tokenStyle);
				return randomUUID();
		}
	};

	/**
	 * 创建 Session 的策略
     * 
     * @return {SaCreateSessionFunction} 一个Session对象
	 */
	createSession = async (sessionId) => {
        return await new SaSession(sessionId);
    };

	/**
	 * 反序列化 SaSession 时默认指定的类型
	 */
	sessionClassType = SaSession;

	/**
	 * 判断：集合中是否包含指定元素（模糊匹配）
     * @return {SaHasElementFunction} 是否包含指定元素
	 */
	hasElement = (list, element) => {

		// 空集合直接返回false
		if(list == null || list.length == 0) {
			return false;
		}

		// 先尝试一下简单匹配，如果可以匹配成功则无需继续模糊匹配
		if (list.includes(element)) {
			return true;
		}

		// 开始模糊匹配
		for (const patt of list) {
			if(SaFoxUtil.vagueMatch(patt, element)) {
				return true;
			}
		}

		// 走出for循环说明没有一个元素可以匹配成功
		return false;
	};

	/**
	 * 生成唯一式 token 的算法
     * @return {SaGenerateUniqueTokenFunction} 生成唯一 token 的算法
	 */
	generateUniqueToken = async (elementName, maxTryTimes, createTokenFunction, checkTokenFunction) => {

		// 为方便叙述，以下代码注释均假设在处理生成 token 的场景，但实际上本方法也可能被用于生成 code、ticket 等

		// 循环生成
		for (let i = 1; ; i++) {
			// 生成 token
			let token = await createTokenFunction();
			//console.log(`生成的 token: ${token}`);

			// 如果 maxTryTimes == -1，表示不做唯一性验证，直接返回
			if (maxTryTimes == -1) {
				return token;
			}

			// 如果 token 在DB库查询不到数据，说明是个可用的全新 token，直接返回
			if (checkTokenFunction(token)) {
				return token;
			}

			// 如果已经循环了 maxTryTimes 次，仍然没有创建出可用的 token，那么抛出异常
			if (i >= maxTryTimes) {
				throw new SaTokenException(elementName + " 生成失败，已尝试" + i + "次，生成算法过于简单或资源池已耗尽");
			}
		}
	};

	/**
     * 是否自动续期 active-timeout 的 session
     * @return {SaAutoRenewFunction} 是否自动续期 active-timeout 的 session
     */
   autoRenew = (stpLogic) => {
        return stpLogic.getConfigOrGlobal().getAutoRenew();
    };

	/**
	 * 创建 StpLogic 的算法
     * @return {SaCreateStpLogicFunction} 创建 StpLogic 的算法
	 */
	createStpLogic = (loginType) => {
		return new StpLogic(loginType);
	};

	/**
	 * 路由匹配策略
	 */
	routeMatcher = (pattern, path) => {
		throw new NotImplException("未实现具体路由匹配策略").setCode(SaErrorCode.CODE_12401);
	};

	/**
	 * CORS 策略处理函数
	 */
	corsHandle = (req, res, sto) => {

	};


	// ----------------------- 重写策略 set连缀风格

	/**
	 * 重写创建 Token 的策略
	 *
	 * @param {SaCreateTokenFunction} createToken /
	 * @return {SaStrategy} /
	 */
	setCreateToken(createToken) {
		this.createToken = createToken;
		return this;
	}

	/**
	 * 重写创建 Session 的策略
	 *
	 * @param {SaCreateSessionFunction} createSession /
	 * @return {SaStrategy} /
	 */
	setCreateSession(createSession) {
		this.createSession = createSession;
		return this;
	}

	/**
	 * 判断：集合中是否包含指定元素（模糊匹配）
	 *
	 * @param {SaHasElementFunction} hasElement /
	 * @return {SaStrategy} /
	 */
	setHasElement(hasElement) {
		this.hasElement = hasElement;
		return this;
	}

	/**
	 * 生成唯一式 token 的算法
	 *
	 * @param {SaGenerateUniqueTokenFunction} generateUniqueToken /
	 * @return {SaStrategy} /
	 */
	setGenerateUniqueToken(generateUniqueToken) {
		this.generateUniqueToken = generateUniqueToken;
		return this;
	}

	/**
	 * 创建 StpLogic 的算法
	 *
	 * @param {SaCreateStpLogicFunction} createStpLogic /
	 * @return {SaStrategy} /
	 */
	setCreateStpLogic(createStpLogic) {
		this.createStpLogic = createStpLogic;
		return this;
	}

	/**
     * 是否自动续期
     *
     * @param {SaAutoRenewFunction} autoRenew /
     * @return {SaStrategy} /
     */
    setAutoRenew(autoRenew) {
        this.autoRenew = autoRenew;
        return this;
    }

	//

	/**
	 * 请更换为 instance
	 */

    static get me() {
        return this.instance;
    }
	// @Deprecated
	// public static final SaStrategy me = instance;
}
export default SaStrategy;
