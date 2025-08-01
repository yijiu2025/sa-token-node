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
import StpUtil from "../stp/StpUtil";

/**
 * 一个异常：代表会话未能通过角色认证校验
 * 
 * @author click33
 * @since 1.10.0
 */

class NotRoleException extends SaTokenException {
    /**
     * 角色标识
     */
    #role;

    /**
     * 账号类型
     */
    #loginType;

    /**
     * 构造函数 - 使用默认登录类型
     * @param {string} role 缺失的角色标识
     */
    constructor(role) {
        this(role, StpUtil.stpLogic.loginType);
    }

    /**
     * 构造函数 - 指定登录类型
     * @param {string} role 缺失的角色标识
     * @param {string} loginType 账号类型
     */
    constructor(role, loginType) {
        super(`无此角色：${role}`);
        this.#role = role;
        this.#loginType = loginType;
        this.name = 'NotRoleException';
    }

    /**
     * 获取角色标识
     * @return {string} 角色标识
     */
    getRole() {
        return this.#role;
    }

    /**
     * 获取账号类型
     * @return {string} 账号类型
     */
    getLoginType() {
        return this.#loginType;
    }
}

export default NotRoleException;
