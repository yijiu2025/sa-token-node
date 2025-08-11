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

import SaRequest from "../../context/model/SaRequest.js";
import SaResponse from "../../context/model/SaResponse.js";
import RequestPathInvalidException from "../../exception/RequestPathInvalidException.js";
import SaFirewallCheckHook from "./SaFirewallCheckHook.js";

/**
 * 防火墙策略校验钩子函数：请求 path 目录遍历符检测
 *
 * @author click33 qirly
 * @since 1.41.0
 */
class SaFirewallCheckHookForDirectoryTraversal extends SaFirewallCheckHook {

    /**
     * 默认实例
     */
    static instance = new SaFirewallCheckHookForDirectoryTraversal();

    /**
     * 执行的方法
     *
     * @param {SaRequest} req 请求对象
     * @param {SaResponse} res 响应对象
     * @param {Object} extArg 预留扩展参数
     */
    // @Override
    execute(req, res, extArg) {
        const requestPath = req.getRequestPath();
        if(!SaFirewallCheckHookForDirectoryTraversal.isPathValid(requestPath)) {
            throw new RequestPathInvalidException("非法请求：" + requestPath, requestPath);
        }
    }

    /**
     * 检查路径是否有效
     * @param {String} path /
     * @return {boolean} /
     */
    static isPathValid(path) {
        if (path == null || path.length === 0) {
            return false;
        }

        // 必须以 '/' 开头
        if (path.charAt(0) !== '/') {
            return false;
        }

        // 特殊处理根路径 "/"
        if (path === "/") {
            return true;
        }

        const components = path.split("/");
        for (let i = 0; i < components.length; i++) {
            const component = components[i];

            // 处理空组件
            if (component.length === 0) {
                if (i === 0) {
                    // 允许路径以 "/" 开头（第一个组件为空）
                    continue;
                } else {
                    // 其他位置的空组件（如中间或末尾的 "//"）非法
                    return false;
                }
            }

            // 检查是否包含 "." 或 ".." 组件
            if (component === "." || component === "..") {
                return false;
            }
        }
        return true;
    }

//     // 测试
//    main(args) {
//        this.test("/user/info", true);      // 合法
//        this.test("/user/info/.", false);   // 末尾包含 /.
//        this.test("/user/info/..", false);  // 末尾包含 /..
//        this.test("/user/info/./get", false); // 中间包含 /./
//        this.test("/user/info/../get", false); // 中间包含 /../
//        this.test("/user/info/.js", true);  // 合法后缀
//        this.test("/.abcdef", true);         // 合法隐藏文件
//        this.test("//user", false);          // 多余斜杠
//        this.test("/user//info", false);     // 中间多余斜杠
//        this.test("/", true);               // 根目录合法
//        this.test("user/../info", false);    // 不以 / 开头
//        this.test("a/b/c/..", false);       // 不以 / 开头
//        this.test("test/.", false);          // 不以 / 开头
//        this.test("", true);                // 空路径非法
//    }

//    test(path, expected) {
//        const result = SaFirewallCheckHookForDirectoryTraversal.isPathValid(path);
//        console.log(`Path: ${path} Expected: ${expected} Actual: ${result} ${result === expected ? "✓" : "✗"}`);
//    }

}

export default SaFirewallCheckHookForDirectoryTraversal;