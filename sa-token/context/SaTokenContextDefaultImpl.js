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
import SaErrorCode from "../error/SaErrorCode.js";
import SaTokenContextException from "../exception/SaTokenContextException.js";

/**
 * Sa-Token 上下文处理器 [ 默认实现类 ]
 * 
 * <p>  
 * 	一般情况下框架会为你自动注入合适的上下文处理器，如果代码断点走到了此默认实现类，
 * 	说明你引入的依赖有问题或者错误的调用了 Sa-Token 的API， 请在 [ 在线开发文档 → 附录 → 常见问题排查 ] 中按照提示进行排查
 * </p>
 * 
 * @author click33 qirly
 * @since 1.16.0
 */

class SaTokenContextDefaultImpl extends SaTokenContext {
    /**
     * 默认上下文实例
     */
    static defaultContext = new SaTokenContextDefaultImpl();

    /**
     * 错误提示语
     */
    static ERROR_MESSAGE = "未能获取有效的上下文处理器";

    /**
     * 错误码
     */
    static ERROR_CODE = "10001";

    /**
     * 创建上下文异常
     * @returns {Error}
     */
    // _createError() {
    //     const err = new Error(SaTokenContextDefaultImpl.ERROR_MESSAGE);
    //     err.code = SaTokenContextDefaultImpl.ERROR_CODE;
    //     return err;
    // }

    /**
     * 初始化上下文（需子类实现）
     * @param {SaRequest} req 
     * @param {SaResponse} res 
     * @param {SaStorage} stg 
     */
    setContext(req, res, stg) {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    clearContext() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    isValid() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    /**
     * 获取 ModelBox 对象（需子类实现）
     * @returns {SaTokenContextModelBox}
     */
    getModelBox() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    // 重写父类方法以统一错误处理
    getRequest() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    getResponse() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }

    getStorage() {
        throw new SaTokenContextException(ERROR_MESSAGE).setCode(SaErrorCode.CODE_10001);
    }
}

// 冻结静态属性和原型
Object.freeze(SaTokenContext.prototype);
Object.freeze(SaTokenContextDefaultImpl);
Object.freeze(SaTokenContextDefaultImpl.prototype);
Object.freeze(SaTokenContextDefaultImpl.defaultContext);

export { SaTokenContext, SaTokenContextDefaultImpl };



