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
 * 一个异常：代表会话未能通过 Http Digest 认证校验
 *
 * @author click33
 * @since 1.38.0
 */

class NotHttpDigestAuthException extends SaTokenException {
    /**
     * 异常提示语
     */
    static BE_MESSAGE = "no http digest auth";

    /**
     * 构造函数
     */
    constructor() {
        super(NotHttpDigestAuthException.BE_MESSAGE);
        this.name = 'NotHttpDigestAuthException';
        
        // 设置HTTP Digest认证相关的错误码
        //this.code = 10312; // CODE_10312 = 表示未能通过 Http Digest 认证校验
    }
}

// 冻结静态属性和原型
Object.freeze(NotHttpDigestAuthException);
Object.freeze(NotHttpDigestAuthException.prototype);

export default NotHttpDigestAuthException;
