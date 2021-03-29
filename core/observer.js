import { Dep } from './dep';
import { arrayMethods } from './array';

// __proto__是否可用
export const hasProto = '__proto__' in {};
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export default class Observer {
    constructor(value) {
        this.value = value;
        this.dep = new Dep(); // 实例化一个依赖管理器，用来收集数组依赖
        def(value, '__ob__', this)

        if (Array.isArray(value)) {
            const augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value); // 将数组中的所有元素都转化为可被侦测的响应式
        } else {
            this.walk(value);
        }
    }

    observeArray(items) {
        for (let i = 0; i < items.length; i +=1) {
            observe(items[i])
        }
    }

    walk(obj) {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i += 1) {
            defineReative(obj, keys[i], obj[keys[i]]);
        }
    }

    defineReative(data, key, val) {
        let childOb = observe(val);
        let dep = new Dep();
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                dep.depend();

                if (childOb) {
                    childOb.dep.depend()
                }
                return val;
            },
            set: function (newVal) {
                if (newVal === val) {
                    return;
                }
                dep.notify();
                val = newVal;
            }
        })
    }
}

export function observe (value, asRootData) {
    if (!isObject(value)) {
        return;
    }
    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__;
    } else {
        ob = new Observer(value);
    }
    return ob;
}

function protoAugment(target, src, keys) {
    target.__proto__ = src;
}

function  copyAugment(target, src, keys) {
    // 把拦截器中重写的7个方法循环加入到value上
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        def(target, key, src[key])
    }
}

function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true,
    })
}