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
	
	// /**
	//  * 路由匹配
	//  * @param {string|Array<string>|[]|SaHttpMethod[]} patternOrMethods 路由匹配符 
	//  * @param {String} pathOrMethodString 被匹配的路由  
	//  * @return {boolean} 是否匹配成功 
	//  */

	// 单个路由匹配
	/**
	 * 路由匹配
	 * @param pattern 路由匹配符 
	 * @param path 被匹配的路由  
	 * @return 是否匹配成功 
	 */
    static matchRoute(pattern, path) {
        return SaStrategy.instance.routeMatcher(pattern, path);
    }

	// 多个路由匹配
	/**
	 * 路由匹配   
	 * @param patterns 路由匹配符集合 
	 * @param path 被匹配的路由  
	 * @return 是否匹配成功 
	 */
    static matchRoutes(patterns, path) {
        return patterns?.some(pattern => this.matchRoute(pattern, path)) ?? false;
    }

	// HTTP方法匹配
	/**
	 * Http请求方法匹配 
	 * @param methods Http请求方法断言数组  
	 * @param methodString Http请求方法
	 * @return 是否匹配成功 
	 */
    static matchMethods(methods, methodString) {
        if (!methods) return false;
        const target = methodString?.toLowerCase();
        return methods.some(method => 
            method === SaHttpMethod.ALL || 
            (method && method.toString().toLowerCase() === target)
        );
    }

	// 兼容Java API的通用方法
    static isMatch(patternsOrMethods, pathOrMethod) {
        if (Array.isArray(patternsOrMethods)) {
            if (patternsOrMethods.length > 0 && SaHttpMethod.isValidMethod(patternsOrMethods[0])) {
                return this.matchMethods(patternsOrMethods, pathOrMethod);
            }
            return this.matchRoutes(patternsOrMethods, pathOrMethod);
        }
        return this.matchRoute(patternsOrMethods, pathOrMethod);
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
		const len = args.length;

		// 1. 情况1: match(pattern, fun) 或 match(pattern, SaParamFunction) 路由匹配，如果匹配成功则执行认证函数
		if(len === 2 && typeof args[0] === 'string' && typeof args[1] === 'function') {
			return new SaRouterStaff().match(args[0], args[1]);
		}
		// 2. 情况2: match(pattern, excludePattern, fun) 路由匹配 (并指定排除匹配符)，如果匹配成功则执行认证函数
		else if (len === 3 && typeof args[0] === 'string' && typeof args[1] === 'string' && typeof args[2] === 'function') {
			return new SaRouterStaff().match(args[0], args[1], args[2]);
		}

		// 3. 根据 boolean 值进行匹配 
		if (len === 1 && typeof args[0] === 'boolean') {
            return new SaRouterStaff().match(args[0]);
        }
		// 4. 根据自定义方法进行匹配 (lazy) 
		else if (len === 1 && typeof args[0] === 'function') {
            return new SaRouterStaff().match(args[0]);
        }

		// 情况5: match(...methods) - 匹配 HTTP 方法（如 GET, POST）
		else if (args.every(arg => typeof arg === 'string') && this._isHttpMethod(args)) {
			return new SaRouterStaff().match(...args);
		}

		// 情况6: match(pattern) 或 match(...patterns) - 匹配 URI 路径
        else if (args.every(arg => typeof arg === 'string')) {
            return new SaRouterStaff().match(...args);
        }
	}


	/**
     * notMatch 多态实现：根据参数类型执行不同的排除逻辑
     * @param {...*} args
     * @returns {SaRouterStaff}
     */
    notMatch(...args) {

        const len = args.length;

        // 1. 根据 boolean 值进行匹配排除 
        if (len === 1 && typeof args[0] === 'boolean') {
            return new SaRouterStaff().notMatch(args[0]);
        }

        // 2. 根据自定义方法进行匹配排除 (lazy) 
        else if (len === 1 && typeof args[0] === 'function') {
            return new SaRouterStaff().notMatch(args[0]);
        }

        // 3. notMatch(...patterns) 或 notMatch(...methods)
        else if (args.every(arg => typeof arg === 'string')) {

			if (this._isHttpMethod(args)) {
				return new SaRouterStaff().notMatch(...args);
			} else {
				return new SaRouterStaff().notMatch(...args);
			}
        }

    }

	// 辅助方法：判断是否是路径匹配模式（比如包含 /user/:id）
    _isPathPattern(patterns) {
        return patterns.some(p => p.includes('*') || p.includes(':') || p.includes('/'));
    }

    // 辅助方法：判断是否是 HTTP 方法（全大写）
    _isHttpMethod(methods) {
        const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS',"TRACE", "CONNECT", "ALL"];
        return methods.every(m => validMethods.includes(m.toUpperCase()));
    }


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
	 * @param {...String} methods Http请求方法断言数组  排除数组  
	 * @return {SaRouterStaff} SaRouterStaff
	 */
	static notMatchMethod(...methods) {
		return new SaRouterStaff().notMatchMethod(...methods);
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
