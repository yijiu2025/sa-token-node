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
import SaFoxUtil from "../util/SaFoxUtil";

/**
 * 一个异常：代表会话未能通过登录认证校验
 *
 * @author click33
 * @since 1.10.0
 */

class NotLoginException extends SaTokenException {
    /**
     * 异常类型常量
     */
    /*
    * 这里简述一下为什么要把常量设计为String类型 
    * 因为loginId刚取出的时候类型为String，为了避免两者相比较时不必要的类型转换带来的性能消耗，故在此直接将常量类型设计为String 
    */
    // 表示未能读取到有效 token
    static NOT_TOKEN = "-1";
    static NOT_TOKEN_MESSAGE = "未能读取到有效 token";
    
    // 表示 token 无效
    static INVALID_TOKEN = "-2";
    static INVALID_TOKEN_MESSAGE = "token 无效";
    
    // 表示 token 已过期
    static TOKEN_TIMEOUT = "-3";
    static TOKEN_TIMEOUT_MESSAGE = "token 已过期";
    
    // 表示 token 已被顶下线
    static BE_REPLACED = "-4";
    static BE_REPLACED_MESSAGE = "token 已被顶下线";
    
    // 表示 token 已被踢下线
    static KICK_OUT = "-5";
    static KICK_OUT_MESSAGE = "token 已被踢下线";

    // 表示 token 已被冻结
    static TOKEN_FREEZE = "-6";
    static TOKEN_FREEZE_MESSAGE = "token 已被冻结";

    // 表示未按照指定前缀提交 token
    static NO_PREFIX = "-7";
    static NO_PREFIX_MESSAGE = "未按照指定前缀提交 token";

    // 默认的提示语
    static DEFAULT_MESSAGE = "当前会话未登录";
    
    /**
     * 异常token标志集合
     */
    static ABNORMAL_LIST = [
        NotLoginException.NOT_TOKEN,
        NotLoginException.INVALID_TOKEN,
        NotLoginException.TOKEN_TIMEOUT,
        NotLoginException.BE_REPLACED,
        NotLoginException.KICK_OUT,
        NotLoginException.TOKEN_FREEZE,
        NotLoginException.NO_PREFIX
    ];

    /**
     * 异常类型 
     */
    type;

    /**
     * 账号类型 
     */
    loginType;

    /**
     * 构造函数
     * @param {string} message 异常消息
     * @param {string} loginType 账号类型
     * @param {string} type 异常类型
     * @param {number} [code] 错误码
     * @param {Error} [cause] 原始错误对象
     */
    constructor(message, loginType, type) {
        super(message);
        this.type = type;
        this.loginType = loginType;
        this.name = 'NotLoginException';
    }

    /**
     * 获取异常类型
     * @return {string} 异常类型
     */
    getType() {
        return this.type;
    }

    /**
     * 获取账号类型
     * @return {string} 账号类型
     */
    getLoginType() {
        return this.loginType;
    }

    /**
     * 静态方法创建NotLoginException实例
     * @param {string} loginType 账号类型
     * @param {string} type 未登录场景值
     * @param {string} message 异常描述信息
     * @param {string} [token] 引起异常的token值(可选)
     * @param {number} [code] 错误码(可选)
     * @param {Error} [cause] 原始错误对象(可选)
     * @return {NotLoginException} 构建的异常对象
     */
    static newInstance(loginType, type, message, token) {
        // 如果有token参数，拼接到消息后面
        if (SaFoxUtil.isNotEmpty(token)) {
            message = `${message}：${token}`;
        }
        return new NotLoginException(message, loginType, type);
    }
}

export default NotLoginException;