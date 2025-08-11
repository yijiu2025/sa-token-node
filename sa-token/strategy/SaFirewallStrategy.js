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
import SaFirewallCheckFailHandleFunction from "../fun/strategy/SaFirewallCheckFailHandleFunction.js";
import SaFirewallCheckFunction from "../fun/strategy/SaFirewallCheckFunction.js";

import SaFirewallCheckHook from "./hooks/SaFirewallCheckHook.js";
import SaFirewallCheckHookForWhitePath from "./hooks/SaFirewallCheckHookForWhitePath.js";
import SaFirewallCheckHookForBlackPath from "./hooks/SaFirewallCheckHookForBlackPath.js";
import SaFirewallCheckHookForPathDangerCharacter from "./hooks/SaFirewallCheckHookForPathDangerCharacter.js";
import SaFirewallCheckHookForPathBannedCharacter from "./hooks/SaFirewallCheckHookForPathBannedCharacter.js";
import SaFirewallCheckHookForDirectoryTraversal from "./hooks/SaFirewallCheckHookForDirectoryTraversal.js";
import SaFirewallCheckHookForHost from "./hooks/SaFirewallCheckHookForHost.js";
import SaFirewallCheckHookForHttpMethod from "./hooks/SaFirewallCheckHookForHttpMethod.js";
import SaFirewallCheckHookForHeader from "./hooks/SaFirewallCheckHookForHeader.js";
import SaFirewallCheckHookForParameter from "./hooks/SaFirewallCheckHookForParameter.js";

/**
 * Sa-Token 防火墙策略
 *
 * @author click33 qirly
 * @since 1.40.0
 */
class SaFirewallStrategy {

	/**
	 * 全局单例引用
	 */
	static get instance() {
		if (!this._instance) {
			this._instance = new SaFirewallStrategy();
		}
		return this._instance;
	}

	/**
	 * 防火墙校验钩子函数集合
	 */
	checkHooks = [];

	constructor() {
		// 初始化默认的防火墙校验钩子函数集合
		checkHooks.push(SaFirewallCheckHookForWhitePath.instance);
		checkHooks.push(SaFirewallCheckHookForBlackPath.instance);
		checkHooks.push(SaFirewallCheckHookForPathDangerCharacter.instance);
		checkHooks.push(SaFirewallCheckHookForPathBannedCharacter.instance);
		checkHooks.push(SaFirewallCheckHookForDirectoryTraversal.instance);
		checkHooks.push(SaFirewallCheckHookForHost.instance);
		checkHooks.push(SaFirewallCheckHookForHttpMethod.instance);
		checkHooks.push(SaFirewallCheckHookForHeader.instance);
		checkHooks.push(SaFirewallCheckHookForParameter.instance);
	}

	/**
	 * 注册一个防火墙校验 hook
	 * @param {SaFirewallCheckHook} checkHook /
	 */
	registerHook(checkHook) {
		SaManager.getLog().info("防火墙校验 hook 注册成功: " + checkHook.name);
		this.checkHooks.push(checkHook);
	}

	/**
	 * 注册一个防火墙校验 hook 到第一位，
	 * <b>请注意将 hook 注册到第一位将会优先于白名单的判断，如果您依然希望白名单 hook 保持最高优先级，请调用 registerHookToSecond </b>
	 * @param {SaFirewallCheckHook} checkHook /
	 */
	registerHookToFirst(checkHook) {
		SaManager.getLog().info("防火墙校验 hook 注册成功: " + checkHook.name);
		this.checkHooks.unshift(checkHook);
	}

	/**
	 * 注册一个防火墙校验 hook 到第二位
	 * @param {SaFirewallCheckHook} checkHook /
	 */
	registerHookToSecond(checkHook) {
		SaManager.getLog().info("防火墙校验 hook 注册成功: " + checkHook.name);
		this.checkHooks.splice(1, 0, checkHook);
	}

	/**
	 * 移除指定类型的防火墙校验 hook
	 * @param {Class<? extends SaFirewallCheckHook>} hookClass /
	 */
	removeHook(hookClass) {
		for (let i = 0; i < this.checkHooks.length; i++) {
			const hook = this.checkHooks[i];
			if (hook.name === hookClass.name) {
				this.checkHooks.splice(i, 1);
				SaManager.getLog().info("防火墙校验 hook 移除成功: " + hookClass.name);
				return;
			}
		}
	}

	/**
	 * 防火墙校验函数 {@link SaFirewallCheckFunction}
	 */
	check = (req, res, extArg) => {
		for (const checkHook of this.checkHooks) {
			checkHook.execute(req, res, extArg);
		}
	};

	/**
	 * 当请求 path 校验不通过时地处理方案，自定义示例：
	 * <pre>
	 * 		SaFirewallStrategy.instance.checkFailHandle = (e, req, res, extArg) -> {
	 * 			// 自定义处理逻辑 ...
	 *      };
	 * </pre>
	 * {@link SaFirewallCheckFailHandleFunction}
	 */
	checkFailHandle = null;


}

export default SaFirewallStrategy;
