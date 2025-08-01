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

import FirewallCheckException from "./FirewallCheckException";

/**
 * 一个异常：代表请求 path 无效或非法
 * 
 * @author click33
 * @since 1.37.0
 */

class RequestPathInvalidException extends FirewallCheckException {
    /**
     * 无效的请求路径
     * @private
     */
    #path;

    /**
     * 构造函数
     * @param {string} message 异常描述信息
     * @param {string} path 无效的请求路径
     */
    constructor(message, path) {
        super(message);
        this.#path = path;
        this.name = 'RequestPathInvalidException';
    }

    /**
     * 具体无效的 path
     * @return {string} 无效路径
     */
    getPath() {
        return this.#path;
    }
}

export default RequestPathInvalidException;