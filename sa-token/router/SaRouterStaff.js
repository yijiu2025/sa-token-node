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


import BackResultException from "../exception/BackResultException";
import StopMatchException from "../exception/StopMatchException"; 
import SaFunction from "../fun/SaFunction";
import SaParamFunction from "../fun/SaParamFunction";
import SaParamRetFunction from "../fun/SaParamRetFunction"; 
import SaFunctionException from "../exception/SaFunctionException"; 
import SaRouter from "./SaRouter"; 
import SaHttpMethod from "./SaHttpMethod";

/**
 * 路由匹配操作对象 
 * 
 * @author click33
 * @since 1.27.0
 */
class SaRouterStaff {

	/**
	 * 是否命中的标记变量 
	 */
    isHit = true; // 初始假设匹配成功
	//isHit = true;
	
	/**
	 * @return {boolean} 是否命中 
	 */
	isHit() {
		return this.isHit;
	}

	/**
	 * @param {boolean} isHit 是否命中标记 
	 * @return {SaRouterStaff} 对象自身 
	 */
	setHit(isHit) {
		this.isHit = isHit;
		return this;
	}

	/**
	 * 重置命中标记为 true 
	 * @return {SaRouterStaff} 对象自身 
	 */
	reset() {
		this.isHit = true;
		return this;
	}



	// ----------------- path匹配 
	
	/**
	 * 路由匹配 
	 * 目标
	 * 将 Java 中多个 match(...) 方法合并为一个 JS 函数，保持原有逻辑。
	 * 🔍 分析 Java 中的 match 重载
	 * 重载方法	参数说明
	 * match(...patterns)	可变字符串数组（匹配 URI 路径）
	 * match(patterns)	字符串数组（匹配 URI 路径）
	 * match(...methods)	可变字符串数组（匹配 HTTP 方法，如 GET、POST）
	 * match(boolean)	布尔值（直接设置匹配结果）
	 * match(SaParamRetFunction)	函数（自定义逻辑判断）
	 * match(String, SaFunction)	路由 + 执行函数（链式调用）
	 * match(String, SaParamFunction)	路由 + 参数化执行函数
	 * match(String, String, SaFunction)	路由 + 排除路由 + 执行函数
	 * match(String, String, SaParamFunction)	同上，函数类型不同
	 * match(...args)	可变参数（路由、排除路由、函数）
	 * @param {...String || List<String> || ...SaHttpMethod} patterns  路由匹配符数组  
	 * @return 对象自身 
	 */

	match(...args) {
		const len = args.length;

		// ----------------- 直接指定check函数 
		// 情况1: match(pattern, fun) 或 match(pattern, SaParamFunction) 路由匹配，如果匹配成功则执行认证函数 
		if (len === 2 && typeof args[0] === 'string' && typeof args[1] === 'function') {
			return this.match(args[0]).check(args[1]);
		}

		// 情况2: match(pattern, excludePattern, fun) 路由匹配 (并指定排除匹配符)，如果匹配成功则执行认证函数 
		else if (len === 3 &&
				typeof args[0] === 'string' &&
				typeof args[1] === 'string' &&
				typeof args[2] === 'function') {
			return this.match(args[0]).notMatch(args[1]).check(args[2]);
		}

		// 如果已经不匹配了，跳过
		if (!this.isHit) return this;

		// ----------------- 条件匹配
		// 情况1: match(boolean)
        if (len === 1 && typeof args[0] === 'boolean') {
            this.isHit = args[0];
        }

        // 情况2: match(fun) - 自定义函数  根据自定义方法进行匹配 (lazy)   SaParamRetFunction<Object, Boolean> 
        else if (len === 1 && typeof args[0] === 'function') {
            try {
                const result = args[0](this);
                this.isHit = Boolean(result);
            } catch (e) {
                this.isHit = false;
            }
        }

		// 情况3: match(pattern) 或 match(...patterns) - 匹配 URI 路径
        else if (args.every(arg => typeof arg === 'string') && this._isPathPattern(args)) {
            this.isHit = SaRouter.isMatchCurrURI(...args);
        }

        // 情况4: match(...methods) - 匹配 HTTP 方法（如 GET, POST）
        else if (args.every(arg => typeof arg === 'string') && this._isHttpMethod(args)) {
            this.isHit = SaRouter.isMatchCurrMethod(...args);
        }

		return this;

	}



	/**
     * notMatch 多态实现：根据参数类型执行不同的排除逻辑
     * @param {...*} args
     * @returns {SaRouterStaff}
     */
    notMatch(...args) {
        // 如果已经不匹配，跳过
        if (!this.isHit) return this;

        const len = args.length;

        // 1. notMatch(boolean)
        if (len === 1 && typeof args[0] === 'boolean') {
            this.isHit = !args[0];
        }

        // 2. notMatch(function)
        else if (len === 1 && typeof args[0] === 'function') {
            try {
                const result = args[0](this);
                this.isHit = !Boolean(result);
            } catch (e) {
                this.isHit = false;
            }
        }

        // 3. notMatch(...patterns) 或 notMatch(...methods)
        else if (args.every(arg => typeof arg === 'string')) {

			if (this._isHttpMethod(args)) {
				this.isHit = !SaRouter.isMatchCurrMethod(...args);
			} else {
				this.isHit = !SaRouter.isMatchCurrURI(...args);
			}
        }

        // 其他情况（如传入数组），可扩展
        // 例如：if (Array.isArray(args[0])) { ... }

        return this;
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
	 * @return {SaRouterStaff} 对象自身 
	 */
	matchMethod(...methods) {
		if(this.isHit)  {
			//[]
			const arr = SaHttpMethod.toEnumArray(...methods);
			this.isHit = SaRouter.isMatchCurrMethod(arr);
		}
		return this;
	}

	/**
	 * Http请求方法匹配排除 (String) 
	 * @param {...String} methods Http请求方法断言排除数组  
	 * @return {SaRouterStaff} 对象自身 
	 */
	notMatchMethod(...methods) {
		if(this.isHit)  {
			const arr = SaHttpMethod.toEnumArray(...methods);
			this.isHit = !SaRouter.isMatchCurrMethod(arr);
		}
		return this;
	}

	// ----------------- 函数校验执行 

	/**
	 * 执行校验函数 (无参 | 带参) 
	 * @param {SaFunction || SaParamFunction<SaRouterStaff>} fun 要执行的函数 
	 * @return {SaRouterStaff} 对象自身 
	 */

	check(fun) {
		if (this.isHit && typeof fun === 'function') {
			if (fun.length === 0) {
				fun(); // 无参函数
			} else {
				fun(this); // 有参函数，传入 this
			}
		}
		return this;
	}

	/**
	 * 自由匹配 （ 在free作用域里执行stop()不会跳出Auth函数，而是仅仅跳出free代码块 ）
	 * @param {SaParamFunction<SaRouterStaff>} fun 要执行的函数 
	 * @return {SaRouterStaff} 对象自身 
	 */
	free(fun) {
		if(this.isHit)  {
			try {
				fun(this);
			} catch (e) {
				// 跳出 free自由匹配代码块 
				// 只捕获 StopMatchException，用于跳出 free 块
				if (e instanceof StopMatchException) {
					// 正常跳出，不中断整个流程
				} else {
					// 其他异常（如 BackResultException）应继续抛出
					throw e;
				}
			}
		}
		return this;
	}
	
	// ----------------- 提前退出 

	/**
	 * 停止匹配，结束执行，向前端返回结果 
	 * @return {SaRouterStaff} 对象自身 
	 * @param {Object || ""} result 要输出的结果 
	 */
	back(result = "") {
		if(this.isHit) {
			throw new BackResultException(result);
		}
		return this;
	}
}
export default SaRouterStaff;
