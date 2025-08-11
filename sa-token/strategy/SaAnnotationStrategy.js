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

import SaTokenEventCenter from "../listener/SaTokenEventCenter.js";
import SaRouter from "../router/SaRouter.js";

// 注解类导入
import SaCheckLogin from "../annotation/SaCheckLogin.js";
import SaCheckRole from "../annotation/SaCheckRole.js";
import SaCheckPermission from "../annotation/SaCheckPermission.js";
import SaCheckSafe from "../annotation/SaCheckSafe.js";
import SaCheckDisable from "../annotation/SaCheckDisable.js";
import SaCheckHttpBasic from "../annotation/SaCheckHttpBasic.js";
import SaCheckHttpDigest from "../annotation/SaCheckHttpDigest.js";
import SaCheckOr from "../annotation/SaCheckOr.js";
import SaIgnore from "../annotation/SaIgnore.js";

// 注解处理器导入
import SaCheckLoginHandler from "../annotation/handler/SaCheckLoginHandler.js";
import SaCheckRoleHandler from "../annotation/handler/SaCheckRoleHandler.js";
import SaCheckPermissionHandler from "../annotation/handler/SaCheckPermissionHandler.js";
import SaCheckSafeHandler from "../annotation/handler/SaCheckSafeHandler.js";
import SaCheckDisableHandler from "../annotation/handler/SaCheckDisableHandler.js";
import SaCheckHttpBasicHandler from "../annotation/handler/SaCheckHttpBasicHandler.js";
import SaCheckHttpDigestHandler from "../annotation/handler/SaCheckHttpDigestHandler.js";
import SaCheckOrHandler from "../annotation/handler/SaCheckOrHandler.js";
import SaIgnoreHandler from "../annotation/handler/SaIgnoreHandler.js";

import SaCheckMethodAnnotationFunction from "../fun/strategy/SaCheckMethodAnnotationFunction.js";


// import cn.dev33.satoken.fun.strategy.*;


/**
 * Sa-Token 注解鉴权相关策略
 *
 * @author click33 qirly
 * @since 1.39.0
 */
class SaAnnotationStrategy {

	constructor() {
		this.registerDefaultAnnotationHandler();
	}

	/**
	 * 全局单例引用
	 */
	static get instance() {
        if (!this._instance) {
            this._instance = new SaAnnotationStrategy();
        }
        return this._instance;
    }


	// ----------------------- 所有策略

	/**
	 * 注解处理器集合
	 */
	annotationHandlerMap = new Map();

	/**
	 * 注册所有默认的注解处理器
	 */
	registerDefaultAnnotationHandler() {
		this.annotationHandlerMap.set(SaCheckLogin, new SaCheckLoginHandler());
		this.annotationHandlerMap.set(SaCheckRole, new SaCheckRoleHandler());
		this.annotationHandlerMap.set(SaCheckPermission, new SaCheckPermissionHandler());
		this.annotationHandlerMap.set(SaCheckSafe, new SaCheckSafeHandler());
		this.annotationHandlerMap.set(SaCheckDisable, new SaCheckDisableHandler());
		this.annotationHandlerMap.set(SaCheckHttpBasic, new SaCheckHttpBasicHandler());
		this.annotationHandlerMap.set(SaCheckHttpDigest, new SaCheckHttpDigestHandler());
		this.annotationHandlerMap.set(SaCheckOr, new SaCheckOrHandler());
	}

	/**
	 * 注册一个注解处理器
	 */
	registerAnnotationHandler(handler) {
		this.annotationHandlerMap.set(handler.getHandlerAnnotationClass(), handler);
		SaTokenEventCenter.doRegisterAnnotationHandler(handler);
	}

	/**
	 * 注册一个注解处理器，到首位
	 */
	registerAnnotationHandlerToFirst(handler) {
		const newMap = new Map();
		newMap.set(handler.getHandlerAnnotationClass(), handler);
		for (const [key, value] of this.annotationHandlerMap) {
			newMap.set(key, value);
		}
		this.annotationHandlerMap = newMap;
		SaTokenEventCenter.doRegisterAnnotationHandler(handler);
	}

	/**
	 * 移除一个注解处理器
	 */
	removeAnnotationHandler(cls) {
		this.annotationHandlerMap.delete(cls);
	}

	/**
	 * 对一个 [Method] 对象进行注解校验 （注解鉴权内部实现）
	 */
	checkMethodAnnotation = (method) => {

		// 如果 Method 或其所属 Class 上有 @SaIgnore 注解，则直接跳过整个校验过程
		if(SaAnnotationStrategy.instance.isAnnotationPresent.apply(method, SaIgnore)) {
			SaRouter.stop();
		}

		// 先校验 Method 所属 Class 上的注解
		SaAnnotationStrategy.instance.checkElementAnnotation(method.getDeclaringClass());

		// 再校验 Method 上的注解
		SaAnnotationStrategy.instance.checkElementAnnotation(method);
	};

	/**
	 * 对一个 [Element] 对象进行注解校验 （注解鉴权内部实现）
	 */
	checkElementAnnotation = (element) => {
		// 如果此元素上标注了 @SaCheckOr，则必须在后续判断中忽略掉其指定的 append() 类型注解判断
		let ignoreClassList = [];
		const checkOr = SaAnnotationStrategy.instance.getAnnotation.apply(element, SaCheckOr);
		if(checkOr != null) {
			ignoreClassList = Array.from(checkOr.append());
		}

		// 遍历所有的注解处理器，检查此 element 是否具有这些指定的注解
		for (const [atClass, value] of this.annotationHandlerMap) {
			// 忽略掉在 @SaCheckOr 中 append 字段指定的注解
			if(ignoreClassList.includes(atClass)) {
				continue;
			}
			const annotation = SaAnnotationStrategy.instance.getAnnotation.apply(element, atClass);
			if(annotation != null) {
				value.check(annotation, element);
			}
		}
	};

	/**
	 * 从元素上获取注解
	 */
	getAnnotation = (element, annotationClass) => {
		// 在 Node.js 中，我们需要一种方式来模拟注解
		// 这里假设 element 有一个 annotations 属性来存储注解
		if (element.annotations && element.annotations[annotationClass.name]) {
			return element.annotations[annotationClass.name];
		}
		return null;
	};

	/**
	 * 判断一个 Method 或其所属 Class 是否包含指定注解
	 */
	isAnnotationPresent = (method, annotationClass) => {
		return SaAnnotationStrategy.instance.getAnnotation.apply(method, annotationClass) != null ||
				SaAnnotationStrategy.instance.getAnnotation.apply(method.getDeclaringClass(), annotationClass) != null;
	};

	/**
	 * SaCheckELRootMap 扩展函数
	 */
	checkELRootMapExtendFunction = (rootMap) => {
		// 默认不做任何处理
	};



}

export default SaAnnotationStrategy;
