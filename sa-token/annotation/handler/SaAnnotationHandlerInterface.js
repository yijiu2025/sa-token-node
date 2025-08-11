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
 * 所有注解处理器的父接口
 *
 * @author click33 qirly
 * @since 2025/8/10
 * @template T 注解类型
 */
class SaAnnotationHandlerInterface {

    /**
     * 获取所要处理的注解类型
     * @returns {Function} 返回注解类的构造函数
     */
    getHandlerAnnotationClass() {
      throw new Error('Method getHandlerAnnotationClass() must be implemented');
    }

    /**
     * 所需要执行的校验方法
     * @param {Annotation} at 注解对象
     * @param {Object} element 被标注的注解的元素(方法/类)引用
     */
    check(at, element) {
        this.checkMethod(at, element);
    }

    /**
     * 所需要执行的校验方法（转换类型后）
     * @param {T} at 注解对象
     * @param {Object} element 被标注的注解的元素(方法/类)引用
     */
    checkMethod(at, element) {
        throw new Error('Method checkMethod() must be implemented');
    }

}

export default SaAnnotationHandlerInterface;