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

import InvalidContextException from "./InvalidContextException";

/**
 * 一个异常：代表框架未能获取有效的上下文
 * 
 * @author click33
 * @since 1.33.0
 */

class SaTokenContextException extends InvalidContextException {
    /**
     * 构造函数
     * @param {string} message 异常描述信息
     */
    constructor(message) {
        super(message);
        this.name = 'SaTokenContextException';
    }
}

export default SaTokenContextException;