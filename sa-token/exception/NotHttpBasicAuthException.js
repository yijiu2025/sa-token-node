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
 * 一个异常：代表会话未能通过 Http Basic 认证校验
 *
 * @author click33
 * @since 1.26.0
 */

/**
 * HTTP Basic 认证未通过异常
 */
class NotHttpBasicAuthException extends SaTokenException {
    /**
     * 异常提示语
     */
    static BE_MESSAGE = "no basic auth";

    /**
     * 一个异常：代表会话未通过 Http Basic 认证 
     */
    /**
     * 构造函数
     */
    constructor() {
        super(NotHttpBasicAuthException.BE_MESSAGE);
        this.name = 'NotHttpBasicAuthException';
        
        // 设置HTTP Basic认证相关的错误码
        //this.code = 10311; // CODE_10311 = 表示未能通过 Http Basic 认证校验
    }
}

// 冻结静态属性和原型
Object.freeze(NotHttpBasicAuthException);
Object.freeze(NotHttpBasicAuthException.prototype);

export default NotHttpBasicAuthException;