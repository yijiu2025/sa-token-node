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

import SaTokenConfig from "./config/SaTokenConfig";
import SaTokenConfigFactory from "./config/SaTokenConfigFactory";
import SaTokenContext from "./context/SaTokenContext";
import SaTokenContextForThreadLocal from "./context/SaTokenContextForThreadLocal";
import SaTokenDao from "./dao/SaTokenDao";
import SaTokenDaoDefaultImpl from "./dao/SaTokenDaoDefaultImpl";
import SaErrorCode from "./error/SaErrorCode";
import SaTokenException from "./exception/SaTokenException";
import SaHttpTemplate from "./http/SaHttpTemplate";
import SaHttpTemplateDefaultImpl from "./http/SaHttpTemplateDefaultImpl";
import SaJsonTemplate from "./json/SaJsonTemplate";
import SaJsonTemplateDefaultImpl from "./json/SaJsonTemplateDefaultImpl";
import SaTokenEventCenter from "./listener/SaTokenEventCenter";
import SaLog from "./log/SaLog";
import SaLogForConsole from "./log/SaLogForConsole";
import SaSameTemplate from "./same/SaSameTemplate.js";
import SaTotpTemplate from "./secure/totp/SaTotpTemplate.js";
import SaSerializerTemplate from "./serializer/SaSerializerTemplate";
import SaSerializerTemplateForJson from "./serializer/impl/SaSerializerTemplateForJson";
import StpInterface from "./stp/StpInterface";
import StpInterfaceDefaultImpl from "./stp/StpInterfaceDefaultImpl";
import StpLogic from "./stp/StpLogic";
import StpUtil from "./stp/StpUtil";
import SaStrategy from "./strategy/SaStrategy";
import SaTempTemplate from "./temp/SaTempTemplate";
import SaFoxUtil from "./util/SaFoxUtil.js";


/**
 * 管理 Sa-Token 所有全局组件，可通过此类快速获取、写入各种全局组件对象
 *
 * @author click33
 * @since 1.18.0
 */
class SaManager {

    // ------------------- 配置相关 -------------------
  
    /**
     * 全局配置对象
     */
    static config = null; 

    /**
     * 设置全局配置
     * @param {SaTokenConfig} config 配置对象
     */
    static setConfig(config) {
        this.setConfigMethod(config);

        // 打印 banner 
        if (config != null && config.getIsPrint()) {
            SaFoxUtil.printSaToken(); 
        }

        // 自动判断是否启用彩色日志,如果此 config 对象没有配置 isColorLog 的值，则框架为它自动判断一下
        if (config != null && config.getIsLog() != null && config.getIsLog() && config.getIsColorLog() == null) {
            config.setIsColorLog(SaFoxUtil.isCanColorLog());
        }

        // 触发全局配置变更事件 $$ 全局事件 
        SaTokenEventCenter.doSetConfig(config); 

        // 调用一次 StpUtil 中的方法，保证其可以尽早的初始化 StpLogic
        StpUtil.getLoginType(); 
    }


    /**
     * 内部方法 - 设置配置
     * @param {SaTokenConfig} config 配置对象
     */
    static setConfigMethod(config) {
        this.config = config;
    }

    /**
     * 获取 Sa-Token 的全局配置信息 (双检锁单例模式)
     * @return {SaTokenConfig} 全局配置信息
     */
    static getConfig() {
        if (this.config === null) {
            
            this.setConfigMethod(SaTokenConfigFactory.createConfig());
        }
        return this.config;
    }



    // ------------------- 持久化组件 -------------------
  
    /**
     * 持久化组件
     */
    static saTokenDao = null;

    /**
     * 设置持久化组件
     * @param {SaTokenDao} saTokenDao 持久化组件实例
     */
    static setSaTokenDao(saTokenDao) {
        this.setSaTokenDaoMethod(saTokenDao);
        SaTokenEventCenter.doRegisterComponent("SaTokenDao", saTokenDao);
    }

    /**
     * 内部方法 - 设置持久化组件
     * @param {SaTokenDao} saTokenDao 持久化组件实例
     */
    static setSaTokenDaoMethod(saTokenDao) {
        if (this.saTokenDao != null) {
            this.saTokenDao.destroy();
        }
        this.saTokenDao = saTokenDao;
        if (this.saTokenDao != null) {
            this.saTokenDao.init();
        }
    }

    /**
     * 获取持久化组件 (双检锁单例模式)
     * @return {SaTokenDao} 持久化组件实例
     */
    static getSaTokenDao() {
        if (this.saTokenDao == null) {
            this.setSaTokenDaoMethod(new SaTokenDaoDefaultImpl());
        }
        return this.saTokenDao;
    }



    // ------------------- 权限数据源组件 -------------------
    
    /**
     * 权限数据源组件
     */
    static stpInterface = null;

    /**
     * 设置权限数据源组件
     * @param {StpInterface} stpInterface 权限数据源实例
     */
    static setStpInterface(stpInterface) {
        this.stpInterface = stpInterface;
        SaTokenEventCenter.doRegisterComponent("StpInterface", stpInterface);
    }

    /**
     * 获取权限数据源组件 (双检锁单例模式)
     * @return {StpInterface} 权限数据源实例
     */
    static getStpInterface() {
        if (this.stpInterface == null) {
            this.stpInterface = new StpInterfaceDefaultImpl(); 
        }
        return this.stpInterface;
    }

    // ------------------- 上下文对象 -------------------
    
    /**
     * 上下文 SaTokenContext
     */
    static saTokenContext = null;

    /**
     * 设置上下文对象
     * @param {SaTokenContext} saTokenContext 上下文实例
     */
    static setSaTokenContext(saTokenContext) {
        this.saTokenContext = saTokenContext;
        SaTokenEventCenter.doRegisterComponent("SaTokenContext", saTokenContext);
    }

    /**
     * 获取上下文对象 (双检锁单例模式)
     * @return {SaTokenContext} 上下文实例
     */
    static getSaTokenContext() {
        if (this.saTokenContext == null) {
            this.saTokenContext = new SaTokenContextForThreadLocal(); 
        }
        return this.saTokenContext;
    }

    // ------------------- 临时 token 认证模块 -------------------
  
    /**
     * 临时 token 认证模块
     */
    static saTempTemplate = null;

    /**
     * 设置临时 token 认证模块
     * @param {SaTempTemplate} saTempTemplate 临时 token 认证实例
     */
    static setSaTempTemplate(saTempTemplate) {
        this.saTempTemplate = saTempTemplate;
        SaTokenEventCenter.doRegisterComponent("SaTempTemplate", saTempTemplate);
    }

    /**
     * 获取临时 token 认证模块 (双检锁单例模式)
     * @return {SaTempTemplate} 临时 token 认证实例
     */
    static getSaTempTemplate() {
        if (!this.saTempTemplate) {
            this.saTempTemplate = new SaTempTemplate(); 
        }
        return this.saTempTemplate;
    }


    // ------------------- JSON 转换器 -------------------
  
    /**
     * JSON 转换器
     */
    static saJsonTemplate = null;

    /**
     * 设置 JSON 转换器
     * @param {SaJsonTemplate} saJsonTemplate JSON 转换器实例
     */
    static setSaJsonTemplate(saJsonTemplate) {
        this.saJsonTemplate = saJsonTemplate;
        SaTokenEventCenter.doRegisterComponent("SaJsonTemplate", saJsonTemplate);
    }

    /**
     * 获取 JSON 转换器 (双检锁单例模式)
     * @return {SaJsonTemplate} JSON 转换器实例
     */
    static getSaJsonTemplate() {
        if (this.saJsonTemplate == null) {
            this.saJsonTemplate = new SaJsonTemplateDefaultImpl(); 
        }
        return this.saJsonTemplate;
    }


    // ------------------- HTTP 转换器 -------------------
  
    /**
     * HTTP 转换器
     */
    static saHttpTemplate = null;

    /**
     * 设置 HTTP 转换器
     * @param {SaHttpTemplate} saHttpTemplate HTTP 转换器实例
     */
    static setSaHttpTemplate(saHttpTemplate) {
        this.saHttpTemplate = saHttpTemplate;
        SaTokenEventCenter.doRegisterComponent("SaHttpTemplate", saHttpTemplate);
    }

    /**
     * 获取 HTTP 转换器 (双检锁单例模式)
     * @return {SaHttpTemplate} HTTP 转换器实例
     */
    static getSaHttpTemplate() {
        if (this.saHttpTemplate == null) {
            this.saHttpTemplate = new SaHttpTemplateDefaultImpl(); 
        }
        return this.saHttpTemplate;
    }


    // ------------------- 序列化器 -------------------
  
    /**
     * 序列化器
     */
    static saSerializerTemplate = null;

    /**
     * 设置序列化器
     * @param {SaSerializerTemplate} saSerializerTemplate 序列化器实例
     */
    static setSaSerializerTemplate(saSerializerTemplate) {
        this.saSerializerTemplate = saSerializerTemplate;
        SaTokenEventCenter.doRegisterComponent("SaSerializerTemplate", saSerializerTemplate);
    }

    /**
     * 获取序列化器 (双检锁单例模式)
     * @return {SaSerializerTemplate} 序列化器实例
     */
    static getSaSerializerTemplate() {
        if (this.saSerializerTemplate == null) {
            this.saSerializerTemplate = new SaSerializerTemplateForJson(); // 假设 SaSerializerTemplateForJson 已定义
        }
        return this.saSerializerTemplate;
    }


    // ------------------- Same-Token 同源系统认证模块 -------------------

    /**
     * Same-Token 同源系统认证模块
     */
    static saSameTemplate = null;

    /**
     * 设置 Same-Token 认证模块
     * @param {SaSameTemplate} saSameTemplate Same-Token 实例
     */
    static setSaSameTemplate(saSameTemplate) {
        this.saSameTemplate = saSameTemplate;
        SaTokenEventCenter.doRegisterComponent("SaSameTemplate", saSameTemplate);
    }

    /**
     * 获取 Same-Token 认证模块 (双检锁单例模式)
     * @return {SaSameTemplate} Same-Token 实例
     */
    static getSaSameTemplate() {
        if (this.saSameTemplate == null) {
            this.saSameTemplate = new SaSameTemplate(); // 假设 SaSameTemplate 已定义
        }
        return this.saSameTemplate;
    }


    // ------------------- 日志输出器 -------------------
  
    /**
     * 日志输出器 
     */
    static log = new SaLogForConsole();

    /**
     * 设置日志输出器
     * @param {SaLog} log 日志输出器实例
     */
    static setLog(log) {
        this.log = log;
        SaTokenEventCenter.doRegisterComponent("SaLog", log);
    }

    /**
     * 获取日志输出器
     * @return {SaLog} 日志输出器实例
     */
    static getLog() {
        return this.log;
    }


    // ------------------- TOTP 算法类 -------------------
    //支持 生成/验证 动态一次性密码
  
    /**
     * TOTP 算法类，支持 生成/验证 动态一次性密码
     */
    static totpTemplate = null;

    /**
     * 设置 TOTP 算法类
     * @param {SaTotpTemplate} totpTemplate TOTP 实例
     */
    static setSaTotpTemplate(totpTemplate) {
        this.totpTemplate = totpTemplate;
        SaTokenEventCenter.doRegisterComponent("SaTotpTemplate", totpTemplate);
    }

    /**
     * 获取 TOTP 算法类 (双检锁单例模式)
     * @return {SaTotpTemplate} TOTP 实例
     */
    static getSaTotpTemplate() {
        if (this.totpTemplate == null) {
            this.totpTemplate = new SaTotpTemplate(); 
        }
        return this.totpTemplate;
    }



    // ------------------- StpLogic 相关 -------------------
  
    /**
     * StpLogic 集合, 记录框架所有成功初始化的 StpLogic
     */
    static stpLogicMap = new Map();

    /**
     * 向全局集合中添加 StpLogic 向全局集合中 put 一个 StpLogic 
     * @param {StpLogic} stpLogic StpLogic 实例
     */
    static putStpLogic(stpLogic) {
        this.stpLogicMap.set(stpLogic.getLoginType(), stpLogic);
    }

    /**
     * 从全局集合中移除 一个 StpLogic
     * @param {string} loginType 登录类型
     */
    static removeStpLogic(loginType) {
        this.stpLogicMap.delete(loginType);
    }


    /**
     * 根据 loginType 获取 StpLogic (不存在则自动创建)
     * @param {string} loginType 登录类型
     * @return {StpLogic} StpLogic 实例
     */
    // getStpLogic(loginType) {
    //     return this.getStpLogic(loginType, true);
    // }



    /**
     * 根据 loginType 获取 StpLogic
     * @param {string} loginType 登录类型
     * @param {boolean} isCreate 当不存在时是否自动创建
     * @return {StpLogic} StpLogic 实例
     * @throws {SaTokenException} 当 isCreate=false 且 StpLogic 不存在时抛出异常
     */
    static getStpLogic(loginType, isCreate = true) {
        // 如果type为空则返回框架默认内置的 
        if (loginType && loginType.length > 0) {
            // 从集合中获取
            let stpLogic = this.stpLogicMap.get(loginType);
            if (stpLogic == null) {
                
                // isCreate=false时，严格校验模式：抛出异常
                if (!isCreate) {
                    throw new SaTokenException("未能获取对应StpLogic，type="+ loginType).setCode(SaErrorCode.CODE_10002);
                }
                // isCreate=true时，自创建模式：自动创建并返回
                stpLogic = this.stpLogicMap.get(loginType);
                if (stpLogic == null) {
                    stpLogic = SaStrategy.instance.createStpLogic(loginType);  
                }
                
            }
            return stpLogic;
        } else {
            return StpUtil.stpLogic; 
        }
    }
}

export default SaManager;