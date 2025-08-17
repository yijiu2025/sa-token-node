import SaTokenException from './SaTokenException.js';

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


/**
 * 一个异常：代表会话未能通过二级认证校验 
 * 
 * @author click33 qirly
 * @since 1.21.0
 */


class NotSafeException extends SaTokenException {
    /**
     * 异常提示语
     */
    static BE_MESSAGE = "二级认证校验失败";

    /**
     * 账号类型
     * @private
     */
    #loginType;

    /**
     * 未通过校验的 Token 值
     * @private
     */
    #tokenValue;

    /**
     * 未通过校验的服务
     * @private
     */
    #service;

    /**
     * 构造函数
     * @param {string} loginType 账号类型
     * @param {string} tokenValue 未通过校验的 Token 值
     * @param {string} service 未通过校验的服务
     */
    constructor(loginType, tokenValue, service) {
        super(`${NotSafeException.BE_MESSAGE}：${service}`);
        this.#loginType = loginType;
        this.#tokenValue = tokenValue;
        this.#service = service;
        this.name = 'NotSafeException';
    }

    /**
     * 获取账号类型
     * @return {string} 账号类型
     */
    getLoginType() {
        return this.#loginType;
    }

    /**
     * 获取未通过校验的 Token 值
     * @return {string} Token 值
     */
    getTokenValue() {
        return this.#tokenValue;
    }

    /**
     * 获取未通过校验的服务
     * @return {string} 服务名称
     */
    getService() {
        return this.#service;
    }
}

export { NotSafeException as default };
