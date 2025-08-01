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

/*
 * Sa-Token 注解处理器接口 JavaScript 版本
 * 原 Java 接口: cn.dev33.satoken.annotation.handler.SaAnnotationHandlerInterface
 * 转换说明: 将 Java 接口转换为 JavaScript 的抽象类/接口混合形式
 */

/**
 * 所有注解处理器的父接口
 * 
 * 在 JavaScript 中，由于缺乏原生接口支持，我们使用抽象类+方法实现类似效果
 * 
 * @template T 注解类型 (使用 JSDoc 模拟泛型)
 */
class SaAnnotationHandlerInterface {
    /**
     * 构造函数 - 确保子类实现了必要方法
     */
    constructor() {
      if (new.target === SaAnnotationHandlerInterface) {
        throw new Error('SaAnnotationHandlerInterface is abstract and cannot be instantiated directly');
      }
  
      // 检查子类是否实现了必要方法
      const proto = Object.getPrototypeOf(this);
      if (proto.checkMethod === SaAnnotationHandlerInterface.prototype.checkMethod) {
        throw new Error('Subclass must implement checkMethod()');
      }
      if (proto.getHandlerAnnotationClass === SaAnnotationHandlerInterface.prototype.getHandlerAnnotationClass) {
        throw new Error('Subclass must implement getHandlerAnnotationClass()');
      }
    }
  
    /**
     * 获取所要处理的注解类型
     * @abstract
     * @returns {Function} 返回注解类的构造函数 (模拟 Java 的 Class<T>)
     */
    getHandlerAnnotationClass() {
      throw new Error('Method getHandlerAnnotationClass() must be implemented');
    }
  
    /**
     * 所需要执行的校验方法 (默认实现)
     * @param {Object} at 注解对象
     * @param {Object} element 被标注的注解的元素(方法/类)引用
     */
    check(at, element) {
      // 类型安全检查
      const annotationClass = this.getHandlerAnnotationClass();
      if (!(at instanceof annotationClass)) {
        throw new Error(`Annotation type mismatch, expected ${annotationClass.name}`);
      }
  
      // 调用具体实现
      this.checkMethod(at, element);
    }
  
    /**
     * 所需要执行的校验方法（子类必须实现）
     * @abstract
     * @param {T} at 注解对象
     * @param {Object} element 被标注的注解的元素(方法/类)引用
     */
    checkMethod(at, element) {
      throw new Error('Method checkMethod() must be implemented');
    }
  }
  
  // 导出接口
  export default SaAnnotationHandlerInterface;