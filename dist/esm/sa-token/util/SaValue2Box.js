import SaFoxUtil from './SaFoxUtil.js';

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
 * 封装两个值的容器，方便取值、写值等操作，value1 和 value2 用逗号隔开，形如：123,abc
 *
 * @author click33 qirly
 * @since 1.35.0
 */
class SaValue2Box {

    /**
     * 第一个值
     */
    value1;

    /**
     * 第二个值
     */
    value2;


     /**
     * 直接提供两个值构建
     * @param {Object} value1 第一个值
     * @param {Object} value2 第二个值
     */
    constructor(value1, value2) {
        // 根据参数数量和类型来区分构造函数
        if (arguments.length === 1 && typeof value1 === 'string') {
            // 字符串构造函数
            this.initFromString(value1);
        } else {
            // 两个值的构造函数
            this.value1 = value1;
            this.value2 = value2;
        }
    }

    /**
     * 根据字符串构建，字符串形如：123,abc
     * @param {string} valueString 形如：123,abc
     */
    initFromString(valueString) {
        if(valueString == null){
            return;
        }
        const split = valueString.split(",");
        if (split.length === 0) ; else if (split.length === 1) {
            this.value1 = split[0];
        } else {
            this.value1 = split[0];
            this.value2 = split[1];
        }
    }

    /**
     * 获取第一个值
     * @return {Object} 第一个值
     */
    getValue1() {
        return this.value1;
    }

    /**
     * 获取第二个值
     * @return {Object} 第二个值
     */
    getValue2() {
        return this.value2;
    }

    /**
     * 设置第一个值
     * @param {Object} value1 第一个值
     */
    setValue1(value1) {
        this.value1 = value1;
    }

    /**
     * 设置第二个值
     * @param {Object} value2 第二个值
     */
    setValue2(value2) {
        this.value2 = value2;
    }

    /**
     * 判断第一个值是否为 null 或者空字符串
     * @return {Boolean} /
     */
    value1IsEmpty() {
        return SaFoxUtil.isEmpty(this.value1);
    }

    /**
     * 判断第二个值是否为 null 或者空字符串
     * @return {Boolean} /
     */
    value2IsEmpty() {
        return SaFoxUtil.isEmpty(this.value2);
    }

    /**
     * 获取第一个值，并转化为 String 类型
     * @return {String} /
     */
    getValue1AsString() {
        return this.value1 == null ? null : this.value1.toString();
    }

    /**
     * 获取第二个值，并转化为 String 类型
     * @return {String} /
     */
    getValue2AsString() {
        return this.value2 == null ? null : this.value2.toString();
    }

    /**
     * 获取第一个值，并转化为 long 类型
     * @return {Long} /
     */
    getValue1AsLong() {
        return parseInt(this.value1.toString());
    }

    /**
     * 获取第二个值，并转化为 long 类型
     * @return {Long} /
     */
    getValue2AsLong() {
        return parseInt(this.value2.toString());
    }

    /**
     * 获取第一个值，并转化为 long 类型，值不存在则返回默认值
     * @return {Long} /
     */
    getValue1AsLong(defaultValue) {
        // 这里如果改成三元表达式，会导致自动拆箱造成空指针异常，所以只能用 if-else
        if(this.value1 == null){
            return defaultValue;
        }
        return parseInt(this.value1.toString());
    }

    /**
     * 获取第二个值，并转化为 long 类型，值不存在则返回默认值
     * @return {Long} /
     */
    getValue2AsLong(defaultValue) {
        // 这里如果改成三元表达式，会导致自动拆箱造成空指针异常，所以只能用 if-else
        if(this.value2 == null){
            return defaultValue;
        }
        return parseInt(this.value2.toString());
    }

    /**
     * 该容器是否为无值状态，即：value1 无值、value2 无值
     * @return {Boolean} /
     */
    isNotValueState() {
        return this.value1IsEmpty() && this.value2IsEmpty();
    }

    /**
     * 该容器是否为单值状态，即：value1 有值、value2 == 无值
     * @return {Boolean} /
     */
    isSingleValueState() {
        return !this.value1IsEmpty() && this.value2IsEmpty();
    }

    /**
     * 该容器是否为双值状态，即：value2 有值 （在 value2 有值的情况下，即使 value1 无值，也视为双值状态）
     * @return {Boolean} /
     */
    isDoubleValueState() {
        return !this.value2IsEmpty();
    }

    /**
     * 获取两个值的字符串形式，形如：123,abc
     *
     * <br><br>
     * <pre>
     *     System.out.println(new SaValue2Box(1, 2));     // 1,2
     *     System.out.println(new SaValue2Box(null, null));   // null
     *     System.out.println(new SaValue2Box(1, null));   // 1
     *     System.out.println(new SaValue2Box(null, 2));  // ,2
     * </pre>
     * @return {String} /
     */
    // @Override
    toString() {
        if(this.value1 == null && this.value2 == null) {
            return null;
        }
        if(this.value1 != null && this.value2 == null) {
            return this.value1.toString();
        }
        return (this.value1 == null ? "" : this.value1.toString()) + "," + (this.value2 == null ? "" : this.value2.toString());
    }
}

export { SaValue2Box as default };
