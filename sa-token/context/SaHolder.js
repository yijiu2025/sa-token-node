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


import SaManager from '../SaManager.js';
import SaApplication from '../application/SaApplication.js';
import SaRequest from './model/SaRequest.js';
import SaResponse from './model/SaResponse.js';
import SaStorage from './model/SaStorage.js';

/**
 * Sa-Token 上下文持有类，你可以通过此类快速获取当前环境下的 SaRequest、SaResponse、SaStorage、SaApplication 对象。
 *
 * @author click33 qirly
 * @since 1.18.0
 */


class SaHolder {
    /**
     * 私有构造方法（防止被实例化）
     */
    constructor() {
      throw new Error('SaHolder 是静态工具类，禁止实例化')
    }
  
    /**
     * 获取当前请求的 SaTokenContext 上下文对象
     * @returns {SaTokenContext}
     */
    static getContext() {
      return SaManager.getSaTokenContext()
    }
  
    /**
     * 获取当前请求的 Request 包装对象
     * @returns {SaRequest}
     */
    static getRequest() {
      const ctx = SaManager.getSaTokenContext()
      if (!ctx) throw new Error('SaTokenContext 未初始化')
      return ctx.getRequest()
    }
  
    /**
     * 获取当前请求的 Response 包装对象
     * @returns {SaResponse}
     */
    static getResponse() {
      const ctx = SaManager.getSaTokenContext()
      if (!ctx) throw new Error('SaTokenContext 未初始化')
      return ctx.getResponse()
    }
  
    /**
     * 获取当前请求的 Storage 包装对象
     * @returns {SaStorage}
     */
    static async getStorage() {
      const ctx = await SaManager.getSaTokenContext()
      if (!ctx) throw new Error('SaTokenContext 未初始化')
      return await ctx.getStorage()
    }
  
    /**
     * 获取全局 SaApplication 对象
     * @returns {SaApplication}
     */
    static getApplication() {
      if (!SaApplication.defaultInstance) {
        throw new Error('SaApplication 未初始化')
      }
      return SaApplication.defaultInstance
    }
  }
  
  // 冻结类防止被修改
  Object.freeze(SaHolder)
  Object.freeze(SaHolder.prototype)
  
  export default SaHolder

