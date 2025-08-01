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
import SaTokenContextForThreadLocalStaff from "./SaTokenContextForThreadLocalStaff.js";

/**
 * Sa-Token 上下文处理器 [ ThreadLocal 版本 ]
 * 
 * <p>
 * 	使用 [ ThreadLocal 版本 ] 上下文处理器需要在全局过滤器或者拦截器内率先调用
 * 	SaTokenContextForThreadLocalStorage.setBox(req, res, sto) 初始化上下文
 * </p>
 *
 * <p> 一般情况下你不需要直接操作此类，因为框架的 starter 集成包里已经封装了完整的上下文操作 </p>
 *
 * @author click33
 * @since 1.16.0
 */


class SaTokenContextForThreadLocal extends SaTokenContext {
    /** @implements {SaTokenContext} */
    /**
     * 初始化上下文
     * @param {SaRequest} req 
     * @param {SaResponse} res 
     * @param {SaStorage} stg 
     */
    setContext(req, res, stg) {
        SaTokenContextForThreadLocalStaff.setModelBox(req, res, stg)
    }

    /**
     * 清除上下文
     */
    clearContext() {
        SaTokenContextForThreadLocalStaff.clearModelBox()
    }

    /**
     * 检查上下文是否有效
     * @returns {boolean}
     */
    isValid() {
        return SaTokenContextForThreadLocalStaff.getModelBoxOrNull() !== null
    }

    /**
     * 获取 ModelBox 对象
     * @returns {SaTokenContextModelBox}
     */
    getModelBox() {
        return SaTokenContextForThreadLocalStaff.getModelBox()
    }

    /**
     * 获取当前请求对象
     * @returns {SaRequest}
     */
    getRequest() {
        return this.getModelBox().getRequest()
    }

    /**
     * 获取当前响应对象
     * @returns {SaResponse}
     */
    getResponse() {
        return this.getModelBox().getResponse()
    }

    /**
     * 获取当前存储对象
     * @returns {SaStorage}
     */
    getStorage() {
        return this.getModelBox().getStorage()
    }
}

// 冻结保护
Object.freeze(SaTokenContextForThreadLocal.prototype)

export default SaTokenContextForThreadLocal


