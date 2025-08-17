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

import SaTokenException from "./SaTokenException.js";

/**
 * 一个异常：代表指定账号的指定服务已被封禁
 * 
 * @author click33 qirly
 * @since 1.31.0
 */


class DisableServiceException extends SaTokenException {
    /**
     * @deprecated 已更改为 SaTokenConsts.DEFAULT_DISABLE_LEVEL
     */
    static BE_VALUE = "disable";

    /**
     * 异常提示语
     */
    static BE_MESSAGE = "此账号已被禁止访问服务：";

    /**
     * 构造函数
     * @param {string} loginType 账号类型
     * @param {*} loginId 被封禁的账号id
     * @param {string} service 具体封禁的服务
     * @param {number} level 被封禁的等级
     * @param {number} limitLevel 校验时要求低于的等级
     * @param {number} disableTime 封禁剩余时间(秒)
     */
    constructor(loginType, loginId, service, level, limitLevel, disableTime) {
        super(DisableServiceException.BE_MESSAGE + service);
        this.loginType = loginType;
        this.loginId = loginId;
        this.service = service;
        this.level = level;
        this.limitLevel = limitLevel;
        this.disableTime = disableTime;
        this.name = 'DisableServiceException';
        
        // 设置默认错误码（可根据需要修改）
        //this.code = 16001; // 假设160xx系列是服务禁用相关错误码
    }

    // ------------ Getter 方法 ------------


    /**
     * 获取：账号类型 
     * 
     * @return {String} / 
     */
    getLoginType() {
        return this.loginType;
    }

    /**
     * 获取: 被封禁的账号id 
     * 
     * @return {Object} / 
     */
    getLoginId() {
        return this.loginId;
    }

    /**
     * 获取: 被封禁的服务 
     * 
     * @return {Object} / 
     */
    getService() {
        return this.service;
    }

    /**
     * 获取: 被封禁的等级 
     * 
     * @return {int} / 
     */
    getLevel() {
        return this.level;
    }

    /**
     * 获取: 校验时要求低于的等级 
     * 
     * @return {int} / 
     */
    getLimitLevel() {
        return this.limitLevel;
    }

    /**
     * 获取: 封禁剩余时间，单位：秒
     * 
     * @return {long} / 
     */
    getDisableTime() {
        return this.disableTime;
    }
}

// 冻结静态属性和原型
Object.freeze(DisableServiceException);
Object.freeze(DisableServiceException.prototype);

export default DisableServiceException;






