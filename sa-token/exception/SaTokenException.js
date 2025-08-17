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

import SaErrorCode from "../error/SaErrorCode.js";
import SaFoxUtil from "../util/SaFoxUtil.js";

/**
 * Sa-Token 框架内部逻辑发生错误抛出的异常
 *
 * <p> 框架其它异常均继承自此类，开发者可通过捕获此异常来捕获框架内部抛出的所有异常 </p>
 * 
 * @author click33 qirly
 * @since 1.10.0
 */

class SaTokenException extends Error {
    /**
     * 异常细分状态码
     */
    code = SaErrorCode.CODE_UNDEFINED;

    /**
     * 构造函数
     * @param {number|string} arg1 错误码或错误信息
     * @param {string} [arg2] 错误信息
     */
    constructor(arg1, arg2) {
        // 确定消息内容和错误码
        let message, code, cause;

        // 分析所有可能的参数组合
        if (typeof arg1 === 'number' && arg2 === undefined) {
            // SaTokenException(int code)
            code = arg1;
            message = '';
        } else if (typeof arg1 === 'string' && arg2 === undefined) {
            // SaTokenException(String message)
            message = arg1;
        } else if (typeof arg1 === 'number' && typeof arg2 === 'string') {
            // SaTokenException(int code, String message)
            code = arg1;
            message = arg2;
        } else if (arg1 instanceof Error && arg2 === undefined) {
            // SaTokenException(Throwable cause)
            cause = arg1;
            message = cause.message;
        } else if (typeof arg1 === 'string' && arg2 instanceof Error) {
            // SaTokenException(String message, Throwable cause)
            message = arg1;
            cause = arg2;
        }

        // 调用父类构造函数（JavaScript的Error只接受message参数）
        super(message || '');

        // 设置错误码
        if (code !== undefined) {
            this.code = code;
        }

        // 处理原始错误对象
        if (cause) {
            this.cause = cause;
            // 模拟Java的cause机制，合并堆栈信息
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
        
        // 保持正确的堆栈跟踪
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SaTokenException);
        }
        
        this.name = 'SaTokenException';
    }

    /**
     * 获取异常细分状态码
     * @return 异常细分状态码
     */
    getCode() {
        return this.code;
    }

    /**
     * 设置异常细分状态码
     * @param {number} code 错误码
     * @returns {SaTokenException} 当前异常实例
     */
    setCode(code) {
        this.code = code;
        return this;
    }

    // ------------------------ 静态断言方法 ------------------------

    /**
     * 断言条件不为true，否则抛出异常
     * @param {boolean} flag 条件标志
     * @param {string} message 错误信息
     * @param {number} [code=SaErrorCode.CODE_UNDEFINED] 错误码
     */
    static notTrue(flag, message, code = SaErrorCode.CODE_UNDEFINED) {
        if (flag) {
            throw new SaTokenException(message).setCode(code);
        }
    }

    /**
     * 断言值不为空，否则抛出异常
     * @param {*} value 要检查的值
     * @param {string} message 错误信息
     * @param {number} [code=SaErrorCode.CODE_UNDEFINED] 错误码
     */
    static notEmpty(value, message, code = SaErrorCode.CODE_UNDEFINED) {
        if (SaFoxUtil.isEmpty(value)) {
            throw new SaTokenException(message).setCode(code);
        }
    }
}

export default SaTokenException;





