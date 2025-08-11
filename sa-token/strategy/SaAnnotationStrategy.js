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

// import cn.dev33.satoken.annotation.*;
// import cn.dev33.satoken.annotation.handler.*;
// import cn.dev33.satoken.fun.strategy.*;
import SaTokenEventCenter from "../listener/SaTokenEventCenter.js";
import SaRouter from "../router/SaRouter.js";

// 注解类导入（暂时留空，因为这些文件是空的）
// import SaCheckLogin from "../annotation/SaCheckLogin.js";
// import SaCheckRole from "../annotation/SaCheckRole.js";
// import SaCheckPermission from "../annotation/SaCheckPermission.js";
// import SaCheckSafe from "../annotation/SaCheckSafe.js";
// import SaCheckDisable from "../annotation/SaCheckDisable.js";
// import SaCheckHttpBasic from "../annotation/SaCheckHttpBasic.js";
// import SaCheckHttpDigest from "../annotation/SaCheckHttpDigest.js";
// import SaCheckOr from "../annotation/SaCheckOr.js";
// import SaIgnore from "../annotation/SaIgnore.js";

// 注解处理器导入（暂时留空，因为这些文件是空的）
// import SaCheckLoginHandler from "../annotation/handler/SaCheckLoginHandler.js";
// import SaCheckRoleHandler from "../annotation/handler/SaCheckRoleHandler.js";
// import SaCheckPermissionHandler from "../annotation/handler/SaCheckPermissionHandler.js";
// import SaCheckSafeHandler from "../annotation/handler/SaCheckSafeHandler.js";
// import SaCheckDisableHandler from "../annotation/handler/SaCheckDisableHandler.js";
// import SaCheckHttpBasicHandler from "../annotation/handler/SaCheckHttpBasicHandler.js";
// import SaCheckHttpDigestHandler from "../annotation/handler/SaCheckHttpDigestHandler.js";
// import SaCheckOrHandler from "../annotation/handler/SaCheckOrHandler.js";




/**
 * Sa-Token 注解鉴权相关策略
 *
 * @author click33
 * @since 1.39.0
 */
class SaAnnotationStrategy {

	constructor() {
        // 初始化注解处理器集合
        this.annotationHandlerMap = new Map();
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
		this.annotationHandlerMap.set(SaCheckLogin.class, new SaCheckLoginHandler());
		this.annotationHandlerMap.set(SaCheckRole.class, new SaCheckRoleHandler());
		this.annotationHandlerMap.set(SaCheckPermission.class, new SaCheckPermissionHandler());
		this.annotationHandlerMap.set(SaCheckSafe.class, new SaCheckSafeHandler());
		this.annotationHandlerMap.set(SaCheckDisable.class, new SaCheckDisableHandler());
		this.annotationHandlerMap.set(SaCheckHttpBasic.class, new SaCheckHttpBasicHandler());
		this.annotationHandlerMap.set(SaCheckHttpDigest.class, new SaCheckHttpDigestHandler());
		this.annotationHandlerMap.set(SaCheckOr.class, new SaCheckOrHandler());
	}

	/**
	 * 注册一个注解处理器
	 */
	public void registerAnnotationHandler(SaAnnotationHandlerInterface<?> handler) {
		annotationHandlerMap.put(handler.getHandlerAnnotationClass(), handler);
		SaTokenEventCenter.doRegisterAnnotationHandler(handler);
	}

	/**
	 * 注册一个注解处理器，到首位
	 */
	public void registerAnnotationHandlerToFirst(SaAnnotationHandlerInterface<?> handler) {
		Map<Class<?>, SaAnnotationHandlerInterface<?>> newMap = new LinkedHashMap<>();
		newMap.put(handler.getHandlerAnnotationClass(), handler);
		newMap.putAll(annotationHandlerMap);
		this.annotationHandlerMap = newMap;
		SaTokenEventCenter.doRegisterAnnotationHandler(handler);
	}

	/**
	 * 移除一个注解处理器
	 */
	public void removeAnnotationHandler(Class<?> cls) {
		annotationHandlerMap.remove(cls);
	}

	/**
	 * 对一个 [Method] 对象进行注解校验 （注解鉴权内部实现）
	 */
	public SaCheckMethodAnnotationFunction checkMethodAnnotation = (method) -> {

		// 如果 Method 或其所属 Class 上有 @SaIgnore 注解，则直接跳过整个校验过程
		if(instance.isAnnotationPresent.apply(method, SaIgnore.class)) {
			SaRouter.stop();
		}

		// 先校验 Method 所属 Class 上的注解
		instance.checkElementAnnotation.accept(method.getDeclaringClass());

		// 再校验 Method 上的注解
		instance.checkElementAnnotation.accept(method);
	};

	/**
	 * 对一个 [Element] 对象进行注解校验 （注解鉴权内部实现）
	 */
	@SuppressWarnings("unchecked")
	public SaCheckElementAnnotationFunction checkElementAnnotation = (element) -> {
		// 如果此元素上标注了 @SaCheckOr，则必须在后续判断中忽略掉其指定的 append() 类型注解判断
		List<Class<? extends Annotation>> ignoreClassList = new ArrayList<>();
		SaCheckOr checkOr = (SaCheckOr)instance.getAnnotation.apply(element, SaCheckOr.class);
		if(checkOr != null) {
			ignoreClassList = Arrays.asList(checkOr.append());
		}

		// 遍历所有的注解处理器，检查此 element 是否具有这些指定的注解
		for (Map.Entry<Class<?>, SaAnnotationHandlerInterface<?>> entry: annotationHandlerMap.entrySet()) {
			// 忽略掉在 @SaCheckOr 中 append 字段指定的注解
			Class<Annotation> atClass = (Class<Annotation>)entry.getKey();
			if(ignoreClassList.contains(atClass)) {
				continue;
			}
			Annotation annotation = instance.getAnnotation.apply(element, atClass);
			if(annotation != null) {
				entry.getValue().check(annotation, element);
			}
		}
	};

	/**
	 * 从元素上获取注解
	 */
	public SaGetAnnotationFunction getAnnotation = (element, annotationClass)->{
		return element.getAnnotation(annotationClass);
	};

	/**
	 * 判断一个 Method 或其所属 Class 是否包含指定注解
	 */
	public SaIsAnnotationPresentFunction isAnnotationPresent = (method, annotationClass) -> {
		return instance.getAnnotation.apply(method, annotationClass) != null ||
				instance.getAnnotation.apply(method.getDeclaringClass(), annotationClass) != null;
	};

	/**
	 * SaCheckELRootMap 扩展函数
	 */
	public SaCheckELRootMapExtendFunction checkELRootMapExtendFunction = rootMap -> {
		// 默认不做任何处理
	};



}
