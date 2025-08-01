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
 * lambda 表达式辅助封装：根据 Boolean 变量，决定是否执行一个函数
 * 
 * @author click33
 * @since 1.13.0
 */

class IsRunFunction {
    /**
     * @param {boolean} isRun 控制变量，为 true 时允许执行 exe() 的函数
     */
    constructor(isRun) {
      /** @type {boolean} 执行条件标志 */
      this.isRun = isRun;
    }
  
    /**
     * 当 isRun == true 时执行函数（链式调用）
     * @param {Function} fn 要执行的函数
     * @returns {IsRunFunction} 自身实例（支持链式调用）
     */
    exe(fn) {
      if (this.isRun) {
        fn();
      }
      return this;
    }
  
    /**
     * 当 isRun == false 时执行函数（链式调用）
     * @param {Function} fn 要执行的函数
     * @returns {IsRunFunction} 自身实例（支持链式调用）
     */
    noExe(fn) {
      if (!this.isRun) {
        fn();
      }
      return this;
    }
  }

export default IsRunFunction;






