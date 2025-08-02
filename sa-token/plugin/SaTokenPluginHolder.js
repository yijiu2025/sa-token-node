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
import SaTokenPluginHookFunction from "../fun/hooks/SaTokenPluginHookFunction";
import SaTokenPlugin from "./SaTokenPlugin";

import SaTokenPluginHookModel from "../plugin/SaTokenPluginHookModel";

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
	 * <p>
	 *    加载所有 node_modules 目录下 SaTokenPlugin 文件指定的实现类
	 * </p>
	 */
	async loaderPlugins() {
		SaManager.getLog().info("SPI plugin loading start ...");
		//const plugins = await this._loaderPluginsBySpi(SaTokenPlugin, this.spiDir);
		const plugins = await this._loaderPluginsByNpm();
		for (const plugin of plugins) {
			this.installPlugin(plugin);
		}
		SaManager.getLog().info("SPI plugin loading end ...");
	}

	/**
	 * 根据node特性重新设计插件安装方式，符合Node.js生态习惯 ：npm是Node.js标准的包管理工具，用户熟悉其安装和更新流程
	 * 自动依赖管理 ：npm能自动处理插件的依赖关系，避免版本冲突
	 * 版本控制 ：支持语义化版本控制，方便插件更新和回退
	 * 安装便捷 ：用户只需执行 npm install <plugin-name> 即可完成安装
	 * 集成性好 ：可与package.json无缝集成，便于项目迁移和共享
	 * 插件生态 ：npm 生态提供了丰富的插件库，用户可以方便地找到并使用符合项目需求的插件
	 * 插件加载功能设计：
	 * 基于Node.js特性，建议采用以下插件加载机制：
	 * 1. 约定优于配置 ：
	 * 		规定插件必须遵循特定命名规范，如 sa-token-plugin-<name>
	 * 		插件需在package.json中声明 satoken-plugin 类型
	 * 2. 自动发现机制 ：
	 * 3. 手动注册机制 ：
	 * 4. 插件标准化接口 ：
	 * @param {Class<T>} PluginInterface 插件 接口
	 * @param {string} dirName 目录名称
	 * @return {Promise<T[]>} 插件实例列表
	 * @template T
	 */
	async _loaderPluginsByNpm() {
		const plugins = [];
  		// 1. 扫描node_modules中符合命名规范的包
		const pkgDirs = await glob('node_modules/sa-token-plugin-*', { absolute: true });
		for (const dir of pkgDirs) {
			try {
				// 2. 读取插件的package.json
				const pkgPath = path.join(dir, 'package.json');
				const pkg = require(pkgPath);
				// 3. 验证是否为sa-token插件
				if (pkg.keywords && pkg.keywords.includes('sa-token-plugin')) {
					// 4. 加载插件主模块
					const mainModule = path.join(dir, pkg.main || 'index.js');
					const PluginClass = require(mainModule);
					// 5. 实例化并添加到插件列表
					plugins.push(new PluginClass());
				}
			} catch (e) {
				throw new SaTokenPluginException(`加载插件失败: ${dir}, 错误: ${e.message}`, e);
			}
		}
		return plugins;
	}

	/**
	 * 自定义 SPI 读取策略 （无状态函数）  
	 
	 * @param PluginInterface 插件接口
	 * @param dirName 目录名称
	 * @return /
	 * @param <T> /
	 */
	// async function discoverPlugins() {
	// 	const plugins = [];
	// 	// 1. 扫描node_modules中符合命名规范的包
	// 	const pkgDirs = await glob('node_modules/sa-token-plugin-*', { absolute: true });
	// 	for (const dir of pkgDirs) {
	// 		try {
	// 		// 2. 读取插件的package.json
	// 		const pkgPath = path.join(dir, 'package.json');
	// 		const pkg = require(pkgPath);
	// 		// 3. 验证是否为sa-token插件
	// 		if (pkg.keywords && pkg.keywords.includes('sa-token-plugin')) {
	// 			// 4. 加载插件主模块
	// 			const mainModule = path.join(dir, pkg.main || 'index.js');
	// 			const PluginClass = require(mainModule);
	// 			// 5. 实例化并添加到插件列表
	// 			plugins.push(new PluginClass());
	// 		}
	// 		} catch (e) {
	// 		console.warn(`加载插件失败: ${dir}, 错误: ${e.message}`);
	// 		}
	// 	}
	// 	return plugins;
	// }



	// async _loaderPluginsBySpi(serviceInterface, dirName) {

	// 	// String path = "META-INF/" + dirName + "/" + serviceInterface.getName();
	// 	// List<T> providers = new ArrayList<>();
    //     const serviceInterface = 'SaTokenPlugin';
    //     const spiPath = `META-INF/${dirName}/${serviceInterface}`;
        

	// 	try {
	// 		ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
	// 		Enumeration<URL> resources = classLoader.getResources(path);
	// 		while (resources.hasMoreElements()) {
	// 			URL url = resources.nextElement();
	// 			try (InputStream is = url.openStream()) {
	// 				BufferedReader reader = new BufferedReader(new InputStreamReader(is));
	// 				String line;
	// 				while ((line = reader.readLine()) != null) {
	// 					line = line.trim();
	// 					// 忽略空行和注释行
	// 					if (!line.isEmpty() && !line.startsWith("#")) {
	// 						Class<?> clazz = Class.forName(line, true, classLoader);
	// 						T instance = serviceInterface.cast(clazz.getDeclaredConstructor().newInstance());
	// 						providers.add(instance);
	// 					}
	// 				}
	// 			} catch (Exception e) {
	// 				throw new SaTokenPluginException("SPI 插件加载失败: " + e.getMessage(), e);
	// 			}
	// 		}
	// 	} catch (Exception e) {
	// 		throw new SaTokenPluginException("SPI 插件加载失败: " + e.getMessage(), e);
	// 	}
	// 	return providers;
	// }
	// 	三、改进现有SPI加载机制
	// 如果需要保留SPI机制，可改进为：

	// 1. 1.
	//    使用Node.js的 require.resolve 来查找SPI配置文件
	// 2. 2.
	//    支持从 node_modules 和项目自定义目录加载SPI配置
	// 3. 3.
	//    实现缓存机制，避免重复加载
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
	 * 所有插件的集合{List<SaTokenPlugin>}
	 */
	//private final List<SaTokenPlugin> pluginList = new ArrayList<>();
	pluginList = [];

	/**
	 * 获取插件集合副本 (拷贝插件集合，而非每个插件实例)
	 * @return /
	 */
	// public synchronized List<SaTokenPlugin> getPluginListCopy() {
	// 	return new ArrayList<>(pluginList);
	// }
	getPluginListCopy() {
        return [...this.pluginList];
    }

	/**
	 * 判断是否已经安装了指定插件
	 *
	 * @param {Class<T>} pluginClass 插件类型
	 * @return {boolean} /
	 */
	// public synchronized<T extends SaTokenPlugin> boolean isInstalledPlugin(Class<T> pluginClass) {
	// 	for (SaTokenPlugin plugin : pluginList) {
	// 		if (plugin.getClass().equals(pluginClass)) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }
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
	 * @param <T> /
	 */
	// public synchronized<T extends SaTokenPlugin> T getPlugin(Class<T> pluginClass) {
	// 	for (SaTokenPlugin plugin : pluginList) {
	// 		if (plugin.getClass().equals(pluginClass)) {
	// 			return (T) plugin;
	// 		}
	// 	}
	// 	return null;
	// }
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
	 * @param {Class<T>} pluginClass /
	 * @param {List<SaTokenPluginHookModel<? extends SaTokenPlugin>>} hooks /
	 * @param <T> /
	 */
	// protected synchronized <T extends SaTokenPlugin> int _consumeHooks(List<SaTokenPluginHookModel<? extends SaTokenPlugin>> hooks, Class<T> pluginClass) {
	// 	int consumeCount = 0;
	// 	for (int i = 0; i < hooks.size(); i++) {
	// 		SaTokenPluginHookModel<? extends SaTokenPlugin> model = hooks.get(i);
	// 		if(model.listenerClass.equals(pluginClass)) {
	// 			model.executeFunction.execute(getPlugin(pluginClass));
	// 			hooks.remove(i);
	// 			i--;
	// 			consumeCount++;
	// 		}
	// 	}
	// 	return consumeCount;
	// }
	_consumeHooks(hooks, pluginClass) {
        let consumeCount = 0;
        for (let i = 0; i < hooks.length; i++) {
			//SaTokenPluginHookModel<? extends SaTokenPlugin>
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
	 * @param {SaTokenPlugin} plugin /
	 * @return {SaTokenPluginHolder} /
	 */
	// public synchronized SaTokenPluginHolder installPlugin(SaTokenPlugin plugin) {

	// 	// 插件为空，拒绝安装
	// 	if (plugin == null) {
	// 		throw new SaTokenPluginException("插件不可为空");
	// 	}

	// 	// 插件已经被安装过了，拒绝再次安装
	// 	if (isInstalledPlugin(plugin.getClass())) {
	// 		throw new SaTokenPluginException("插件 [ " + plugin.getClass().getCanonicalName() + " ] 已安装，不可重复安装");
	// 	}

	// 	// 执行该插件的 install 前置钩子
	// 	_consumeHooks(beforeInstallHooks, plugin.getClass());

	// 	// 插件安装
	// 	int consumeCount = _consumeHooks(installHooks, plugin.getClass());
	// 	if (consumeCount == 0) {
	// 		plugin.install();
	// 	}

	// 	// 执行该插件的 install 后置钩子
	// 	_consumeHooks(afterInstallHooks, plugin.getClass());

	// 	// 添加到插件集合
	// 	pluginList.add(plugin);

	// 	// 返回对象自身，支持连缀风格调用
	// 	return this;
	// }
	/**
	 * 安装插件（支持传入插件实例或插件类）
	 * @param {Object|Function} plugin 插件实例或插件类
	 */
	installPlugin(plugin) {
        // 判断参数类型，如果是构造函数则先创建实例
        if (typeof plugin === 'function') {
            try {
                plugin = new plugin();
            } catch (e) {
                throw new SaTokenPluginException(e);
            }
        }

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
	 * 卸载指定插件
	 * @param {SaTokenPlugin} plugin /
	 * @returns {SaTokenPluginHolder} /
	 */
	// public synchronized SaTokenPluginHolder destroyPlugin(SaTokenPlugin plugin) {

	// 	// 插件为空，拒绝卸载
	// 	if (plugin == null) {
	// 		throw new SaTokenPluginException("插件不可为空");
	// 	}

	// 	// 插件未被安装，拒绝卸载
	// 	if (!isInstalledPlugin(plugin.getClass())) {
	// 		throw new SaTokenPluginException("插件 [ " + plugin.getClass().getCanonicalName() + " ] 未安装，无法卸载");
	// 	}

	// 	// 执行该插件的 destroy 前置钩子
	// 	_consumeHooks(beforeDestroyHooks, plugin.getClass());

	// 	// 插件卸载
	// 	int consumeCount = _consumeHooks(destroyHooks, plugin.getClass());
	// 	if (consumeCount == 0) {
	// 		plugin.destroy();
	// 	}

	// 	// 执行该插件的 destroy 后置钩子
	// 	_consumeHooks(afterDestroyHooks, plugin.getClass());

	// 	// 返回对象自身，支持连缀风格调用
	// 	return this;
	// }
	/**
	 * 卸载插件（支持传入插件实例或插件类）
	 * @param {Object|Function} plugin 插件实例或插件类
	 * @returns {SaTokenPluginHolder} /
	 */
	destroyPlugin(plugin) {
        // 判断参数类型，如果是构造函数则先获取实例
        if (typeof plugin === 'function') {
            plugin = this.getPlugin(plugin);
            // if (plugin === null) {
            //     throw new SaTokenPluginException(`插件 [ ${plugin.name} ] 未安装，无法卸载`);
            // }
        }

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
	// public synchronized<T extends SaTokenPlugin> SaTokenPluginHolder destroyPlugin(Class<T> pluginClass) {
	// 	return destroyPlugin(getPlugin(pluginClass));
	// }


	// ------------------- 插件 Install 钩子 -------------------

	/**
	 * 插件 [ Install 钩子 ] 集合 {List<SaTokenPluginHookModel<? extends SaTokenPlugin>> }
	 */
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> installHooks = new ArrayList<>();
	installHooks = [];

	/**
	 * 插件 [ Install 前置钩子 ] 集合
	 */
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> beforeInstallHooks = new ArrayList<>();
	beforeInstallHooks = [];
	/**
	 * 插件 [ Install 后置钩子 ] 集合
	 */
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> afterInstallHooks = new ArrayList<>();
	afterInstallHooks = [];
	/**
	 * 注册指定插件的 [ Install 钩子 ]，1、同插件支持多次注册。2、如果插件已经安装完毕，则抛出异常。3、注册 Install 钩子的插件默认安装行为将不再执行
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
	 * @returns {SaTokenPluginHolder} /
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
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
	 * @returns {SaTokenPluginHolder} /
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
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
	 * @returns {SaTokenPluginHolder} /
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
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> destroyHooks = new ArrayList<>();
	destroyHooks = [];

	/**
	 * 插件 [ Destroy 前置钩子 ] 集合
	 */
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> beforeDestroyHooks = new ArrayList<>();
	beforeDestroyHooks = [];

	/**
	 * 插件 [ Destroy 后置钩子 ] 集合
	 */
	//private final List<SaTokenPluginHookModel<? extends SaTokenPlugin>> afterDestroyHooks = new ArrayList<>();
	afterDestroyHooks = [];

	/**
	 * 注册指定插件的 [ Destroy 钩子 ]，1、同插件支持多次注册。2、注册 Destroy 钩子的插件默认卸载行为将不再执行
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
	 * @returns {SaTokenPluginHolder} /
	 */
	onDestroy(listenerClass, executeFunction) {
        this.destroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

	/**
	 * 注册指定插件的 [ Destroy 前置钩子 ]，同插件支持多次注册
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
	 * @returns {SaTokenPluginHolder} /
	 */
	onBeforeDestroy(listenerClass, executeFunction) {
        this.beforeDestroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));

        // 返回对象自身，支持连缀风格调用
        return this;
    }

	/**
	 * 注册指定插件的 [ Destroy 后置钩子 ]，同插件支持多次注册
	 * @param {Class<T>} listenerClass /
	 * @param {SaTokenPluginHookFunction<T>} executeFunction /
	 * @param <T> /
     * @returns {SaTokenPluginHolder}
	 */
	// public synchronized<T extends SaTokenPlugin> SaTokenPluginHolder onAfterDestroy(Class<T> listenerClass, SaTokenPluginHookFunction<T> executeFunction) {
	// 	afterDestroyHooks.add(new SaTokenPluginHookModel<T>(listenerClass, executeFunction));

	// 	// 返回对象自身，支持连缀风格调用
	// 	return this;
	// }

    onAfterDestroy(listenerClass, executeFunction) {
        this.afterDestroyHooks.push(new SaTokenPluginHookModel(listenerClass, executeFunction));
        // 返回对象自身，支持连缀风格调用
        return this;
    }
}


export default SaTokenPluginHolder;