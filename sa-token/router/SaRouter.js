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
import SaHolder from '../context/SaHolder.js';
import BackResultException from '../exception/BackResultException.js';
import StopMatchException from '../exception/StopMatchException.js';
import SaFunction from '../fun/SaFunction.js';
import SaParamFunction from '../fun/SaParamFunction.js';
import SaParamRetFunction from '../fun/SaParamRetFunction.js';
import SaStrategy from '../strategy/SaStrategy.js';
import SaHttpMethod from './SaHttpMethod.js';
import SaRouterStaff from './SaRouterStaff.js';

/**
 * 路由匹配操作工具类
 *
 * <p> 提供了一系列的路由匹配操作方法，一般用在全局拦截器、过滤器做路由拦截鉴权。 </p>
 * <p> 简单示例： </p>
 * <pre>
 *    	// 指定一条 match 规则
 *    	SaRouter
 *    	   	.match("/**")    // 拦截的 path 列表，可以写多个
 *   	   	.notMatch("/user/doLogin")        // 排除掉的 path 列表，可以写多个
 *   	   	.check(r->StpUtil.checkLogin());        // 要执行的校验动作，可以写完整的 lambda 表达式
 * </pre>
 *
 * @author click33
 * @since 1.27.0
 */
class SaRouter {

	// -------------------- 路由匹配相关 -------------------- 
	
	/**
	 * 路由匹配
	 * @param {string|Array<string>|[]|SaHttpMethod[]} patternOrMethods 路由匹配符 
	 * @param {String} pathOrMethodString 被匹配的路由  
	 * @return {boolean} 是否匹配成功 
	 */
    static isMatch(patternOrMethods, pathOrMethodString) {
        if(patternOrMethods == null) {
            return false;
        }
        if(typeof patternOrMethods === 'string' || patternOrMethods instanceof String) {
            return SaStrategy.instance.routeMatcher(patternOrMethods, pathOrMethodString);
        } else {
            const targetMethod = pathOrMethodString.toLowerCase();
            for (const pOrm of patternOrMethods) {
                if(pOrm == SaHttpMethod.ALL || (pOrm != null && pOrm.toString().toLowerCase() === targetMethod)) {
                    return true;
                }
                if(this.isMatch(pOrm, pathOrMethodString)) {
                    return true;
                }
            }
        }
        return false;

    }

	// ------ 使用当前URI匹配 
	
	/**
	 * 路由匹配 (使用当前URI)
	 * 支持多种参数类型:
	 * 1. @param {String} pattern 单个路由匹配符
	 * 2. @param {Array<string>} patterns 路由匹配符数组
	 * @return {boolean} 是否匹配成功
	 */
	static isMatchCurrURI(patternOrPatterns) {
        return this.isMatch(patternOrPatterns, SaHolder.getRequest().getRequestPath());
    }

	/**
	 * Http请求方法匹配 (使用当前请求方式) 
	 * @param {Array<SaHttpMethod>} methods Http请求方法断言数组  
	 * @return {boolean} 是否匹配成功 
	 */
	static isMatchCurrMethod(methods) {
        return this.isMatch(methods, SaHolder.getRequest().getMethod());
    }
	

	// -------------------- 开始匹配 -------------------- 
	
	/**
	 * 初始化一个SaRouterStaff，开始匹配
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static newMatch() {
        return new SaRouterStaff();
    }

	// ----------------- path匹配 
	
	/**
	 * 路由匹配
	 * 支持多种调用方式:
	 * 1. @param {String...} patterns 路由匹配符集合
	 * 2. @param {SaHttpMethod...} methods HTTP方法集合
	 * 3. @param {SaParamRetFunction<Object, Boolean>} fun 自定义匹配方法
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static match(...args) {
        return new SaRouterStaff().match(...args);
    }

	/**
	 * 路由匹配排除 
	 * @param {String...} patterns 路由匹配符排除数组  
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static notMatch(...patterns) {
        return new SaRouterStaff().notMatch(...patterns);
    }

	/**
	 * 路由匹配 
	 * @param {Array<string>} patterns 路由匹配符集合 
	 * @return {SaRouterStaff} SaRouterStaff对象自身 
	 */
	static match(patterns) {
        return new SaRouterStaff().match(patterns);
    }

	/**
	 * 路由匹配排除 
	 * @param {Array<string>} patterns 路由匹配符排除集合 
	 * @return {SaRouterStaff} SaRouterStaff对象自身 
	 */
	static notMatch(patterns) {
		return new SaRouterStaff().notMatch(patterns);
	}

	// ----------------- Method匹配 
	
	/**
	 * Http请求方法匹配 (String)  
	 * @param {...String} methods Http请求方法断言数组  
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static matchMethod(...methods) {
		return new SaRouterStaff().matchMethod(...methods);
	}

	/**
	 * Http请求方法匹配排除 (String) 
	 * @param {...String} methods Http请求方法断言排除数组  
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static notMatchMethod(...methods) {
		return new SaRouterStaff().notMatchMethod(...methods);
	}
	
	// ----------------- 条件匹配 

	/**
	 * 多功能匹配方法，支持多种参数类型:
	 * 1. @param {...SaHttpMethod} methods Http请求方法断言数组
	 * 2. @param {boolean} flag 布尔值条件
	 * 3. @param {SaParamRetFunction<Object, Boolean>} fun 自定义匹配方法
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static match(...args) {
		const arg = args[0];
		// 判断参数类型决定调用方式
		if (args.length === 1) {
			if (typeof arg === 'boolean') {
				return new SaRouterStaff().match(arg);
			} else if (typeof arg === 'function') {
				return new SaRouterStaff().match(arg);
			} else if (Array.isArray(arg) && arg.length > 0 && arg[0] instanceof SaHttpMethod) {
				return new SaRouterStaff().match(arg);
			}
		}
		// 默认当作Http请求方法数组处理
		return new SaRouterStaff().match(args);
	}

	/**
	 * 多功能匹配排除方法，支持多种参数类型:
	 * 1. @param {...SaHttpMethod} methods Http请求方法断言排除数组
	 * 2. @param {boolean} flag 布尔值条件
	 * 3. @param {SaParamRetFunction<Object, Boolean>} fun 自定义匹配排除方法
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static notMatch(...args) {
		const arg = args[0];
		// 判断参数类型决定调用方式
		if (args.length === 1) {
			if (typeof arg === 'boolean') {
				return new SaRouterStaff().notMatch(arg);
			} else if (typeof arg === 'function') {
				return new SaRouterStaff().notMatch(arg);
			} else if (Array.isArray(arg) && arg.length > 0 && arg[0] instanceof SaHttpMethod) {
				return new SaRouterStaff().notMatch(arg);
			}
		}
		// 默认当作Http请求方法数组处理
		return new SaRouterStaff().notMatch(args);
	}

	
	// -------------------- 直接指定check函数 -------------------- 
	
	/**
	 * 路由匹配，如果匹配成功则执行认证函数
	 * 支持多种参数组合:
	 * 1. @param {String} pattern 路由匹配符
	 *    @param {SaFunction|SaParamFunction<SaRouterStaff>} fun 要执行的校验方法
	 * 2. @param {String} pattern 路由匹配符
	 *    @param {String} excludePattern 要排除的路由匹配符
	 *    @param {SaFunction|SaParamFunction<SaRouterStaff>} fun 要执行的校验方法
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static match(pattern, arg1, arg2) {
		// 根据参数数量和类型决定调用方式
		if (typeof arg2 !== 'undefined') {
			return new SaRouterStaff().match(pattern, arg1, arg2);
		} else {
			return new SaRouterStaff().match(pattern, arg1);
		}
	}

	/**
	 * 路由匹配 (并指定排除匹配符)，如果匹配成功则执行认证函数 
	 * @param {String} pattern 路由匹配符 
	 * @param {String} excludePattern 要排除的路由匹配符 
	 * @param {SaFunction} fun 要执行的方法 
	 * @param {SaFunction|SaParamFunction<SaRouterStaff>} fun 要执行的方法
	 * @return {SaRouterStaff} SaRouterStaff
	 * @deprecated 请使用 match(pattern, excludePattern, fun) 替代
	 */
	static matchWithExclude(pattern, excludePattern, fun) {
		return new SaRouterStaff().match(pattern, excludePattern, fun);
	}

	/**
	 * 路由匹配 (并指定排除匹配符)，如果匹配成功则执行认证函数 
	 * @param {String} pattern 路由匹配符 
	 * @param {String} excludePattern 要排除的路由匹配符 
	 * @param {SaParamFunction<SaRouterStaff>} fun 要执行的方法 
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static match(pattern, excludePattern, fun) {
		return new SaRouterStaff().match(pattern, excludePattern, fun);
	}

	




	// -------------------- 提前退出 -------------------- 
	
	/**
	 * 停止匹配，跳出函数 (在多个匹配链中一次性跳出Auth函数) 
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static stop() {
		throw new StopMatchException();
	}
	
	/**
	 * 停止匹配，结束执行，向前端返回结果 
	 * @param {*} result 要输出的结果 
	 * @return {SaRouterStaff} SaRouterStaff
	 */
    static back(result = "") {
        throw new BackResultException(result);
    }
}

export default SaRouter;
