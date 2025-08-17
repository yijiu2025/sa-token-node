import SaTokenException from './SaTokenException.js';
import StpUtil from '../stp/StpUtil.js';

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
 * 一个异常：代表会话未能通过权限认证校验
 * 
 * @author click33 qirly
 * @since 1.10.0
 */

class NotPermissionException extends SaTokenException {
    /**
     * 权限码
     */
    permission;

    /**
     * 账号类型
     */
    loginType;

    // /**
    //  * 构造函数
    //  * @param {string} permission 缺少的权限码
    //  */
    // constructor(permission) {
    //     this(permission, StpUtil.stpLogic.loginType);
    // }

    /**
     * 构造函数
     * @param {string} permission 缺少的权限码
     * @param {string} loginType 账号类型
     */
    constructor(permission, loginType = StpUtil.stpLogic.loginType) {
        super(`无此权限：${permission}`);
        this.permission = permission;
        this.loginType = loginType;
        this.name = 'NotPermissionException';
    }

    /**
     *  获得具体缺少的权限码
     * @return {string} 权限码
     */
    getPermission() {
        return this.permission;
    }

    /**
     * 获取账号类型
     * @return {string} 账号类型
     */
    getLoginType() {
        return this.loginType;
    }
}

export { NotPermissionException as default };
