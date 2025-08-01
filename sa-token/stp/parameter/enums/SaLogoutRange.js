/**
 * SaLogoutRange 枚举类，表示登出范围
 */
const SaLogoutRange = {
    TOKEN: "TOKEN",
    ACCOUNT: "ACCOUNT"
};

// 冻结对象以防止修改
Object.freeze(SaLogoutRange);

// 导出模块（支持 CommonJS 和 ES6 模块）

export default SaLogoutRange; // Node.js 环境
