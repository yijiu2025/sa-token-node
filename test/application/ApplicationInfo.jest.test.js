import ApplicationInfo from '../../sa-token/application/ApplicationInfo.js';

describe('ApplicationInfo 类测试', () => {
    afterEach(() => {
        ApplicationInfo.routePrefix = '';
    });

    test('裁剪匹配的前缀', () => {
        ApplicationInfo.routePrefix = '/api';
        expect(ApplicationInfo.cutPathPrefix('/api/user')).toBe('/user');
    });

    test('不匹配的前缀返回原路径', () => {
        ApplicationInfo.routePrefix = '/api';
        expect(ApplicationInfo.cutPathPrefix('/auth/user')).toBe('/auth/user');
    });
    test('空前缀应返回原路径', () => {
        ApplicationInfo.routePrefix = '';
        const result = ApplicationInfo.cutPathPrefix('/any/path');
        expect(result).toBe('/any/path');
    });

    test('前缀为 "/" 时应跳过裁剪', () => {
        ApplicationInfo.routePrefix = '/';
        const result = ApplicationInfo.cutPathPrefix('/user');
        expect(result).toBe('/user');
    });

    test('应处理多级前缀', () => {
        ApplicationInfo.routePrefix = '/api/v1';
        const result = ApplicationInfo.cutPathPrefix('/api/v1/user');
        expect(result).toBe('/user');
    });
    describe('routePrefix 属性', () => {
        test('应允许修改', () => {
            ApplicationInfo.routePrefix = '/admin';
            expect(ApplicationInfo.routePrefix).toBe('/admin');
        });
    });
});
