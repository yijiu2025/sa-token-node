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

import SaManager from '../../SaManager';
import SaFunction from '../../fun/SaFunction';
import SaRetGenericFunction from '../../fun/SaRetGenericFunction';
import SaRequestForMock from './SaRequestForMock';
import SaResponseForMock from './SaResponseForMock';
import SaStorageForMock from './SaStorageForMock';
/**
 * Sa-Token Mock 上下文 操作工具类
 *
 * @author click33 qirly
 * @since 1.42.0
 */

class SaTokenContextMockUtil {
    /**
     * 写入 Mock 上下文
     */
    static async setMockContext() {
        const request = await new SaRequestForMock();
        const response = await new SaResponseForMock();
        const storage = await new SaStorageForMock();
        const context = await SaManager.getSaTokenContext();
        context.setContext(request, response, storage);
    }

    /**
     * 写入 Mock 上下文，并执行一段代码，执行完毕后清除上下文
     * @param {Function} fun 要执行的函数
     */
    static setMockContextAndRun(fun) {
        try {
            this.setMockContext();
            return fun();
        } finally {
            this.clearContext();
        }
    }

    /**
     * 写入 Mock 上下文，并执行一段代码，执行完毕后清除上下文（带返回值）
     * @template T
     * @param {() => T} fun 要执行的函数
     * @returns {T} 函数执行结果
     */
    static setMockContextAndGet(fun) {
        try {
            this.setMockContext();
            return fun();
        } finally {
            this.clearContext();
        }
    }

    /**
     * 清除上下文
     */
    static clearContext() {
        SaManager.getSaTokenContext().clearContext();
    }
}

export default SaTokenContextMockUtil;


