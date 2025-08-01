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

import SaTokenConsts from '../../util/SaTokenConsts.js'

/**
 * 返回值包装类：描述一个账号是否已被封禁等信息
 *
 * @author click33
 * @since 1.40.0
 */
class SaDisableWrapperInfo {

    /**
     * 构建对象
     * @param {boolean} isDisable 是否被封禁
     * @param {long} disableTime 封禁剩余时间，单位：秒（-1=永久封禁，0 or -2=未封禁）
     * @param {int} disableLevel 封禁等级（最小1级，0=未封禁）
     */
    constructor(isDisable, disableTime, disableLevel) {
        this.isDisable = isDisable;
        this.disableTime = disableTime;
        this.disableLevel = disableLevel;
    }


    // /**
    //  * 构建对象
    //  *
    //  * @param isDisable 是否被封禁
    //  * @param disableTime 封禁剩余时间，单位：秒（-1=永久封禁，0 or -2=未封禁）
    //  * @param disableLevel 封禁等级（最小1级，0=未封禁）
    //  */
    // public SaDisableWrapperInfo(boolean isDisable, long disableTime, int disableLevel) {
    //     this.isDisable = isDisable;
    //     this.disableTime = disableTime;
    //     this.disableLevel = disableLevel;
    // }

    /**
     * 创建一个已封禁描述对象
     * @param {long} disableTime 封禁剩余时间，单位：秒
     * @param {int} disableLevel 封禁等级
     * @return {SaDisableWrapperInfo} /
     */
    static createDisabled(disableTime, disableLevel) {
        return new SaDisableWrapperInfo(true, disableTime, disableLevel);
    }

    /**
     * 创建一个未封禁描述对象
     * @return {SaDisableWrapperInfo} /
     */
    static createNotDisabled() {
        return new SaDisableWrapperInfo(false, 0, SaTokenConsts.NOT_DISABLE_LEVEL);
    }

    /**
     * 创建一个未封禁描述对象，并指定缓存时间，指定时间内不再重复查询
     * @param {long} cacheTime 缓存时间（单位：秒）
     * @return {SaDisableWrapperInfo} /
     */
    static createNotDisabled(cacheTime) {
        return new SaDisableWrapperInfo(false, cacheTime, SaTokenConsts.NOT_DISABLE_LEVEL);
    }

    /**
     * 转换为字符串表示
     * @return {string}
     */
    @Override
    toString() {
        return `SaDisableWrapperInfo{isDisable=${this.isDisable}, disableTime=${this.disableTime}, disableLevel=${this.disableLevel}}`;
    }


    // getter 和 setter 方法
    get isDisable() {
        return this._isDisable;
    }

    set isDisable(value) {
        this._isDisable = value;
    }

    get disableTime() {
        return this._disableTime;
    }

    set disableTime(value) {
        this._disableTime = value;
    }

    get disableLevel() {
        return this._disableLevel;
    }

    set disableLevel(value) {
        this._disableLevel = value;
    }

    // setter / getter 仅为兼容部分框架序列化操作，不建议调用

    getIsDisable() {
        return this.isDisable;
    }

    setIsDisable(isDisable) {
        this.isDisable = isDisable;
        return this;
    }

    getDisableTime() {
        return this.disableTime;
    }

    setDisableTime(disableTime) {
        this.disableTime = disableTime;
        return this;
    }

    getDisableLevel() {
        return this.disableLevel;
    }

    setDisableLevel(disableLevel) {
        this.disableLevel = disableLevel;
        return this;
    }

}

export default SaDisableWrapperInfo;