/**
 * Box 盒子类，用于存储 [ SaRequest、SaResponse、SaStorage ] 三个包装对象
 *
 * @author click33
 * @since 1.16.0
 */


/**
 * Sa-Token 上下文模型容器 JavaScript 实现
 * 对应 Java 类: cn.dev33.satoken.context.model.SaTokenContextModelBox
 * 
 * 封装请求、响应和存储对象，提供统一的访问接口
 */

class SaTokenContextModelBox {
    /**
     * 构造函数
     * @param {SaRequest} request 请求对象
     * @param {SaResponse} response 响应对象
     * @param {SaStorage} storage 存储对象
     */
    constructor(request, response, storage) {
        /**
         * 请求对象
         * @type {SaRequest}
         */
        this.request = request;

        /**
         * 响应对象
         * @type {SaResponse}
         */
        this.response = response;

        /**
         * 存储对象
         * @type {SaStorage}
         */
        this.storage = storage;
    }

    /**
     * 获取请求对象
     * @returns {SaRequest} 请求对象
     */
    getRequest() {
        return this.request;
    }

    /**
     * 设置请求对象
     * @param {SaRequest} request 请求对象
     * @returns {SaTokenContextModelBox} 对象自身（链式调用）
     */
    setRequest(request) {
        this.request = request;
        return this;
    }

    /**
     * 获取响应对象
     * @returns {SaResponse} 响应对象
     */
    getResponse() {
        return this.response;
    }

    /**
     * 设置响应对象
     * @param {SaResponse} response 响应对象
     * @returns {SaTokenContextModelBox} 对象自身（链式调用）
     */
    setResponse(response) {
        this.response = response;
        return this;
    }

    /**
     * 获取存储对象
     * @returns {SaStorage} 存储对象
     */
    getStorage() {
        return this.storage;
    }

    /**
     * 设置存储对象
     * @param {SaStorage} storage 存储对象
     * @returns {SaTokenContextModelBox} 对象自身（链式调用）
     */
    setStorage(storage) {
        this.storage = storage;
        return this;
    }

    /**
     * 转换为字符串表示
     * @returns {string} 对象的字符串描述
     */
    toString() {
        return `Box [request=${this.request}, response=${this.response}, storage=${this.storage}]`;
    }
}

export default SaTokenContextModelBox;