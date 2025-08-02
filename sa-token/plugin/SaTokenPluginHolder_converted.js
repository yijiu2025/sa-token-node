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

import SaManager from "../SaManager";
import SaTokenPluginException from "../exception/SaTokenPluginException";
import SaTokenPlugin from "./SaTokenPlugin";
import SaTokenPluginHookModel from "./SaTokenPluginHookModel";

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const glob = promisify(require('glob'));

/**
 * Sa-Token 插件管理器，管理所有插件的加载与卸载
 *
 * @author click33
 * @since 1.41.0
 */
class SaTokenPluginHolder {

    /**
     * 默认实例，非单例模式，可替换
     */
    static instance = new SaTokenPluginHolder();


    // ------------------- 插件管理器初始化相关 -------------------

    /**
     * 是否已经加载过插件
     */
    isLoader = false;

    /**
     * SPI 文件所在目录名称
     */
    spiDir = "satoken";

    /**
     * 初始化加载所有插件（多次调用只会执行一次）
     */
    async init() {
        if(this.isLoader) {
            return;
        }
        await this.loaderPlugins();
        this.isLoader = true;
    }

    /**
     * 根据 SPI 机制加载所有插件
     * <p>
     *    加载所有 jar 下 /META-INF/satoken/ 目录下 cn.dev33.satoken.plugin.SaTokenPlugin 文件指定的实现类
     * </p>
     */
    async loaderPlugins() {
        SaManager.getLog().info("SPI plugin loading start ...");
        const plugins = await this._loaderPluginsBySpi(SaTokenPlugin, this.spiDir);
        for (const plugin of plugins) {
            this.installPlugin(plugin);
        }
        SaManager.getLog().info("SPI plugin loading end ...");
    }

    /**
     * 自定义 SPI 读取策略 （无状态函数）
     * @param serviceInterface SPI 接口
     * @param dirName 目录名称
     * @return /
     */
    async _loaderPluginsBySpi(serviceInterface, dirName) {
        const serviceInterfaceName = 'SaTokenPlugin';
        const spiPath = `META-INF/${dirName}/${serviceInterfaceName}`;
        const providers = [];

        try {
            // 在 Node.js 环境中模拟类加载器行为
            // 实际项目中可能需要调整此部分以适应具体的模块加载机制
            const files = await glob(spiPath, { root: process.cwd() });
            for (const file of files) {
                const content = await readFile(file, 'utf8');
                const lines = content.split('\n');
                for (let line of lines) {
                    line = line.trim();
                    // 忽略空行和注释行
                    if (line && !line.startsWith('#')) {
                        try {
                            // 尝试动态加载类
                            // 注意：在 Node.js 中，需要使用 require 来加载模块
                            // 这里假设类名与文件名相对应
                            const className = line;
                            const modulePath = path.resolve(__dirname, className);
                            const PluginClass = require(modulePath);
                            const instance = new PluginClass();
                            providers.push(instance);
                        } catch (e) {
                            throw new SaTokenPluginException(`SPI 插件加载失败: ${e.message}`, e);
                        }
                    }
                }
            }
        } catch (e) {
            throw new SaTokenPluginException(`SPI 插件加载失败: ${e.message}`, e);
        }
        return providers;
    }


    // ------------------- 插件管理 -------------------

    /**
     * 所有插件的集合 
     */
    pluginList = [];

    /**
     * 获取插件集合副本 (拷贝插件集合，而非每个插件实例)
     * @return /
     */
    getPluginListCopy() {
        return [...this.pluginList];
    }

    /**
     * 判断是否已经安装了指定插件
     *
     * @param pluginClass 插件类型
     * @return /
     */
    isInstalledPlugin(pluginClass) {
        for (const plugin of this.pluginList) {
            if (plugin.constructor === pluginClass) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取指定类型的插件
     * @param pluginClass /
     * @return /
     */
    getPlugin(pluginClass) {
        for (const plugin of this.pluginList) {
            if (plugin.constructor === pluginClass) {
                return plugin;
            }
        }
        return null;
    }

    /**
     * 消费指定集合的钩子函数，返回消费的数量
     * @param hooks /
     * @param pluginClass /
     */
    _consumeHooks(hooks, pluginClass) {
        let consumeCount = 0;
        for (let i = 0; i < hooks.length; i++) {
            const model = hooks[i];
            if(model.listenerClass === pluginClass) {
                model.executeFunction.execute(this.getPlugin(pluginClass));
                hooks.splice(i, 1);
                i--;
                consumeCount++;
            }
        }
        return consumeCount;
    }


    // ------------------- 插件 Install 与 Destroy -------------------

    /**
     * 安装指定插件
     * @param plugin /
     */
    installPlugin(plugin) {
        // 插件为空，拒绝安装
        if (plugin === null) {
            throw new SaTokenPluginException("插件不可为空");
        }

        // 插件已经被安装过了，拒绝再次安装
        if (this.isInstalledPlugin(plugin.constructor)) {
            throw new SaTokenPluginException(`插件 [ ${plugin.constructor.name} ] 已安装，不可重复安装`);
        }

        // 执行该插件的 install 前置钩子
        this._consumeHooks(this.beforeInstallHooks, plugin.constructor);

        // 插件安装
        const consumeCount = this._consumeHooks(this.installHooks, plugin.constructor);
        if (consumeCount === 0) {
            plugin.install();
        }

        // 执行该插件的 install 后置钩子
        this._consumeHooks(this.afterInstallHooks, plugin.constructor);

        // 添加到插件集合
        this.pluginList.push(plugin);

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 安装指定插件，根据插件类型
     * @param pluginClass /
     */
    installPluginByClass(pluginClass) {
        try {
            const plugin = new pluginClass();
            return this.installPlugin(plugin);
        } catch (e) {
            throw new SaTokenPluginException(e);
        }
    }

    /**
     * 卸载指定插件
     * @param plugin /
     */
    destroyPlugin(plugin) {
        // 插件为空，拒绝卸载
        if (plugin === null) {
            throw new SaTokenPluginException("插件不可为空");
        }

        // 插件未被安装，拒绝卸载
        if (!this.isInstalledPlugin(plugin.constructor)) {
            throw new SaTokenPluginException(`插件 [ ${plugin.constructor.name} ] 未安装，无法卸载`);
        }

        // 执行该插件的 destroy 前置钩子
        this._consumeHooks(this.beforeDestroyHooks, plugin.constructor);

        // 插件卸载
        const consumeCount = this._consumeHooks(this.destroyHooks, plugin.constructor);
        if (consumeCount === 0) {
            plugin.destroy();
        }

        // 执行该插件的 destroy 后置钩子
        this._consumeHooks(this.afterDestroyHooks, plugin.constructor);

        // 从插件集合中移除
        const index = this.pluginList.findIndex(p => p.constructor === plugin.constructor);
        if (index !== -1) {
            this.pluginList.splice(index, 1);
        }

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 卸载指定插件，根据插件类型
     * @param pluginClass /
     */
    destroyPluginByClass(pluginClass) {
        return this.destroyPlugin(this.getPlugin(pluginClass));
    }


    // ------------------- 插件 Install 钩子 -------------------

    /**
     * 插件 [ Install 钩子 ] 集合
     */
    installHooks = [];

    /**
     * 插件 [ Install 前置钩子 ] 集合
     */
    beforeInstallHooks = [];

    /**
     * 插件 [ Install 后置钩子 ] 集合
     */
    afterInstallHooks = [];

    /**
     * 注册指定插件的 [ Install 钩子 ]，1、同插件支持多次注册。2、如果插件已经安装完毕，则抛出异常。3、注册 Install 钩子的插件默认安装行为将不再执行
     * @param listenerClass /
     * @param executeFunction /
     */
    onInstall(listenerClass, executeFunction) {
        // 如果指定的插件已经安装完毕，则不再允许注册前置钩子函数
        if(this.isInstalledPlugin(listenerClass)) {
            throw new SaTokenPluginException(`插件 [ ${listenerClass.name} ] 已安装完毕，不允许再注册 Install 钩子函数`);
        }

        // 堆积到钩子函数集合
        this.installHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 注册指定插件的 [ Install 前置钩子 ]，1、同插件支持多次注册。2、如果插件已经安装完毕，则抛出异常
     * @param listenerClass /
     * @param executeFunction /
     */
    onBeforeInstall(listenerClass, executeFunction) {
        // 如果指定的插件已经安装完毕，则不再允许注册前置钩子函数
        if(this.isInstalledPlugin(listenerClass)) {
            throw new SaTokenPluginException(`插件 [ ${listenerClass.name} ] 已安装完毕，不允许再注册 Install 前置钩子函数`);
        }

        // 堆积到钩子函数集合
        this.beforeInstallHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 注册指定插件的 [ Install 后置钩子 ]，1、同插件支持多次注册。2、如果插件已经安装完毕，则立即执行该钩子函数
     * @param listenerClass /
     * @param executeFunction /
     */
    onAfterInstall(listenerClass, executeFunction) {
        // 如果指定的插件已经安装完毕，则立即执行该钩子函数
        if(this.isInstalledPlugin(listenerClass)) {
            executeFunction.execute(this.getPlugin(listenerClass));
            return this;
        }

        // 堆积到钩子函数集合
        this.afterInstallHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }


    // ------------------- 插件 Destroy 钩子 -------------------

    /**
     * 插件 [ Destroy 钩子 ] 集合
     */
    destroyHooks = [];

    /**
     * 插件 [ Destroy 前置钩子 ] 集合
     */
    beforeDestroyHooks = [];

    /**
     * 插件 [ Destroy 后置钩子 ] 集合
     */
    afterDestroyHooks = [];

    /**
     * 注册指定插件的 [ Destroy 钩子 ]，1、同插件支持多次注册。2、注册 Destroy 钩子的插件默认卸载行为将不再执行
     * @param listenerClass /
     * @param executeFunction /
     */
    onDestroy(listenerClass, executeFunction) {
        this.destroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 注册指定插件的 [ Destroy 前置钩子 ]，同插件支持多次注册
     * @param listenerClass /
     * @param executeFunction /
     */
    onBeforeDestroy(listenerClass, executeFunction) {
        this.beforeDestroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

    /**
     * 注册指定插件的 [ Destroy 后置钩子 ]，同插件支持多次注册
     * @param listenerClass /
     * @param executeFunction /
     */
    onAfterDestroy(listenerClass, executeFunction) {
        this.afterDestroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }
}

export default SaTokenPluginHolder;