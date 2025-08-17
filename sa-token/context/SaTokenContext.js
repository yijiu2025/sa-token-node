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

import SaRequest from "./model/SaRequest.js";
import SaResponse from "./model/SaResponse.js";
import SaStorage from "./model/SaStorage.js"; 
import SaTokenContextModelBox from "./model/SaTokenContextModelBox.js";

/**
 * Sa-Token 上下文处理器
 *
 * <p> 上下文处理器封装了当前应用环境的底层操作，是 Sa-Token 对接不同 web 框架的关键，详细可参考在线文档 “自定义 SaTokenContext 指南”章节 </p>
 *
 * @author click33 qirly
 * @since 1.16.0
 */

class SaTokenContext {
    /**
     * 初始化上下文（需子类实现）
     * @param {SaRequest} req 
     * @param {SaResponse} res 
     * @param {SaStorage} stg 
     */
    setContext(req, res, stg) {
      throw new Error('抽象方法必须被实现')
    }
  
    /**
     * 清除上下文（需子类实现）
     */
    clearContext() {
      throw new Error('抽象方法必须被实现')
    }
  
    /**
     * 判断当前上下文是否可用（需子类实现）
     * @returns {boolean}
     */
    isValid() {
      throw new Error('抽象方法必须被实现')
    }
  
    /**
     * 获取 ModelBox 对象（需子类实现）
     * @returns {SaTokenContextModelBox}
     */
    getModelBox() {
      throw new Error('抽象方法必须被实现')
    }
  
    /**
     * 获取当前上下文的 Request 包装对象
     * @returns {SaRequest}
     */
    getRequest() {
      return this.getModelBox().getRequest()
    }
  
    /**
     * 获取当前上下文的 Response 包装对象
     * @returns {SaResponse}
     */
    getResponse() {
      return this.getModelBox().getResponse()
    }
  
    /**
     * 获取当前上下文的 Storage 包装对象
     * @returns {SaStorage}
     */
    getStorage() {
      return this.getModelBox().getStorage()
    }
  }
  
  // 冻结原型防止修改
  Object.freeze(SaTokenContext.prototype)
  
  export default SaTokenContext