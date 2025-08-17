import SaErrorCode from '../error/SaErrorCode.js';
import 'dayjs';
import 'dayjs/plugin/utc.js';
import 'dayjs/plugin/timezone.js';
import 'lodash';
import SaTokenContextModelBox from './model/SaTokenContextModelBox.js';
import SaTokenContextException from '../exception/SaTokenContextException.js';
import { AsyncLocalStorage } from 'async_hooks';

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
 * Sa-Token 上下文处理器 [ThreadLocal 版本] ---- 对象存储器
 *
 * <p> 一般情况下你不需要直接操作此类，因为框架的 starter 集成包里已经封装了完整的上下文操作 </p>
 *
 * @author click33 qirly
 * @since 1.16.0
 */


/**
 * 基于 AsyncLocalStorage 的线程局部存储实现
 */
class SaTokenContextForThreadLocalStaff {
    /**
     * 线程局部存储容器
     */
    static #storage = new AsyncLocalStorage();

    /**
     * 初始化当前线程的 Box 存储器
     * @param {SaRequest} request 
     * @param {SaResponse} response 
     * @param {SaStorage} storage 
     */
    static setModelBox(request, response, storage) {
        const box = new SaTokenContextModelBox(request, response, storage);
        this.#storage.enterWith(box);
    }

    /**
     * 清除当前线程的 Box 存储器
     */
    static clearModelBox() {
        this.#storage.enterWith(undefined);
    }

    /**
     * 获取当前线程的 Box 存储器（可能为null）
     * @returns {SaTokenContextModelBox|null}
     */
    static getModelBoxOrNull() {
        return this.#storage.getStore() || null;
    }

    /**
     * 获取当前线程的 Box 存储器，如果为空则抛出异常
     * @returns {SaTokenContextModelBox}
     * @throws {SaTokenContextException}
     */
    static async getModelBox() {
        const box = await this.getModelBoxOrNull();
        if (!box) {
            throw new SaTokenContextException("SaTokenContext 上下文尚未初始化")
                .setCode(SaErrorCode.CODE_10002);
        }
        return box;
    }

    /**
     * 获取当前线程的 SaRequest 包装对象
     * @returns {SaRequest}
     */
    static getRequest() {
        return this.getModelBox().getRequest();
    }

    /**
     * 获取当前线程的 SaResponse 包装对象
     * @returns {SaResponse}
     */
    static getResponse() {
        return this.getModelBox().getResponse();
    }

    /**
     * 获取当前线程的 SaStorage 存储器包装对象
     * @returns {SaStorage}
     */
    static getStorage() {
        return this.getModelBox().getStorage();
    }
}

// 冻结静态类防止修改
Object.freeze(SaTokenContextForThreadLocalStaff);

export { SaTokenContextForThreadLocalStaff as default };
