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
import SaTokenContext from "./config/SaTokenConfig";
import SaTokenContextForThreadLocal from "./config/SaTokenConfig";
import SaTokenDao from "./config/SaTokenConfig";
import SaTokenDaoDefaultImpl from "./config/SaTokenConfig";
import SaErrorCode from "./config/SaTokenConfig";
import SaTokenException from "./config/SaTokenConfig";
import SaHttpTemplate from "./config/SaTokenConfig";
import SaHttpTemplateDefaultImpl from "./config/SaTokenConfig";
import SaJsonTemplate from "./config/SaTokenConfig";
import SaJsonTemplateDefaultImpl from "./config/SaTokenConfig";
import SaTokenEventCenter from "./config/SaTokenConfig";
import SaLog from "./config/SaTokenConfig";
import SaLogForConsole from "./config/SaTokenConfig";
import SaSameTemplate from "./config/SaTokenConfig";
import SaTotpTemplate from "./config/SaTokenConfig";
import SaSerializerTemplate from "./config/SaTokenConfig";
import SaSerializerTemplateForJson from "./config/SaTokenConfig";
import StpInterface from "./config/SaTokenConfig";
import StpInterfaceDefaultImpl from "./config/SaTokenConfig";
import StpLogic from "./config/SaTokenConfig";
import StpUtil from "./config/SaTokenConfig";
import SaStrategy from "./config/SaTokenConfig";
import SaTempTemplate from "./config/SaTokenConfig";
import SaFoxUtil from "./util/SaFoxUtil.js";


/**
 * 管理 Sa-Token 所有全局组件，可通过此类快速获取、写入各种全局组件对象
 *
 * @author click33
 * @since 1.18.0
 */
class SaManager {

    constructor() {
        // 确保单例
        if (!SaManager.instance) {
          // 全局配置对象
          this.config = null;
          
          // 持久化组件
          this.saTokenDao = null;
          
          // 权限数据源组件
          this.stpInterface = null;
          
          // 上下文对象
          this.saTokenContext = null;
          
          // 临时 token 认证模块
          this.saTempTemplate = null;
          
          // JSON 转换器
          this.saJsonTemplate = null;
          
          // HTTP 转换器
          this.saHttpTemplate = null;
          
          // 序列化器
          this.saSerializerTemplate = null;
          
          // Same-Token 同源系统认证模块
          this.saSameTemplate = null;
          
          // 日志输出器 (默认为控制台输出)
          this.log = new SaLogForConsole();
          
          // TOTP 算法类
          this.totpTemplate = null;
          
          // StpLogic 集合, 记录框架所有成功初始化的 StpLogic
          this.stpLogicMap = new Map();
          
          SaManager.instance = this;
        }
        return SaManager.instance;
    }


    // ------------------- 配置相关 -------------------
  
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

const saManager = new SaManager();
export const log = saManager.log;
Object.freeze(saManager);
export default saManager;