const arrayProto = Array.prototype;
// 创建一个对象作为拦截器
export const arrayMethods = Object.create(arrayProto);

// 改变数组自身内容的7个方法
const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

methodsToPatch.forEach(function (method) {
    const original = arrayProto[method]; // 缓存原生方法
    Object.defineProperty(arrayMethods, method, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: function mutator(...args) {
            const ob = this.__ob__;
            let inserted;
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args; // 如果是push或是unshift方法，那么传入参数就是新增的元素
                    break;
                case 'splice':
                    inserted = args.slice(2); // 如果是splice方法，那么传入参数列表中下标为2的就是新增元素
                default:
                    break;
            }
            if (inserted) ob.observeArray(inserted); // 调用observe函数将新增的元素转化成响应式
            ob.dep.notify();
            return original.apply(this, args)
        },
    })
})