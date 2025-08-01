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


import SaRequest from "./model/SaRequest.js";
import SaResponse from "./model/SaResponse.js";
import SaStorage from "./model/SaStorage.js"; 
import SaTokenContextModelBox from "./model/SaTokenContextModelBox.js";
import SaTokenContext from "./SaTokenContext.js";

/**
 * Sa-Token 上下文处理器次级实现：只读上下文
 * 
 * @author click33
 * @since 1.42.0
 */

class SaTokenContextForReadOnly extends SaTokenContext {
    /**
     * 空实现（不执行任何操作）
     * @param {SaRequest} req 
     * @param {SaResponse} res 
     * @param {SaStorage} stg 
     */
    setContext(req, res, stg) {
        // 空实现
    }

    /**
     * 空实现（不执行任何操作）
     */
    clearContext() {
        // 空实现
    }

    /**
     * 总是返回 null
     * @returns {SaTokenContextModelBox}
     */
    getModelBox() {
        return null
    }

    // /**
    //  * 重写请求对象获取（总是抛出异常）
    //  * @throws {Error}
    //  */
    // getRequest() {
    //     throw new Error("只读上下文不允许获取Request对象")
    // }

    // /**
    //  * 重写响应对象获取（总是抛出异常）
    //  * @throws {Error}
    //  */
    // getResponse() {
    //     throw new Error("只读上下文不允许获取Response对象")
    // }

    // /**
    //  * 重写存储对象获取（总是抛出异常）
    //  * @throws {Error}
    //  */
    // getStorage() {
    //     throw new Error("只读上下文不允许获取Storage对象")
    // }

    // /**
    //  * 上下文永远无效
    //  * @returns {false}
    //  */
    // isValid() {
    //     return false
    // }
}

// 冻结原型防止修改
Object.freeze(SaTokenContextForReadOnly.prototype)

export default SaTokenContextForReadOnly











