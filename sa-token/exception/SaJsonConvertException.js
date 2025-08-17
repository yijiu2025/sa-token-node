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

import SaTokenException from "./SaTokenException";

/**
 * 一个异常：代表 JSON 转换失败 
 * 
 * @author click33 qirly
 * @since 1.30.0
 */

class SaJsonConvertException extends SaTokenException {
    /**
     * 构造函数
     * @param {Error} cause 原始错误对象
     */
    constructor(cause) {
        // 合并原始错误信息
        //const message = `JSON转换失败: ${cause.message}`;
        super(cause);
        
        // 保留原始错误堆栈
        this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        this.name = 'SaJsonConvertException';
        //this.cause = cause; // 保留原始错误引用
    }
}

export default SaJsonConvertException;

