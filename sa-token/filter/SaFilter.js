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


import SaFilterAuthStrategy from "./SaFilterAuthStrategy";
import SaFilterErrorStrategy from "./SaFilterErrorStrategy";
/**
 * Sa-Token 过滤器接口，为不同版本的过滤器：
 *  1、封装共同代码。
 *  2、定义统一的行为接口。
 *
 * @author click33 qirly
 * @since 1.34.0
 */

class SaFilter {

    // ------------------------ 设置此过滤器 拦截 & 放行 的路由
    /**
     * 添加拦截路由
     * @param {...string} paths 路由路径
     * @return {SaFilter} 对象自身
     */
    addInclude(...paths) {
        throw new Error("Method not implemented.");
    }

    /**
     * 添加放行路由
     * @param {...string} paths 路由路径
     * @return {SaFilter} 对象自身
     */
    addExclude(...paths) {
        throw new Error("Method not implemented.");
    }

    /**
     * 设置拦截路由集合
     * @param {Array<string>} pathList 路由路径数组
     * @return {SaFilter} 对象自身
     */
    setIncludeList(pathList) {
        throw new Error("Method not implemented.");
    }

    /**
     * 设置放行路由集合
     * @param {Array<string>} pathList 路由路径数组
     * @return {SaFilter} 对象自身
     */
    setExcludeList(pathList) {
        throw new Error("Method not implemented.");
    }

     // ------------------------ 钩子函数

    /**
     * 写入[ 认证函数 ]: 每次请求执行
     * @param {SaFilterAuthStrategy} auth 认证策略函数
     * @return {SaFilter} 对象自身
     */
    setAuth(auth) {
        throw new Error("Method not implemented.");
    }

    /**
     * 写入[ 异常处理函数 ]：每次[ 认证函数 ]发生异常时执行此函数
     * @param {SaFilterErrorStrategy} error 异常处理策略函数
     * @return {SaFilter} 对象自身
     */
    setError(error) {
        throw new Error("Method not implemented.");
    }

    /**
     * 写入[ 前置函数 ]：在每次[ 认证函数 ]之前执行。
     * <b>注意点：前置认证函数将不受 includeList 与 excludeList 的限制，所有路由的请求都会进入 beforeAuth</b>
     * @param {SaFilterAuthStrategy} beforeAuth 前置认证策略函数
     * @return {SaFilter} 对象自身
     */
    setBeforeAuth(beforeAuth) {
        throw new Error("Method not implemented.");
    }
}

export default SaFilter;