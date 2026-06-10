(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VertoJS = {}));
})(this, (function (exports) { 'use strict';

    function isDefined(value) {
        return value !== undefined && value !== null;
    }

    function isValid(value) {
        if (value === undefined || value === null || (typeof value === 'number' && isNaN(value)))
            return false;
        return true;
    }

    /**
     * 检查工具对象
     * @namespace Check
    */
    const Check = {};
    /**
     * 检查类型
     * @namespace Check.typeOf
    */
    Check.typeOf = {};

    function getUndefinedErrorMessage(name) {
        return name + " is required, actual value was undefined.";
    }
    function getInvalidErrorMessage(name) {
        return name + " is required, actual value was invalid.";
    }
    function getFailedTypeErrorMessage(actual, expected, name) {
        return (
            "Expected " +
            name +
            " to be typeof " +
            expected +
            ", actual typeof was " +
            actual
        );
    }/**
     * 检查值是否定义
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值未定义，则抛出错误
     * @static
     * @memberof Check
    */
    Check.defined = function (name, test) {
        if (!isDefined(test)) {
            throw new Error(getUndefinedErrorMessage(name));
        }
    };
    /**
     * 检查值是否有效
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值无效，则抛出错误
     * @static
     * @memberof Check
    */
    Check.valid = function (name, test) {
        if (!isValid(test)) {
            throw new Error(getInvalidErrorMessage(name));
        }
    };
    /**
     * 检查值是否为指定类的实例
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {Function} target 指定类
     * @throws {Error} 如果值不是指定类的实例，则抛出错误
     * @static
     * @memberof Check
    */
    Check.instanceOf = function (name, test, target) {
        if (test instanceof target === false) {
            throw new Error(getFailedTypeErrorMessage(false, target.name, name));
        }
    };
    /**
     * 检查值是否为函数
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是函数，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.function = function (name, test) {
        if (typeof test !== "function") {
            throw new Error(
                getFailedTypeErrorMessage(typeof test, "function", name)
            );
        }
    };
    /**
     * 检查值是否为函数
     * @see Check.typeOf.function
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.func = Check.typeOf.function;
    /**
     * 检查值是否为字符串
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是字符串，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.string = function (name, test) {
        if (typeof test !== "string") {
            throw new Error(
                getFailedTypeErrorMessage(typeof test, "string", name)
            );
        }
    };
    /**
     * 检查值是否为数字
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是数字，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.number = function (name, test) {
        if (typeof test !== "number") {
            throw new Error(
                getFailedTypeErrorMessage(typeof test, "number", name)
            );
        }
    };
    /**
     * 检查值是否为数字且小于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值小于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.number
    */
    Check.typeOf.number.lessThan = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test >= limit) {
            throw new Error(
                "Expected " +
                name +
                " to be less than " +
                limit +
                ", actual value was " +
                test
            );
        }
    };
    /**
     * 检查值是否为数字且小于或等于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值小于或等于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.number
    */
    Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test > limit) {
            throw new Error(
                "Expected " +
                name +
                " to be less than or equal to " +
                limit +
                ", actual value was " +
                test
            );
        }
    };
    /**
     * 检查值是否为数字且大于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值大于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.number
    */
    Check.typeOf.number.greaterThan = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test <= limit) {
            throw new Error(
                "Expected " +
                name +
                " to be greater than " +
                limit +
                ", actual value was " +
                test
            );
        }
    };
    /**
     * 检查值是否为数字且大于或等于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值大于或等于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.number
     */
    Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
        Check.typeOf.number(name, test);
        if (test < limit) {
            throw new Error(
                "Expected " +
                name +
                " to be greater than or equal to" +
                limit +
                ", actual value was " +
                test
            );
        }
    };
    /**
     * 检查两个值是否为数字且相等
     * @param {string} name1 值1的名称
     * @param {string} name2 值2的名称
     * @param {number} test1 需要检查的值1
     * @param {number} test2 需要检查的值2
     * @throws {Error} 如果两个数值不相等，则抛出错误
     * @static
     * @memberof Check.typeOf.number
    */
    Check.typeOf.number.equals = function (name1, name2, test1, test2) {
        Check.typeOf.number(name1, test1);
        Check.typeOf.number(name2, test2);
        if (test1 !== test2) {
            throw new Error(
                name1 +
                " must be equal to " +
                name2 +
                ", the actual values are " +
                test1 +
                " and " +
                test2
            );
        }
    };
    /**
     * 检查值是否为对象
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是对象，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.object = function (name, test) {
        if (typeof test !== "object") {
            throw new Error(
                getFailedTypeErrorMessage(typeof test, "object", name)
            );
        }
    };
    /**
     * 检查值是否为布尔值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是布尔值，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.boolean = function (name, test) {
        if (typeof test !== "boolean") {
            throw new Error(
                getFailedTypeErrorMessage(typeof test, "boolean", name)
            );
        }
    };
    /**
     * 检查值是否为布尔值
     * @see Check.typeOf.boolean
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.bool = Check.typeOf.boolean;
    /**
     * 检查值是否为数组
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是数组，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.array = function (name, test) {
        if (Array.isArray(test) === false) {
            throw new Error(getFailedTypeErrorMessage(typeof test, 'array', name));
        }
    };
    /**
     * 检查值是否为整数
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @throws {Error} 如果值不是整数，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.integer = function (name, test) {
        if (Number.isSafeInteger(test) === false) {
            throw new Error(getFailedTypeErrorMessage(typeof test, 'integer', name));
        }
    };
    /**
     * 检查值是否为整数且小于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值小于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.integer
    */
    Check.typeOf.integer.lessThan = function (name, test, limit) {
        Check.typeOf.integer(name, test);
        if (test >= limit) {
            throw new Error('Expected ' +
                name +
                ' to be less than ' +
                limit +
                ', actual value was ' +
                test);
        }
    };
    /**
     * 检查值是否为整数且小于或等于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值小于或等于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.integer
    */
    Check.typeOf.integer.lessThanOrEquals = function (name, test, limit) {
        Check.typeOf.integer(name, test);
        if (test > limit) {
            throw new Error('Expected ' +
                name +
                ' to be less than or equal to ' +
                limit +
                ', actual value was ' +
                test);
        }
    };
    /**
     * 检查值是否为整数且大于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值大于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.integer
    */
    Check.typeOf.integer.greaterThan = function (name, test, limit) {
        Check.typeOf.integer(name, test);
        if (test <= limit) {
            throw new Error('Expected ' +
                name +
                ' to be greater than ' +
                limit +
                ', actual value was ' +
                test);
        }
    };
    /**
     * 检查值是否为整数且大于或等于指定值
     * @param {string} name 值的名称
     * @param {any} test 需要检查的值
     * @param {number} limit 指定值
     * @throws {Error} 如果值大于或等于指定值，则抛出错误
     * @static
     * @memberof Check.typeOf.integer
    */
    Check.typeOf.integer.greaterThanOrEquals = function (name, test, limit) {
        Check.typeOf.integer(name, test);
        if (test < limit) {
            throw new Error('Expected ' +
                name +
                ' to be greater than or equal to' +
                limit +
                ', actual value was ' +
                test);
        }
    };
    /**
     * 检查两个值是否为整数且相等
     * @param {string} name1 值1的名称
     * @param {string} name2 值2的名称
     * @param {number} test1 需要检查的值1
     * @param {number} test2 需要检查的值2
     * @throws {Error} 如果两个整数值不相等，则抛出错误
     * @static
     * @memberof Check.typeOf.integer
    */
    Check.typeOf.integer.equals = function (name1, name2, test1, test2) {
        Check.typeOf.integer(name1, test1);
        Check.typeOf.integer(name2, test2);
        if (test1 !== test2) {
            throw new Error(
                name1 +
                " must be equal to " +
                name2 +
                ", the actual values are " +
                test1 +
                " and " +
                test2
            );
        }
    };
    /**
     * 检查两个值是否已定义且相等
     * @param {string} name1 值1的名称
     * @param {string} name2 值2的名称
     * @param {any} test1 需要检查的值1
     * @param {any} test2 需要检查的值2
     * @throws {Error} 如果两个值不相等，则抛出错误
     * @static
     * @memberof Check.typeOf
    */
    Check.typeOf.equals = function (name1, name2, test1, test2) {
        Check.defined(name1, test1);
        Check.defined(name2, test2);
        if (test1 !== test2) {
            throw new Error(
                name1 +
                " must be equal to " +
                name2 +
                ", the actual values are " +
                test1 +
                " and " +
                test2
            );
        }
    };

    function isFunction(value) {
        return typeof value === 'function';
    }

    function destroyHTMLElementImpl(element, deepChildren) {
        if (deepChildren) {
            while (element.lastChild) {
                destroyHTMLElementImpl(element.lastChild, deepChildren);
            }
        }
        if (element.parentNode)
            element.parentNode.removeChild(element);
        if (element instanceof HTMLVideoElement) {
            if (element.hlsPlayer) {
                element.hlsPlayer.destroy();
                delete element.hlsPlayer;
            }
            if (element.flvPlayer) {
                try {
                    element.flvPlayer.unload();
                    element.flvPlayer.detachMediaElement();
                } catch (error) {
                    console.error(error);
                }
                element.flvPlayer.destroy();
                delete element.flvPlayer;
            }
            try {
                element.pause();
                element.loop = false;
                element.removeAttribute('src');
                element.load();
            } catch (error) {
                console.error(error);
            }
        } else if (element instanceof HTMLImageElement) {
            //指向一张空白图片以释放之前的图片
            element.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        } else if (element instanceof HTMLCanvasElement) {
            //移除apng动画
            if (element.apngPlayer) {
                element.apngPlayer.stop();
                delete element.apngPlayer;
            }
            //移除gif动画
            if (element.gifPlayer) {
                element.gifPlayer.stop();
                delete element.gifPlayer;
            }
            //修改canvas尺寸为0可以释放之前的绘制结果
            element.width = element.height = 0;
        }
    }

    /**
     * 销毁HTMLElement对象
     * @param {HTMLElement} element HTMLElement对象
     * @param {Boolean} deepChildren 是否向下执行深度销毁
     * @returns {void}
     */
    function destroyHTMLElement(element, deepChildren) {
        if (element instanceof HTMLElement === false) {
            console.warn('The element must be instanceof HTMLElement.');
            return;
        }
        destroyHTMLElementImpl(element, deepChildren);
    }

    /**
     * 判断对象是否已被销毁过
     * @param {object} object
     * @returns {Boolean}
     */
    function isDestroyed(object) {
        if (typeof object.isDestroyed !== 'undefined') {
            if (typeof object.isDestroyed === 'function')
                return object.isDestroyed();
            else
                return object.isDestroyed;
        }
        return false;
    }

    function returnTrue() {
        return true;
    }

    function warnOnDestroyed() {
        console.warn('The object isDestroyed, call function is invalid.', object);
    }

    /**
     * 销毁一个对象下所有属性和方法
     * 销毁完成后会设置object.isDestroyed = function() { return true; };
     * @param {object} object 销毁对象
     * @param {object} config 销毁配置
     * @param {boolean} config.deleteProperty 是否删除对象属性，默认true
     * @param {Array<string>} config.ignoreProperties 需要忽略的属性数组
     * @param {boolean} config.ignoreUnderlinePrefixProperty 是否忽略下划线前缀的属性，默认false
     * @param {boolean} config.overwriteFunction 是否覆盖对象方法，默认true
     * @param {boolean} config.releaseArray 是否释放数组内容，默认true，为true时会执行array.length = 0
     * @param {boolean} config.destroyHTMLElement 是否销毁HTMLElement，默认true
     * @param {boolean} config.deep 是否向下执行深度销毁，默认false
     * @returns {void}
     */
    function destroyObject(object, config = {}) {
        if (isDestroyed(object) || object.isDestroying) {
            // console.warn('The object isDestroyed or isDestroying, repeated call destroyObject function are not required.', object);
            return;
        }
        if (object.dontDestroy || object.isCached || object.isProtected) {
            // console.warn('The object has dontDestroy or isCached or isProtected flag, dont execute destroy.', object);
            return;
        }

        config = Object.assign({
            deleteProperty: true,
            ignoreProperties: [],
            ignoreUnderlinePrefixProperty: false,
            overwriteFunction: true,
            releaseArray: true,
            destroyHTMLElement: true,
        }, config);

        config.ignoreProperties.push('isDestroying', 'isDestroyed', 'destroy', 'destroyConfigure', 'undeletable');

        //标记正在执行销毁
        object.isDestroying = true;

        const hasIgnoreProperties = Array.isArray(config.ignoreProperties) && config.ignoreProperties.length > 0;

        for (const key in object) {
            //过滤属性
            if (hasIgnoreProperties && config.ignoreProperties.indexOf(key) !== -1)
                continue;
            if (config.ignoreUnderlinePrefixProperty === true && key.startsWith('_'))
                continue;
            try {
                const value = object[key];
                if (value) {
                    //有不可销毁或缓存或受保护标记，不执行销毁
                    if (value.dontDestroy || value.isCached || value.isProtected)
                        continue;
                    if (typeof value === 'function' && config.overwriteFunction === true)
                        object[key] = warnOnDestroyed;
                    else if (Array.isArray(value) && config.releaseArray === true)
                        value.length = 0;
                    else if (value instanceof HTMLElement && config.destroyHTMLElement === true)
                        destroyHTMLElement(value, config.deep);
                    //如果value是对象且deep为true
                    else if (typeof value === 'object' && config.deep === true) {
                        if (typeof value.destroy === 'function')
                            value.destroy();
                        else
                            destroyObject(value, config);
                    }
                    if (value.undeletable) //有不可删除标记，不执行delete操作
                        continue;
                }
            } catch (error) {
                console.warn(error);
            }
            try {
                if (config.deleteProperty === true)
                    delete object[key];
            } catch (error) {
                // console.warn(error);
            }
        }

        object.isDestroyed = returnTrue;

        delete object.isDestroying;

        return object;
    }

    /**
     * Destroyable是一个包含了destroy相关Property的class，可用于继承
     * 
     * @abstract
     * @class
    */
    class Destroyable {
        /**
         * 获取销毁配置，由子类实现
         * @type {object|void}
         * @abstract
        */
        get destroyConfigure() { }

        isDestroyed() {
            return false;
        }

        /**
         * 执行销毁，由子类实现
         * @abstract
         */
        onDestroy(...args) {
            // console.warn('onDestroy must be overwrited by subclass.');
        }

        /**
         * 销毁自身
         * @returns {this}
         */
        destroy(...args) {
            if (this.isDestroyed()) {
                console.warn('This object was destroyed.', this);
            } else if (this.isDestroying) {
                console.warn('This object is destroying.', this);
            } else {
                this.onDestroy(...args);
                destroyObject(this, this.destroyConfigure);
            }
            return this;
        }
    }

    /**
     * 日期格式化
     * @param {string|undefined} formatString 格式化字符串，不填则默认使用'yyyy-MM-dd HH:mm:ss'
     * @param {Date|undefined} date 日期对象，不填则默认使用当前日期
     * @returns {string}
     */
    function formatDate(formatString = 'yyyy-MM-dd HH:mm:ss', date = new Date()) {
        const values = {
            "y+": '' + date.getFullYear(),
            "M+": '' + (date.getMonth() + 1), // 月份
            "d+": '' + date.getDate(), //日
            "H+": '' + date.getHours(), //24小时制
            "h+": '' + (date.getHours() % 12 === 0 ? 12 : date.getHours() % 12), //12小时制  
            "m+": '' + date.getMinutes(), //分
            "s+": '' + date.getSeconds(), //秒
            "q+": '' + Math.floor((date.getMonth() + 3) / 3), //季度
            "S": '' + date.getMilliseconds()  //毫秒
        };
        for (const key in values) {
            const regex = new RegExp('(' + key + ')');
            const result = regex.exec(formatString);
            if (result) {
                let value = values[key];
                while (value.length < result[1].length) {
                    value = '0' + value;
                }
                formatString = formatString.replace(result[1], value.substring(value.length - result[1].length));
            }
        }
        return formatString;
    }

    /**
     * A generic utility class for managing subscribers for a particular event. This class is usually instantiated inside of a container class and exposed as a property for others to subscribe to.
     * 
     * @class EventSubscriber
     * @extends Destroyable
    */
    class EventSubscriber extends Destroyable {
        constructor() {
            super();
            this._listenersMap = new Map();
        }

        /**
         * 事件监听器数量
         * @returns {Number}
         */
        get numberOfListeners() {
            return this._listenersMap.size;
        }

        /**
         * 获取所有的事件监听器
         * @returns {Array<Function>}
         */
        get listeners() {
            const result = [];
            const listeners = this._listenersMap.values();
            for (const listener of listeners) {
                result.push(listener.callback);
            }
            return result;
        }

        /**
         * 判断事件监听器是否已存在
         * @param {Function} callback 事件监听回调函数
         * @returns {boolean}
         */
        hasEventListener(callback) {
            return this._listenersMap.has(callback);
        }

        /**
         * 添加事件监听
         * @param {Function} callback 回调函数
         * @param {object} options 事件配置项，可不填
         * @param {object} options.scope 回调函数<code>this</code>指针对象，可不填
         * @param {boolean} options.once 是否单次事件，可不填
         * @returns {Function} 移除函数，调用该函数可直接移除事件监听
         */
        addEventListener(callback, options = {}) {
            Check.typeOf.func('callback', callback);

            let listener = this._listenersMap.get(callback);

            if (!listener) {
                listener = {
                    callback: callback,
                    options: options,
                    removeFunc: () => {
                        this.removeEventListener(callback);
                    }
                };
                this._listenersMap.set(callback, listener);
            } else {
                listener.options = options;
            }

            return listener.removeFunc;
        }

        /**
         * 移除事件监听
         * @param {Function} callback 回调函数
         * @returns {boolean}
         */
        removeEventListener(callback) {
            Check.typeOf.func('callback', callback);

            return this._listenersMap.delete(callback);
        }

        /**
         * @see hasEventListener
        */
        has(callback) {
            return this.hasEventListener(callback);
        }

        /**
         * @see addEventListener
        */
        on(callback, options) {
            return this.addEventListener(callback, options);
        }

        /**
         * @see removeEventListener
        */
        off(callback) {
            return this.removeEventListener(callback);
        }

        /**
         * 添加一次事件监听
         * @param {Function} callback 回调函数
         * @param {object} scope 回调函数<code>this</code>指针对象，可不填
         * @returns {Function} 移除函数，调用该函数可直接移除事件监听
         * 
         * @see addEventListener
         */
        once(callback, scope) {
            return this.addEventListener(callback, {
                once: true,
                scope: scope,
            });
        }

        /**
         * 清除所有事件监听
         * @returns {this}
         */
        clear() {
            this._listenersMap.clear();
            return this;
        }

        /**
         * 发送事件
         * @param {...any} ...args 事件参数
         * @returns {this}
         */
        raiseEvent(...args) {
            const listeners = this._listenersMap.values();
            for (const listener of listeners) {
                const options = listener.options;
                const callback = listener.callback;
                callback.apply(options.scope, arguments);
                if (options.once) {
                    this._listenersMap.delete(callback);
                }
            }

            return this;
        }

        /**
         * 执行销毁
         */
        onDestroy() {
            this.clear();
        }
    }

    /**
     * Hash数组对象
     * 
     * 以键值对{key, value}形式保存元素
     * 
     * 同时会记住键的原始插入顺序
     * 
     * 键Key必须是字符串类型
     * 
     * @template T value元素
     * 
     * @class
    */
    class HashArray {
        /**
         * change事件回调方法
         * @callback changeCallback
         * @param {object} event
         * @param {string} event.type
        */
        /**
         * @constructor
         * 
         * @param {changeCallback} onChange change事件回调方法
         */
        constructor(onChange) {
            /** @type {Array<string>} */
            this._keys = [];
            /** @type {Map<string, T>} */
            this._hash = new Map();
            this.changeEvent = new EventSubscriber();
            this.onChange = onChange;
        }

        get isHashArray() {
            return true;
        }

        /**
         * 返回键值对元素数量
         * @returns {number}
         */
        get size() {
            return this._keys.length;
        }

        /**
         * 返回键元素数组
         * @returns {Array<string>}
         */
        keys() {
            return this._keys.slice();
        }

        /**
         * 返回值元素数组
         * @returns {Array<T>}
         */
        values() {
            const result = [];
            for (let i = 0, len = this._keys.length; i < len; i++) {
                const key = this._keys[i];
                const value = this._hash.get(key);
                result.push(value);
            }
            return result;
        }

        /**
         * 返回键值对{key, value}元素数组
         * @returns {Array<{string, T}>}
         */
        entries() {
            const result = [];
            for (let i = 0, len = this._keys.length; i < len; i++) {
                const key = this._keys[i];
                const value = this._hash.get(key);
                result.push({ key, value });
            }
            return result;
        }

        /**
         * 移除所有的键值对元素
         * @returns {void}
         */
        clear() {
            this._hash.clear();
            this._keys.length = 0;
            this._emitEvent({ type: 'clear', });
        }

        /**
         * 设置键值对元素
         * @param {string} key 设置的键，必须是字符串类型
         * @param {T} value 设置的值，任意类型，可以是null、undefined或NaN
         * @param {number} insertAt 插入索引，不填则表示在最后插入，如果key已在数组中存在，则该值不生效
         * @returns {void}
         */
        set(key, value, insertAt) {
            Check.typeOf.string('key', key);

            // 判断键元素是否已存在
            const hasKey = this._keys.indexOf(key) !== -1;
            // 判断是否传入了插入索引
            const hasInsertIndex = Number.isSafeInteger(insertAt);
            if (!hasKey) {
                if (hasInsertIndex) {
                    // 检查插入索引是否超出了范围
                    Check.typeOf.integer.greaterThanOrEquals('insertAt', insertAt, 0);
                    Check.typeOf.integer.lessThan('insertAt', insertAt, this.size);
                    // 根据索引插入键元素
                    this._keys.splice(insertAt, 0, key);
                } else {
                    // 放入键元素
                    this._keys.push(key);
                }
            }

            // 设置值元素
            this._hash.set(key, value);
            if (hasKey)
                this._emitEvent({
                    type: 'replace',
                    key, value
                });
            else if (hasInsertIndex)
                this._emitEvent({
                    type: 'insert',
                    key, value, insertAt
                });
            else
                this._emitEvent({
                    type: 'add',
                    key, value
                });
        }

        /**
         * 删除由某个键指定的键值对元素
         * @param {string} key 键
         * @returns {boolean} 返回true表示删除成功，false表示未找到
         */
        delete(key) {
            Check.typeOf.string('key', key);
            const idx = this._keys.indexOf(key);
            if (idx !== -1) {
                this._keys.splice(idx, 1);
                this._hash.delete(key);
                this._emitEvent({
                    type: 'delete',
                    key,
                });
                return true;
            }
            return false;
        }

        /**
         * 根据键获取值
         * @param {string} key
         * @returns {T}
         */
        get(key) {
            Check.typeOf.string('key', key);
            return this._hash.get(key);
        }

        /**
         * 判断键是否已存在
         * @param {string} key
         * @returns {boolean}
         */
        has(key) {
            Check.typeOf.string('key', key);
            return this._keys.indexOf(key) !== -1;
        }

        /**
         * 返回键索引
         * @param {string} key
         * @returns {number}
         */
        indexOf(key) {
            Check.typeOf.string('key', key);
            return this._keys.indexOf(key);
        }

        /**
         * 遍历回调方法
         * @callback forEachCallback
         * @param {T} value
         * @param {string} key
        */
        /**
         * 遍历数组
         * @param {forEachCallback} callback 遍历回调方法
         * @returns {void}
         * 
         * @example
         * hashArray.forEach(function(value, key) {
         *     console.log(key, value);
         * });
         * 
         */
        forEach(callback) {
            Check.typeOf.func('callback', callback);
            for (let i = 0, len = this._keys.length; i < len; i++) {
                const key = this._keys[i];
                const value = this._hash.get(key);
                callback(value, key);
            }
        }

        /**
         * @param {object} event
         * @returns {this}
         * 
         * @private
         */
        _emitEvent(event) {
            event.owner = this;
            this.changeEvent.raiseEvent(event);
            isFunction(this.onChange) && this.onChange(event);
            return this;
        }
    }

    /**
     * 事件类型枚举
     * @enum {string} EventType
     * @property {string} loginSuccess 登录成功事件
     * @property {string} loginError 登录出错事件
     * @property {string} logout 登出事件
     * @property {string} stateChange 状态变化事件
     * @property {string} success 成功事件
     * @property {string} error 错误事件
     * @property {string} ready 准备完成事件
     * @property {string} eventChannel 频道事件
     * @property {string} liveArray 活动数组事件
     * @property {string} chat 聊天事件
     * @property {string} info 信息事件
     * @property {string} display 会话展示事件
     * @property {string} localStream 本地媒体流事件
     * @property {string} remoteStream 远程媒体流事件
     * @property {string} action 动作事件
     * @property {string} message 消息事件
     * @readonly
    */
    const EventType = Object.freeze({
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        logout: 'logout',
        stateChange: 'stateChange',
        success: 'success',
        error: 'error',
        ready: 'ready',
        eventChannel: 'eventChannel',
        liveArray: 'liveArray',
        chat: 'chat',
        info: 'info',
        display: 'display',
        localStream: 'localStream',
        remoteStream: 'remoteStream',
        message: 'message',
    });

    /**
     * Verto指令枚举
     * @enum {string} VertoMethod
     * @property {string} invite 邀请
     * @property {string} answer 应答
     * @property {string} attach 吸附
     * @property {string} bye 再见
     * @property {string} modify 修改
     * @property {string} info 信息
     * @property {string} broadcast 广播
     * @property {string} media 媒体
     * @property {string} display 展示
     * @property {string} subscribe 订阅
     * @property {string} unsubscribe 取消订阅
     * @property {string} punt 踢出
     * @property {string} event 事件
     * @property {string} clientReady 客户端准备完成
     * @property {string} ping 网络探测
     * @readonly
    */
    const VertoMethod = Object.freeze({
        invite: 'verto.invite',
        answer: 'verto.answer',
        attach: 'verto.attach',
        bye: 'verto.bye',
        modify: 'verto.modify',
        info: 'verto.info',
        broadcast: 'verto.broadcast',
        media: 'verto.media',
        display: 'verto.display',
        subscribe: 'verto.subscribe',
        unsubscribe: 'verto.unsubscribe',
        punt: 'verto.punt',
        event: 'verto.event',
        clientReady: 'verto.clientReady',
        ping: 'verto.ping',
    });

    /**
     * 是否异步函数
     * @param {Function} func
     * @returns {boolean}
     */
    function isAsyncFunction(func) {
        return func.constructor.name === 'AsyncFunction';
    }

    /**
     * 一个简单的日志记录类，封装了控制台方法。它允许您全局启用或禁用日志记录。
    */
    class Log {
        /**
         * 创建一个Log实例。
         * @param {boolean} [enabled=true] - 是否启用日志记录，默认为true。
         * @constructor
        */
        constructor(enabled = true) {
            /**
             * 日志记录是否启用，设置为false将禁用所有日志输出。
             * @type {boolean}
             * @default true
            */
            this.enabled = enabled;
        }
        /**
         * 启用日志记录，使所有日志输出生效。
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        enable() {
            this.enabled = true;
            return this;
        }
        /**
         * 禁用日志记录，所有日志输出将被忽略。
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        disable() {
            this.enabled = false;
            return this;
        }
        /**
         * 输出debug级别的日志信息。
         * @param {...*} msg 
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        debug(...msg) {
            this.enabled && console.debug(...msg);
            return this;
        }
        /**
         * 输出error级别的日志信息。
         * @param {...*} msg 
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        error(...msg) {
            this.enabled && console.error(...msg);
            return this;
        }
        /**
         * 输出info级别的日志信息。
         * @param {...*} msg 
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        info(...msg) {
            this.enabled && console.info(...msg);
            return this;
        }
        /**
         * 输出log级别的日志信息。
         * @param {...*} msg 
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        log(...msg) {
            this.enabled && console.log(...msg);
            return this;
        }
        /**
         * 输出warn级别的日志信息。
         * @param {...*} msg 
         * @returns {Log} 当前Log实例，支持链式调用。
        */
        warn(...msg) {
            this.enabled && console.warn(...msg);
            return this;
        }
    }

    const logger = new Log();

    /**
     * @param {string|HTMLMediaElement|Function} tag
     * @param {boolean} createAudio
     * @returns {Promise<HTMLMediaElement>}
     */
    async function getMediaElementByTag(tag, createAudio) {
        if (tag instanceof HTMLMediaElement)
            return tag;
        else if (isFunction(tag)) {
            if (isAsyncFunction(tag))
                tag = await tag();
            else
                tag = tag();
            tag = await getMediaElementByTag(tag, createAudio);
        } else if (typeof (tag) === 'string') {
            tag = document.getElementById(tag);
        } else if (createAudio) {
            const audio = document.createElement('audio');
            audio.autoplay = true;
            audio.style.pointerEvents = 'none';
            audio.style.position = 'absolute';
            audio.style.zIndex = '-9999';
            audio.style.width = '0';
            audio.style.height = '0';
            document.body.appendChild(audio);
            tag = audio;
        }
        return tag;
    }
    /**
     * 确保WebRTC配置中包含ICE服务器
     * @param {object} config WebRTC配置对象
     * @param {object} options 选项对象，包含turnServer和iceServers属性
     * @returns {object} WebRTC配置对象
    */
    function ensureIceServers(config, options) {
        if (options.turnServer) {
            const default_ice = [{ urls: ['stun:stun.l.google.com:19302'] }];
            typeof options.turnServer === 'object' && default_ice.push(options.turnServer);

            if (Array.isArray(options.iceServers) && options.iceServers.length > 0)
                config.iceServers = options.iceServers;
            else
                config.iceServers = default_ice;
        }
        return config;
    }

    /**
     * @import Dialog from "./Dialog.js";
    */

    /**
     * 组会状态
     * @enum {string} ConferenceState
     * @property {string} new 新建
     * @property {string} join 加入
     * @property {string} hangup 挂断
     * @property {string} destroy 销毁
    */
    const ConferenceState = Object.freeze({
        new: 'new',
        join: 'join',
        hangup: 'hangup',
        destroy: 'destroy',
    });

    const confValidStatesChange = Object.freeze({
        new: {
            join: true,
            hangup: true,
            destroy: true,
        },
        join: {
            hangup: true,
            active: true,
            destroy: true,
        },
        hangup: {
            destroy: true
        },
        destroy: {},
    });

    /**
     * 检查状态变化是否合法
     * @param {ConferenceState} oldS
     * @param {ConferenceState} newS
     * @returns {boolean}
     * @private
     */
    function checkConfStateChangeValid(oldS, newS) {
        return confValidStatesChange[oldS][newS];
    }
    /**
     * 组会实时数组动作
     * @enum {string} ConferenceLiveArrayAction
     * @property {string} init 数组初始化，注意，此时不会生成成员数据
     * @property {string} bootObj 引导数组数据，此时会生成成员数据
     * @property {string} add 新增成员
     * @property {string} modify 成员数据有修改，比如状态变化等
     * @property {string} del 移除成员
     * @property {string} clear 清除所有成员数据
     * @property {string} reorder 数组重排序
     * @property {string} error 数组出错
     * @readonly
    */
    const ConferenceLiveArrayAction = Object.freeze({
        init: 'init',
        bootObj: 'bootObj',
        add: 'add',
        modify: 'modify',
        del: 'del',
        clear: 'clear',
        reorder: 'reorder',
        error: 'error',
    });

    /**
     * 组会成员信息
     */
    class ConferenceMemberInfo {
        /**
         * @constructor
         * @param {string} key 
         * @param {Array} data
         */
        constructor(key, data) {
            /**
             * 成员uuid
             * @type {string}
            */
            this.uuid = key;
            /**
             * 成员id
             * @type {string}
            */
            this.id = data[0];
            /**
             * 成员号码
             * @type {string}
            */
            this.number = data[1];
            /**
             * 成员名称
             * @type {string}
            */
            this.name = data[2];
            /**
             * 编解码器
             * @type {string}
            */
            this.codec = data[3];
            this.statusString = data[4];
            /**
             * 成员状态
             * @type {object}
            */
            this.status = JSON.parse(data[4]);
            /**
             * 成员其他信息
             * @type {object}
            */
            this.userVariables = data[5];
            this.userVariablesString = JSON.stringify(data[5]);
        }
        /**
         * 麦克风是否已关闭
         * @type {boolean}
         * @readonly
        */
        get isMicMuted() {
            return this.status.audio.muted;
        }
        /**
         * 相机是否已关闭
         * @type {boolean}
         * @readonly
        */
        get isCameraMuted() {
            return this.status.video ? this.status.video.muted : true;
        }
        /**
         * 是否正在说话
         * @type {boolean}
         * @readonly
        */
        get isTalking() {
            return this.status.audio.talking;
        }
        /**
         * 是否视频Floor
         * @type {boolean}
         * @readonly
        */
        get isVideoFloor() {
            return this.status.video ? this.status.video.floor : false;
        }
        /**
         * 是否已被禁听
         * @type {boolean}
         * @readonly
        */
        get isDeaf() {
            return this.status.audio.deaf;
        }

        /**
         * 更新MemberInfo，返回信息是否有变化
         * @param {string} key
         * @param {Array} data
         * @returns {boolean} MemberInfo是否有变化
         * @private
         */
        update(key, data) {
            let changed = false;
            if (this.uuid !== key) {
                this.uuid = key;
                changed = true;
            }
            if (this.id !== data[0]) {
                this.id = data[0];
                changed = true;
            }
            if (this.number !== data[1]) {
                this.number = data[1];
                changed = true;
            }
            if (this.name !== data[2]) {
                this.name = data[2];
                changed = true;
            }
            if (this.codec !== data[3]) {
                this.codec = data[3];
                changed = true;
            }
            if (this.statusString !== data[4]) {
                this.statusString = data[4];
                this.status = JSON.parse(data[4]);
                changed = true;
            }
            const userVariablesString = JSON.stringify(data[5]);
            if (this.userVariablesString !== userVariablesString) {
                this.userVariablesString = userVariablesString;
                this.userVariables = data[5];
                changed = true;
            }
            return changed;
        }
    }
    /**
     * 组会实时数组，同步在线组会成员信息，会在Conference创建时同步创建
     * @extends Destroyable
    */
    class ConferenceLiveArray extends Destroyable {
        /**
         * @constructor
         * @param {Conference} conference 组会对象
         * @param {string} context LiveArray上下文，即LiveArray事件频道名称
         * @param {string} name LiveArray名称
         * @param {object} config 配置项
         * @param {object} config.subParams
         */
        constructor(conference, context, name, config) {
            super();

            this.conference = conference;
            this.verto = conference.verto;
            this.context = context;
            this.name = name;
            this.config = config;
            this.lastSerno = 0;
            /** 
             * @type {HashArray<ConferenceMemberInfo>}
             * @private
             */
            this.hashArray = new HashArray();

            /**
             * LiveArray变化通知 
             * @type {Function}
             */
            this.onChange = null;
            /**
             * LiveArray错误通知 
             * @type {Function}
             */
            this.onError = null;
            this.channel = this.verto.subscribeChannel(context, this._handleEvent.bind(this), config.subParams);

            // this.bootstrap();
        }

        /**
         * 获取组会成员数量
         * @returns {number}
         * @readonly
         */
        get membersCount() {
            return this.hashArray.size;
        }

        /**
         * 获取所有组会成员信息
         * @returns {Array<ConferenceMemberInfo>}
         */
        members() {
            return this.hashArray.values();
        }

        /**
         * 根据uuid获取组会成员信息
         * @param {string} uuid
         * @returns {ConferenceMemberInfo}
         */
        getByUuid(uuid) {
            return this.hashArray.get(uuid);
        }

        /**
         * @private
        */
        _notifyChange(event) {
            event.liveArray = this;
            isFunction(this.onChange) && this.onChange(event);
        }

        /**
         * @private
        */
        _notifyError(error) {
            isFunction(this.onError) && this.onError({
                action: ConferenceLiveArrayAction.error,
                liveArray: this,
                error,
            });
        }

        /**
         * @private
        */
        _handleEvent(e) {
            const packet = e.data;
            if (packet.name !== this.name) {
                return;
            }

            switch (packet.action) {
                case ConferenceLiveArrayAction.init:
                    this.onInit(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                    break;

                case ConferenceLiveArrayAction.bootObj:
                    this.onBootObj(packet.wireSerno, packet.data);
                    break;

                case ConferenceLiveArrayAction.add:
                    this.onAdd(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                    break;

                case ConferenceLiveArrayAction.modify:
                    if (!(packet.arrIndex || packet.hashKey)) {
                        logger.error("Invalid Packet:", packet);
                    } else {
                        this.onModify(packet.wireSerno, packet.hashKey, packet.data, packet.arrIndex);
                    }
                    break;

                case ConferenceLiveArrayAction.del:
                    if (!(packet.arrIndex || packet.hashKey)) {
                        logger.error("Invalid Packet:", packet);
                    } else {
                        this.onDel(packet.wireSerno, packet.hashKey, packet.arrIndex);
                    }
                    break;

                case ConferenceLiveArrayAction.clear:
                    this.onClear();
                    break;

                case ConferenceLiveArrayAction.reorder:
                    this.onReorder(packet.wireSerno, packet.order);
                    break;

                default:
                    if (this._checkSerno(packet.wireSerno)) {
                        this._notifyChange({
                            serno: packet.wireSerno,
                            action: packet.action,
                            data: packet.data,
                        });
                    }
                    break;
            }
        }

        /**
         * 发送liveArray命令
         * @param {string} command 命令
         * @param {any} obj 参数
         * @returns {void}
         */
        sendCommand(command, obj) {
            this.verto.sendChannelBroadcast(this.context, {
                liveArray: {
                    command,
                    context: this.context,
                    name: this.name,
                    obj
                }
            });
        }

        /**
         * 发送bootstrap命令，LiveArray创建时调用
         * @param {any} obj
         * @returns {void}
         */
        bootstrap(obj) {
            this.sendCommand("bootstrap", obj);
        }

        // /**
        //  * 发送changepage命令
        //  * @param {any} obj
        //  * @returns {void}
        //  */
        // changepage(obj) {
        //     this.clear();
        //     this.sendCommand("changepage", obj);
        // }

        // /**
        //  * 发送heartbeat命令
        //  * @param {any} obj
        //  * @returns {void}
        //  */
        // heartbeat(obj) {
        //     this.sendCommand("heartbeat", obj);
        // }

        /**
         * @param {number} serno
         * @returns {boolean}
         * @private
         */
        _checkSerno(serno) {
            if (serno < 0) return true;

            if (this.lastSerno > 0 && serno !== (this.lastSerno + 1)) {
                // if (la.onErr) {
                //     la.onErr(la, {
                //         lastSerno: lastSerno,
                //         serno: serno
                //     });
                // }
                // la.errs++;
                // console.debug(la.errs);
                // if (la.errs < 3) {
                //     la.bootstrap(la.user_obj);
                // }
                const msg = "checkSerno error: lastSerno=" + this.lastSerno + "; serno=" + serno;
                logger.error(msg);
                this._notifyError(new Error(msg));
                return false;
            } else {
                this.lastSerno = serno;
                return true;
            }
        }

        /**
         * @param {number} serno
         * @param {string} key
         * @param {any} data
         * @param {number} index
         * @returns {void}
         * @private
         */
        onInit(serno, key, data, index) {
            if (!isDefined(key)) key = serno;
            if (this._checkSerno(serno)) {
                this._notifyChange({
                    action: ConferenceLiveArrayAction.init,
                    serno, key, data, index
                });
            }
        }

        /**
         * @param {number} serno
         * @param {Array} data
         * @returns {void}
         * @private
         */
        onBootObj(serno, data) {
            if (this._checkSerno(serno)) {
                this.hashArray.clear();
                data.forEach(item => {
                    const member = new ConferenceMemberInfo(item[0], item[1]);
                    this.hashArray.set(member.uuid, member);
                });

                this._notifyChange({
                    action: ConferenceLiveArrayAction.bootObj,
                    serno, data,
                    members: this.members()
                });
            }
        }

        /**
         * @param {number} serno
         * @param {string} key
         * @param {any} data
         * @param {number} index
         * @returns {void}
         * @private
         */
        onAdd(serno, key, data, index) {
            if (!isDefined(key)) key = serno;
            if (this._checkSerno(serno)) {
                if (this.hashArray.has(key)) {
                    const msg = "add error: the key=" + key + " has existed.";
                    logger.error(msg);
                    this._notifyError(new Error(msg));
                } else {
                    const member = new ConferenceMemberInfo(key, data);
                    this.hashArray.set(member.uuid, member);
                    this._notifyChange({
                        action: ConferenceLiveArrayAction.add,
                        serno, index, key, data, member
                    });
                }
            }
        }

        /**
         * @param {number} serno
         * @param {string} key
         * @param {any} data
         * @param {number} index
         * @returns {void}
         * @private
         */
        onModify(serno, key, data, index) {
            if (!isDefined(key)) key = serno;
            if (this._checkSerno(serno)) {
                const member = this.hashArray.get(key);
                if (member) {
                    if (member.update(key, data))
                        this._notifyChange({
                            action: ConferenceLiveArrayAction.modify,
                            serno, key, data, member, index
                        });
                } else {
                    const msg = "modify error: the key=" + key + " not exist.";
                    logger.error(msg);
                    this._notifyError(new Error(msg));
                }
            }
        }

        /**
         * @param {number} serno
         * @param {string} key
         * @param {number} index
         * @returns {void}
         * @private
         */
        onDel(serno, key, index) {
            if (!isDefined(key)) key = serno;
            if (this._checkSerno(serno)) {
                if (!isDefined(index) || index < 0)
                    index = this.hashArray.indexOf(key);
                if (this.hashArray.delete(key))
                    this._notifyChange({
                        action: ConferenceLiveArrayAction.del,
                        serno, key, index
                    });
                else {
                    const msg = "del error: the key=" + key + " not exist.";
                    logger.error(msg);
                    this._notifyError(new Error(msg));
                }
            }
        }

        /**
         * @param {Array<string>} newKeys
         * @returns {void}
         * @private
         */
        _reorder(newKeys) {
            const hash = this.hashArray._hash;
            this.hashArray.clear();
            for (let i = 0, len = newKeys.length; i < len; i++) {
                const key = newKeys[i];
                if (hash[key]) {
                    this.hashArray.set(key, hash[key]);
                    delete hash[key];
                }
            }
        }

        /**
         * @param {number} serno
         * @param {Array<string>} orderKeys
         * @returns {void}
         * @private
         */
        onReorder(serno, orderKeys) {
            if (this._checkSerno(serno)) {
                this._reorder(orderKeys);
                this._notifyChange({
                    action: ConferenceLiveArrayAction.reorder,
                    serno,
                    members: this.members(),
                });
            }
        }

        /**
         * @private
        */
        onClear() {
            this.lastSerno = 0;
            this.clear();
        }

        /**
         * 清除
         * @returns {void}
         */
        clear() {
            this.hashArray.clear();
            this._notifyChange({
                action: ConferenceLiveArrayAction.clear,
            });
        }

        onDestroy() {
            this.clear();
            this.channel && this.verto.unsubscribeChannel(this.channel);
        }
    }
    Object.defineProperties(ConferenceLiveArray, {
        /**
         * 组会成员数组动作
         * @type {ConferenceLiveArrayAction}
         * @readonly
         * @static
         * @memberof ConferenceLiveArray
        */
        Action: {
            get: function () {
                return ConferenceLiveArrayAction;
            }
        }
    });

    /**
     * 组会对象，发起组会呼叫或收到组会呼叫时生成该对象，同时在onConferenceEvent事件回调中传递该对象
     * @extends Destroyable
    */
    class Conference extends Destroyable {
        /**
         * @constructor
         * @param {Dialog} dialog 会话对象
         * @param {object} params 参数
         * @param {object} params.pvtData FreeSwitch下发的组会数据
         * @param {Function} onConferenceEvent 组会事件回调通知
         */
        constructor(dialog, params = {}, onConferenceEvent) {
            super();
            Check.defined('dialog', dialog);
            Check.defined('params.pvtData', params.pvtData);

            const self = this;
            dialog.conference = self;
            self.dialog = dialog;
            self.verto = dialog.client;
            self.params = params;
            self.pvtData = params.pvtData;
            self.callID = self.pvtData.callID;
            self.onConferenceEvent = onConferenceEvent;

            /**
             * 当前的会话状态
             * @type {ConferenceState}
            */
            this.state = ConferenceState.new;
            /**
             * 之前的会话状态
             * @type {ConferenceState}
            */
            this.lastState = self.state;
            self.subParams = {
                callID: self.callID,
            };

            /**
             * @type {Object<string, Array>}
             * @private
             */
            self._mod_cmd_callbacks = {};

            if (self.pvtData.modChannel) {
                self.modChannel = self.verto.subscribeChannel(self.pvtData.modChannel, function (e) {
                    logger.log("onModChannel:", e);
                    if (e.data && e.data.action === "response") {
                        if (e.data.response === "OK") {
                            const callbacks = self._mod_cmd_callbacks[e.data["conf-command"]];
                            if (callbacks && callbacks.length > 0) {
                                const element = callbacks.shift();
                                isFunction(element.onSuccess) && element.onSuccess(e.data.responseData);
                            }
                        }
                    }
                }, self.subParams);
            }

            self.infoChannel = self.verto.subscribeChannel(self.pvtData.infoChannel, function (e) {
                e.type = EventType.info;
                self._notifyEvent(e);
            }, self.subParams);

            self.chatChannel = self.verto.subscribeChannel(self.pvtData.chatChannel, function (e) {
                e.type = EventType.chat;
                self._notifyEvent(e);
            }, self.subParams);

            /**
             * LiveArray对象
             * @type {ConferenceLiveArray}
            */
            this.liveArray = new ConferenceLiveArray(self, self.pvtData.laChannel, self.pvtData.laName, {
                subParams: self.subParams
            });

            function onLiveArrayEvent(e) {
                e.type = EventType.liveArray;
                self._notifyEvent(e);
            }

            self.liveArray.onChange = onLiveArrayEvent;
            self.liveArray.onError = onLiveArrayEvent;

            self.verto.conferences[self.callID] = self;

            self._notifyStateChangeEvent();

            //为避免状态异常，这里需要判断dialog是否已激活，否则则由dialog来调用join()
            if (self.dialog.state === Dialog.State.active)
                self.join();
        }

        /**
         * @private
        */
        _notifyEvent(event) {
            event.conference = this;
            isFunction(this.onConferenceEvent) && this.onConferenceEvent(event);
        }

        /**
         * @private
         */
        _notifyStateChangeEvent() {
            this._notifyEvent({
                type: EventType.stateChange,
                state: this.state,
            });
        }

        /**
         * @private
         */
        _notifyErrorEvent(error) {
            this._notifyEvent({
                type: EventType.error,
                error,
            });
        }

        /**
         * @returns {Promise<boolean>}
         * @private
         */
        async _setState(state) {
            const self = this;
            if (self.isDestroyed() || self.state === ConferenceState.destroy)
                return false;

            if (self.state === state) {
                logger.warn("The state no change " + state);
                return false;
            }

            if (!checkConfStateChangeValid(self.state, state)) {
                const msg = "Invalid state change from " + self.state + " to " + state;
                logger.error("Conference " + self.callID + ": " + msg);
                self._notifyErrorEvent(new Error(msg));
                self.hangup({ cause: msg });
                return false;
            }

            logger.info("Conference " + self.callID + ": Change state from " + self.state + " to " + state);
            self.lastState = self.state;
            self.state = state;
            self._notifyStateChangeEvent();

            switch (self.state) {
                case ConferenceState.join:
                    self.liveArray.bootstrap();
                    break;
                case ConferenceState.hangup:
                    await self.dialog.hangup(self._hangupParams);
                    self._setState(ConferenceState.destroy);
                    break;
                case ConferenceState.destroy:
                    delete self.verto.conferences[self.callID];
                    super.destroy();
                    break;
            }
            return true;
        }

        /**
         * 是否视频会议
         * @returns {boolean}
         * @readonly
        */
        get isVideo() {
            return this.dialog.wantVideo;
        }

        /**
         * 组会号码
         * @returns {string}
         * @readonly
         */
        get groupNumber() {
            return this.pvtData.laName;
        }

        /**
         * 用户号码
         * @returns {string}
         * @readonly
         */
        get userNumber() {
            return this.dialog.userNumber;
        }

        /**
         * 用户在组会中的成员id
         * @returns {string}
         * @readonly
         */
        get userMemberID() {
            return this.pvtData.conferenceMemberID;
        }

        /**
         * 发送聊天消息
         * @param {string} message 发送的消息
         * @param {string|undefined} type 消息类型
         * @param {Function|undefined} onSuccess
         * @param {Function|undefined} onError
         * @returns {void}
         */
        sendChat(message, type = "chatMessage", onSuccess, onError) {
            Check.typeOf.string('message', message);
            const self = this;
            const params = {
                "eventChannel": self.pvtData.chatChannel,
                "data": {
                    "action": "send",
                    "message": message,
                    "type": type
                }
            };
            if (self.verto.rpcClient)
                self.verto.rpcClient.call(VertoMethod.broadcast, params, onSuccess, onError);
        }

        /**
         * 当前用户是否组会主持人
         * @returns {boolean}
         */
        get isModerator() {
            return this.pvtData.role === "moderator";
        }

        /**
         * 发送组会主持人命令
         * @param {string} command
         * @param {number|undefined} id
         * @param {string|undefined} value
         * @param {Function|undefined} onSuccess
         * @param {Function|undefined} onError
         * @returns {void}
         */
        moderatorCommand(command, id, value, onSuccess, onError) {
            const self = this;
            if (!self.isModerator || !self.pvtData.modChannel) {
                logger.warn("The role is not moderator, can not call moderator command.");
                return;
            }
            if (!self._mod_cmd_callbacks[command]) {
                self._mod_cmd_callbacks[command] = [];
            }
            self._mod_cmd_callbacks[command].push({
                command, id, value, onSuccess, onError
            });
            const params = {
                "eventChannel": self.pvtData.modChannel,
                "data": {
                    "application": "conf-control",
                    "command": command,
                    "id": id,
                    "value": value,
                }
            };
            if (self.verto.rpcClient)
                self.verto.rpcClient.call(VertoMethod.broadcast, params);
        }

        /**
         * 获取当前画布信息
         * @param {Function|undefined} onSuccess
         * @param {Function|undefined} onError
         * @returns {void}
         */
        canvasInfo(onSuccess, onError) {
            this.moderatorCommand("canvasInfo", null, null, onSuccess, onError);
        }

        /**
         * 获取支持的所有视频布局列表
         * @param {Function|undefined} onSuccess
         * @param {Function|undefined} onError
         * @returns {void}
         */
        listVideoLayouts(onSuccess, onError) {
            this.moderatorCommand("list-videoLayouts", null, null, onSuccess, onError);
        }

        /**
         * 设置视频布局
         * @param {string} layout 布局名称，从listVideoLayouts接口中获取
         * @param {string|undefined} canvasID
         * @returns {void}
         */
        setVideoLayout(layout, canvasID) {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            if (canvasID) {
                this.moderatorCommand("vid-layout", null, [layout, canvasID]);
            } else {
                this.moderatorCommand("vid-layout", null, layout);
            }
        }

        /**
         * 在组会中播放一段音视频
         * @param {string} url 音视频url
         * @returns {void}
         */
        play(url) {
            if (!url.startsWith("av://"))
                url = "av://" + url;
            this.moderatorCommand("play", null, url);
        }

        /**
         * 停止播放音视频
         * @returns {void}
         */
        stopPlay() {
            this.moderatorCommand("stop", null, "all");
        }

        /**
         * 开始会议录制
         * @param {string} dirPath 录制文件目录路径
         * @param {string|undefined} fileName 文件名，可不填由程序自动生成
         * @returns {string} 录制的文件全路径
         */
        startRecord(dirPath, fileName) {
            Check.defined('dirPath', dirPath);
            if (!fileName) {
                const startTime = formatDate('yyyy-MM-dd-HH-mm-ss');
                const extention = (this.isVideo ? '.mp4' : '.wav');
                fileName = startTime + '_' + this.userNumber + '_' + this.groupNumber + extention;
            }
            if (!dirPath.startsWith('/'))
                dirPath = '/' + dirPath;
            if (!dirPath.endsWith('/'))
                dirPath = dirPath + '/';
            const filePath = 'av://' + dirPath + fileName;
            this.moderatorCommand("recording", null, ["start", filePath]);
            return filePath;
        }

        /**
         * 停止会议录制
         * @returns {void}
         */
        stopRecord() {
            this.moderatorCommand("recording", null, ["stop", "all"]);
        }

        snapshot(file) {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            this.moderatorCommand("vid-write-png", null, file);
        }

        /**
         * 禁听某位成员
         * @param {string} memberID 成员id
         * @returns {void}
         */
        deaf(memberID) {
            this.moderatorCommand("deaf", parseInt(memberID));
        }

        /**
         * 解除禁听
         * @param {string} memberID 成员id
         * @returns {void}
         */
        undeaf(memberID) {
            this.moderatorCommand("undeaf", parseInt(memberID));
        }

        /**
         * 开启或关闭某位成员麦克风
         * @param {string} memberID 成员id
         * @param {string|boolean|undefined} what 执行何种动作，默认toggle
         * @property {string} on 开启
         * @property {string} open 开启
         * @property {string} off 关闭
         * @property {string} close 关闭
         * @property {string} toggle 切换
         * @property {boolean} true 关闭
         * @property {boolean} false 开启
         * @returns {void}
         */
        muteMic(memberID, what = 'toggle') {
            if (typeof what === 'string') {
                switch (what) {
                    case "on":
                    case "open":
                        this.moderatorCommand("unmute", parseInt(memberID));
                        break;
                    case "off":
                    case "close":
                        this.moderatorCommand("mute", parseInt(memberID));
                        break;
                    case "toggle":
                    default:
                        this.moderatorCommand("tmute", parseInt(memberID));
                        break;
                }
            } else {
                what ? this.moderatorCommand("mute", parseInt(memberID)) : this.moderatorCommand("unmute", parseInt(memberID));
            }
        }

        /**
         * 切换某位成员麦克风
         */
        toggleMic(memberID) {
            return this.muteMic(memberID, 'toggle');
        }

        /**
         * 开启或关闭某位成员相机
         * @param {string} memberID 成员id
         * @param {string|boolean|undefined} what 执行何种动作，默认toggle
         * @property {string} on 开启
         * @property {string} open 开启
         * @property {string} off 关闭
         * @property {string} close 关闭
         * @property {string} toggle 切换
         * @property {boolean} true 关闭
         * @property {boolean} false 开启
         * @returns {void}
         */
        muteCamera(memberID, what = 'toggle') {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            if (typeof what === 'string') {
                switch (what) {
                    case "on":
                    case "open":
                        this.moderatorCommand("unvmute", parseInt(memberID));
                        break;
                    case "off":
                    case "close":
                        this.moderatorCommand("vmute", parseInt(memberID));
                        break;
                    case "toggle":
                    default:
                        this.moderatorCommand("tvmute", parseInt(memberID));
                        break;
                }
            } else {
                what ? this.moderatorCommand("vmute", parseInt(memberID)) : this.moderatorCommand("unvmute", parseInt(memberID));
            }
        }

        /**
         * 切换某位成员相机
         */
        toggleCamera(memberID) {
            return this.muteCamera(memberID, 'toggle');
        }

        /**
         * 踢出某位成员
         * @param {string} memberID 成员id
         * @returns {void}
         */
        kick(memberID) {
            this.moderatorCommand("kick", parseInt(memberID));
        }

        /**
         * 指定某位成员为主讲人
         * @param {string} memberID 成员id
         * @returns {void}
         */
        presenter(memberID) {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            this.moderatorCommand("vid-res-id", parseInt(memberID), "presenter");
        }

        /**
         * 设置某位成员视频为floor
         * @param {string} memberID 成员id
         * @returns {void}
         */
        videoFloor(memberID) {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            this.moderatorCommand("vid-floor", parseInt(memberID), "force");
        }

        /**
         * 设置某位成员视频banner
         * @param {string} memberID 成员id
         * @param {string} text banner文本内容
         * @returns {void}
         */
        videoBanner(memberID, text) {
            if (!this.isVideo) {
                logger.warn("The conference has no video.");
                return;
            }
            this.moderatorCommand("vid-banner", parseInt(memberID), encodeURI(text));
        }

        /**
         * 重置某位成员视频banner
         * @param {string} memberID 成员id
         * @returns {void}
         */
        resetVideoBanner(memberID) {
            this.videoBanner(memberID, 'reset');
        }

        /**
         * 转呼某位成员
         * @param {string} memberID 成员id
         * @param {string} destination_number 目标号码
         * @returns {void}
         */
        transfer(memberID, destination_number) {
            this.moderatorCommand("transfer", parseInt(memberID), destination_number);
        }

        /**
         * 减小某位成员的输出音量
         * @param {string} memberID 成员id
         * @returns {void}
         */
        volumeDown(memberID) {
            this.moderatorCommand("volume_out", parseInt(memberID), "down");
        };

        /**
         * 增大某位成员的输出音量
         * @param {string} memberID 成员id
         * @returns {void}
         */
        volumeUp(memberID) {
            this.moderatorCommand("volume_out", parseInt(memberID), "up");
        };

        /**
         * 减小某位成员的麦克风音量
         * @param {string} memberID 成员id
         * @returns {void}
         */
        gainDown(memberID) {
            this.moderatorCommand("volume_in", parseInt(memberID), "down");
        };

        /**
         * 增大某位成员的麦克风音量
         * @param {string} memberID 成员id
         * @returns {void}
         */
        gainUp(memberID) {
            this.moderatorCommand("volume_in", parseInt(memberID), "up");
        };

        /**
         * 结束组会，只有主持人可以结束组会
         * @returns {Promise<boolean>}
        */
        async close() {
            if (!this.isModerator) {
                logger.warn("The role is not moderator, can not call close command.");
                return false;
            }
            const members = this.liveArray.members();
            members.forEach(member => {
                if (member.number !== this.dialog.params.login)
                    this.kick(member.id);
            });
            return await this.hangup();
        }

        /**
         * 加入
         * @returns {Promise<void>}
         * @private
         */
        async join() {
            const self = this;
            if (self.state === ConferenceState.new) {
                await self._setState(ConferenceState.join);
            } else {
                logger.warn('The conference state is not new, can not execute join method.');
            }
        }

        /**
         * 挂断
         * @param {object|undefined} params 参数
         * @param {string|undefined} params.cause 原因文本
         * @param {number|undefined} params.causeCode 原因编码
         * @returns {Promise<boolean>}
         */
        async hangup(params) {
            this._hangupParams = params;
            return await this._setState(ConferenceState.hangup);
        }

        /**
         * 销毁
         * @returns {void}
         */
        destroy() {
            this._setState(ConferenceState.destroy);
        }

        onDestroy() {
            this.liveArray && this.liveArray.destroy();
            this.modChannel && this.verto.unsubscribeChannel(this.modChannel);
            this.infoChannel && this.verto.unsubscribeChannel(this.infoChannel);
            this.chatChannel && this.verto.unsubscribeChannel(this.chatChannel);
        }
    }
    Object.defineProperties(Conference, {
        /**
         * 组会状态
         * @type {ConferenceState}
         * @static
         * @readonly
         * @memberof Conference
        */
        State: {
            get: function () {
                return ConferenceState;
            }
        },
        /**
         * 组会成员信息
         * @type {ConferenceMemberInfo}
         * @static
         * @readonly
         * @memberof Conference     * 
        */
        MemberInfo: {
            get: function () {
                return ConferenceMemberInfo;
            }
        },
        /**
         * 组会实时数组
         * @type {ConferenceLiveArray}
         * @static
         * @readonly
         * @memberof Conference     * 
        */
        LiveArray: {
            get: function () {
                return ConferenceLiveArray;
            }
        },
        /**
         * 组会实时数组动作
         * @type {ConferenceLiveArrayAction}
         * @static
         * @readonly
         * @memberof Conference     * 
        */
        LiveArrayAction: {
            get: function () {
                return ConferenceLiveArrayAction;
            }
        }
    });

    function isStringNotEmpty(value) {
        return typeof value === 'string' && value.length > 0;
    }

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    /**
     * @param {object} target
     * @param {object} source
     * @returns {object}
     */
    function merge(target, source) {
        for (const property in source) {
            if (source.hasOwnProperty(property)) {
                const targetValue = target[property];
                const sourceValue = source[property];
                //判断targetValue是否有值
                if (!isDefined(targetValue)) {
                    //targetValue无值时，直接将target[property]赋值为sourceValue
                    target[property] = sourceValue;
                } else {
                    //targetValue有值时，判断targetValue与sourceValue是否Object类型
                    if (isObject(targetValue) && isObject(sourceValue)) {
                        //targetValue与sourceValue都是Object类型，合并targetValue与sourceValue
                        merge(targetValue, sourceValue);
                    } else if (isDefined(sourceValue)) {
                        //sourceValue有值时覆盖掉target[property]
                        target[property] = sourceValue;
                    }
                }
            }
        }
    }
    /**
     * 对象深度递归混合
     * 
     * 将多个对象深度递归混合为一个对象
     * 
     * 与deepAssign混合方式一样，区别是如果后一个对象的某属性值为undefined或null，则不会覆盖掉前一个对象的同属性值
     * 
     * @param {object} target 目标对象
     * @param {Array<object>} sources 源对象数组
     * @returns {object} 返回target目标对象
     */
    function deepMix(target = {}, ...sources) {
        if (!sources || sources.length === 0)
            return target;
        sources.forEach(source => {
            merge(target, source);
        });
        return target;
    }
    Object.deepMix = deepMix;

    /**
     * 生成GUID
     * @returns {string}
    */
    const generateGUID = (typeof window !== 'undefined' && window.crypto && typeof window.crypto.getRandomValues === 'function') ?
        function () {
            // If we have a cryptographically secure PRNG, use that
            // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
            const buf = new Uint16Array(8);
            window.crypto.getRandomValues(buf);
            function S4(num) {
                let ret = num.toString(16);
                while (ret.length < 4) {
                    ret = "0" + ret;
                }
                return ret;
            }        return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
        } : function () {
            // Otherwise, just use Math.random
            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                let r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

    /**
     * @param {MediaStream} stream
     * @returns {void}
     */
    function stopMediaStream(stream) {
        stream && stream.getTracks().forEach(function (track) { track.stop(); });
    }

    const devicesHash = new HashArray();
    /**
     * 视频输入设备列表
     * @type {Array<MediaDeviceInfo>}
    */
    const videoInDevices = [];
    /**
     * 音频输入设备列表
     * @type {Array<MediaDeviceInfo>}
    */
    const audioInDevices = [];
    /**
     * 音频输出设备列表
     * @type {Array<MediaDeviceInfo>}
    */
    const audioOutDevices = [];

    /**
     * 枚举本地媒体设备
     * @param {Function} callback
     * @returns {Promise}
     */
    async function enumerateMediaDevices(callback) {
        logger.info("enumerate media devices start.");
        devicesHash.clear();
        audioInDevices.length = 0;
        audioOutDevices.length = 0;
        videoInDevices.length = 0;
        let video_count = 0, audio_count = 0;

        /**
         * @param {Array<MediaDeviceInfo>} devices
         * @returns {object}
         */
        function gotDevices(devices) {
            // Handles being called several times to update labels. Preserve values.
            for (let i = 0, len = devices.length; i < len; i++) {
                const deviceInfo = devices[i];
                // logger.log(deviceInfo);

                let label = "";
                if (deviceInfo.kind === 'audioinput') {
                    label = deviceInfo.label || 'microphone ' + (audioInDevices.length + 1);
                    const device = {
                        label,
                        id: deviceInfo.deviceId,
                        kind: deviceInfo.kind,
                        groupId: deviceInfo.groupId,
                    };
                    audioInDevices.push(device);
                    devicesHash.set(label, device);
                } else if (deviceInfo.kind === 'audiooutput') {
                    label = deviceInfo.label || 'speaker ' + (audioOutDevices.length + 1);
                    const device = {
                        label,
                        id: deviceInfo.deviceId,
                        kind: deviceInfo.kind,
                        groupId: deviceInfo.groupId,
                    };
                    audioOutDevices.push(device);
                    devicesHash.set(label, device);
                } else if (deviceInfo.kind === 'videoinput') {
                    label = deviceInfo.label || 'camera ' + (videoInDevices.length + 1);
                    const device = {
                        label,
                        id: deviceInfo.deviceId,
                        kind: deviceInfo.kind,
                        groupId: deviceInfo.groupId,
                    };
                    videoInDevices.push(device);
                    devicesHash.set(label, device);
                } else {
                    logger.log('Some other kind of source/device: ', deviceInfo);
                }
            }

            logger.info("Audio In Devices", audioInDevices);
            logger.info("Audio Out Devices", audioOutDevices);
            logger.info("Video In Devices", videoInDevices);

            const result = { audioInDevices, audioOutDevices, videoInDevices };
            isFunction(callback) && callback(result);
            return result;
        }

        function handleError(error) {
            logger.error('enumerate media devices error: ', error);
            isFunction(callback) && callback(false, error);
        }

        try {
            let devices = await navigator.mediaDevices.enumerateDevices();
            for (let i = 0, len = devices.length; i < len; i++) {
                if (devices[i].kind === 'audioinput') {
                    audio_count++;
                } else if (devices[i].kind === 'videoinput') {
                    video_count++;
                }
            }
            const has_audio = audio_count > 0 ? true : false;
            const has_video = video_count > 0 ? true : false;
            if (has_audio || has_video) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: has_audio, video: has_video });
                stopMediaStream(stream);
                devices = await navigator.mediaDevices.enumerateDevices();
            }
            return gotDevices(devices);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
    /**
     * 根据设备label获取设备id
     * @param {string} label
     * @returns {string}
     */
    function getDeviceIdByLabel(label) {
        const device = devicesHash.get(label);
        if (device) {
            return device.id;
        } else {
            logger.warn('Not found device by ' + label);
        }
    }
    /**
     * 获取媒体约束条件
     * @param {object|undefined} options
     * @param {object|undefined} options.deviceParams
     * @param {boolean|undefined} options.wantVideo
     * @returns {object}
     */
    function getUserMediaConstraints(options = {}) {
        const deviceParams = options.deviceParams || {};
        let audio, video;

        if (deviceParams.useMic === 'none' || audioInDevices.length === 0) {
            audio = false;
        } else {
            audio = deepMix({}, deviceParams.audioConstraints);
            if (deviceParams.useMicLabel)
                deviceParams.useMic = getDeviceIdByLabel(deviceParams.useMicLabel) || 'default';
            if (deviceParams.useMic && deviceParams.useMic !== 'default')
                audio.deviceId = deviceParams.useMic;
        }

        if (!options.wantVideo || deviceParams.useCamera === 'none' || videoInDevices.length === 0) {
            video = false;
        } else {
            video = deepMix({}, deviceParams.videoConstraints);
            if (deviceParams.useCameraLabel)
                deviceParams.useCamera = getDeviceIdByLabel(deviceParams.useCameraLabel) || 'default';
            if (deviceParams.useCamera && deviceParams.useCamera !== 'default')
                video.deviceId = deviceParams.useCamera;
        }
        const result = { audio, video };
        logger.log('getUserMediaConstraints:', result);
        return result;
    }
    /**
     * 获取本地媒体流
     * @param {object|undefined} options
     * @param {MediaStreamConstraints|undefined} options.constraints
     * @param {MediaTrackConstraints|undefined} options.constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @param {MediaTrackConstraints|undefined} options.constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
     * @param {Function|undefined} options.onSuccess
     * @param {Function|undefined} option.onError
     * @returns {Promise<MediaStream>}
     */
    async function getUserMediaStream(options = {}) {
        logger.log('getUserMediaStream start:', options);
        const constraints = options.constraints || {
            audio: audioInDevices.length > 0 ? true : false,
            video: videoInDevices.length > 0 ? true : false,
        };

        try {
            logger.log('getUserMediaStream constraints:', constraints);
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            logger.info('getUserMediaStream success:', stream);
            isFunction(options.onSuccess) && options.onSuccess(stream);
            return stream;
        } catch (error) {
            logger.error('getUserMediaStream error:', error);
            isFunction(options.onError) && options.onError(error);
            throw error;
        }
    }

    /**
     * @import Dialog from "./Dialog.js";
    */

    // Find the line in sdpLines that starts with |prefix|, and, if specified,
    // contains |substr| (case-insensitive search).
    function findLine(sdpLines, prefix, substr) {
        return findLineInRange(sdpLines, 0, -1, prefix, substr);
    }

    // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
    // and, if specified, contains |substr| (case-insensitive search).
    function findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
        const realEndLine = sdpLines.length;
        for (let i = startLine; i < realEndLine; ++i) {
            if (sdpLines[i].indexOf(prefix) === 0) {
                if (!substr || sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
                    return i;
                }
            }
        }
        return null;
    }

    // Gets the codec payload type from an a=rtpmap:X line.
    function getCodecPayloadType(sdpLine) {
        const pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
        const result = sdpLine.match(pattern);
        return (result && result.length == 2) ? result[1] : null;
    }

    // Sets Opus in stereo if stereo is enabled, by adding the stereo=1 fmtp param.
    function stereoHack(self, sdp) {
        if (!self.dialog.deviceParams.useStereo) {
            return sdp;
        }

        const sdpLines = sdp.split('\r\n');

        // Find opus payload.
        const opusIndex = findLine(sdpLines, 'a=rtpmap', 'opus/48000');
        let opusPayload;

        if (!opusIndex) {
            return sdp;
        } else {
            opusPayload = getCodecPayloadType(sdpLines[opusIndex]);
        }

        // Find the payload in fmtp line.
        const fmtpLineIndex = findLine(sdpLines, 'a=fmtp:' + opusPayload.toString());

        if (fmtpLineIndex === null) {
            // create an fmtp line
            sdpLines[opusIndex] = sdpLines[opusIndex] + '\r\na=fmtp:' + opusPayload.toString() + " stereo=1; sprop-stereo=1";
        } else {
            // Append stereo=1 to fmtp line.
            sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; stereo=1; sprop-stereo=1');
        }

        sdp = sdpLines.join('\r\n');
        return sdp;
    }

    /**
     * @param {FSRTC} self
     * @param {string} cbName
     * @param {...any} args
     * @returns {void}
     */
    function doCallback(self, cbName, ...args) {
        isFunction(self.callbacks[cbName]) && self.callbacks[cbName](self, ...args);
    }

    function onLocalStreamError(self, e) {
        logger.log('There has been a problem retrieving the streams - did you allow access? Check Device Resolution', e);
        doCallback(self, "onError", e);
    }

    function onLocalStreamSuccess(self, stream) {
        // logger.log("Stream Success");
        doCallback(self, "onLocalStream", stream);
    }

    function onRemoteStreamSuccess(self, stream) {
        logger.log("Remote Stream Success");
        doCallback(self, "onRemoteStream", stream);
    }

    function onIceCandidate(self, candidate) {
        // logger.log('onIceCandidate:', candidate);
        self.mediaData.candidate = candidate;
        self.mediaData.candidateList.push(self.mediaData.candidate);

        doCallback(self, "onIceCandidate", candidate);
    }

    /**
     * @param {FSRTC} self
     * @param {RTCSessionDescription} sd
     * @returns {void}
     */
    function onIceSDP(self, sd) {
        self.mediaData.SDP = stereoHack(self, sd.sdp);
        logger.log("onIceSDP:", self.mediaData);
        doCallback(self, "onIceSDP", self.mediaData.SDP);
    }

    function onChannelError(self, e) {
        // logger.error("Channel Error", e);
        doCallback(self, "onError", e);
    }

    // function onAnswerSDP(self, sdp) {
    //     self.answer.SDP = stereoHack(self, sdp.sdp);
    //     logger.log("ICE ANSWER SDP");
    //     doCallback(self, "onAnswerSDP", self.answer.SDP);
    // }

    // function onMessage(self, msg) {
    //     logger.log("Message");
    //     doCallback(self, "onICESDP", msg);
    // }

    function onRemoteStream(self, stream) {
        self.remoteStream = stream;
        onRemoteStreamSuccess(self, stream);
    }

    /**
     * @param {FSRTC} self
     * @param {RTCSessionDescription} sd
     * @returns {void}
     */
    function onOfferSDP(self, sd) {
        self.mediaData.SDP = stereoHack(self, sd.sdp);
        // logger.log("onOfferSDP:", self.mediaData);
        doCallback(self, "onOfferSDP", self.mediaData.SDP);
    }

    function FSRTCPeerConnection(options = {}) {
        const config = {};

        ensureIceServers(config, options);

        config.bundlePolicy = "max-compat";
        config.sdpSemantics = "unified-plan";

        // logger.log('Create Peer:', config);
        const peer = new window.RTCPeerConnection(config);

        openOffererChannel();

        let gathering = false, done = false;
        function ice_complete() {
            done = true;
            gathering = null;

            isFunction(options.onIceSDP) && options.onIceSDP(peer.localDescription);
        }

        peer.onicecandidate = function (event) {
            // logger.log('Peer onicecandidate:', event);
            if (done) {
                return;
            }

            if (!gathering) {
                gathering = setTimeout(ice_complete, 1000);
            }

            if (event) {
                event.candidate && isFunction(options.onIceCandidate) && options.onIceCandidate(event.candidate);
            } else {
                done = true;

                if (gathering) {
                    clearTimeout(gathering);
                    gathering = null;
                }

                ice_complete();
            }
        };

        if (options.attachStream) {
            // FreeSWITCH currently orders its answer SDP such that audio m-lines
            // always come first, adding the tracks to the peer in that order
            // prevents possible m-line ordering validation errors on the client.
            options.attachStream.getAudioTracks().forEach(function (track) { peer.addTrack(track, options.attachStream); });
            options.attachStream.getVideoTracks().forEach(function (track) { peer.addTrack(track, options.attachStream); });
        }

        if (options.attachStreams && options.attachStreams.length) {
            const streams = options.attachStreams;
            for (var i = 0; i < streams.length; i++) {
                peer.addStream(streams[i]);
            }
        }

        peer.ontrack = function (event) {
            // logger.log('Peer ontrack:', event);
            // var remoteMediaStream = event.stream;
            const remoteMediaStream = event.streams[0];

            remoteMediaStream.oninactive = function () {
                if (options.onRemoteStreamEnded) options.onRemoteStreamEnded(remoteMediaStream);
            };

            isFunction(options.onRemoteStream) && options.onRemoteStream(remoteMediaStream);
        };

        function createOffer() {
            if (!isFunction(options.onOfferSDP)) return;
            logger.log('Peer CreateOffer:', options.offerOptions);
            // peer.createOffer(function (sessionDescription) {
            //     sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
            //     peer.setLocalDescription(sessionDescription);
            //     options.onOfferSDP(sessionDescription);
            // }, onSdpError, options.offerOptions);
            peer.createOffer(options.offerOptions)
                .then(function (sessionDescription) {
                    logger.log('Peer CreateOffer success:', sessionDescription);
                    sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
                    peer.setLocalDescription(sessionDescription);
                    options.onOfferSDP(sessionDescription);
                })
                .catch(onSdpError);
        }

        function createAnswer() {
            if (options.type !== "answer") return;
            logger.log('Peer CreateAnswer:', options.offerSDP);
            //options.offerSDP.sdp = addStereo(options.offerSDP.sdp);
            // peer.setRemoteDescription(new window.RTCSessionDescription(options.offerSDP), onSdpSuccess, onSdpError);
            peer.setRemoteDescription(new window.RTCSessionDescription(options.offerSDP))
                .then(onSdpSuccess)
                .catch(onSdpError);
            // peer.createAnswer(function (sessionDescription) {
            //     sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
            //     peer.setLocalDescription(sessionDescription);
            //     if (options.onAnswerSDP) {
            //         options.onAnswerSDP(sessionDescription);
            //     }
            // }, onSdpError);
            peer.createAnswer()
                .then(function (sessionDescription) {
                    sessionDescription.sdp = serializeSdp(sessionDescription.sdp);
                    peer.setLocalDescription(sessionDescription);
                    isFunction(options.onAnswerSDP) && options.onAnswerSDP(sessionDescription);
                })
                .catch(onSdpError);
        }

        // if ((options.onChannelMessage) || !options.onChannelMessage) {
        createOffer();
        createAnswer();
        // }

        function serializeSdp(sdp) {
            return sdp;
        }

        // DataChannel management
        /** @type {RTCDataChannel} */
        let channel;

        function openOffererChannel() {
            if (!options.onChannelMessage) return;

            _openOffererChannel();

            return;
        }

        function _openOffererChannel() {
            const label = options.channel || 'RTCDataChannel';
            logger.log('Peer CreateChannel:', label);
            channel = peer.createDataChannel(label, {
                reliable: false
            });

            setChannelEvents();
        }

        function setChannelEvents() {
            channel.onmessage = function (event) {
                logger.log('Channel Message:', event);
                isFunction(options.onChannelMessage) && options.onChannelMessage(event);
            };
            channel.onopen = function (event) {
                logger.log('Channel Open:', event);
                isFunction(options.onChannelOpened) && options.onChannelOpened(event);
            };
            channel.onclose = function (event) {
                logger.warn('Channel Close:', event);
                isFunction(options.onChannelClosed) && options.onChannelClosed(event);
            };
            channel.onerror = function (event) {
                logger.error('Channel Error:', event);
                isFunction(options.onChannelError) && options.onChannelError(event);
            };
        }

        function onSdpSuccess() {
            logger.log('sdp success.');
        }

        function onSdpError(e) {
            logger.error('sdp error:', e);
            isFunction(options.onChannelError) && options.onChannelError(e);
        }

        return {
            addAnswerSDP: function (config, onSuccess, onError) {
                logger.log('Peer addAnswerSDP:', config);
                // peer.setRemoteDescription(new window.RTCSessionDescription(config), onSuccess ? onSuccess : onSdpSuccess, onError ? onError : onSdpError);
                peer.setRemoteDescription(new window.RTCSessionDescription(config))
                    .then(isFunction(onSuccess) ? onSuccess : onSdpSuccess)
                    .catch(isFunction(onError) ? onError : onSdpError);
            },
            addIceCandidate: function (config) {
                logger.log('Peer addIceCandidate:', config);
                peer.addIceCandidate(new window.RTCIceCandidate({
                    sdpMLineIndex: config.sdpMLineIndex,
                    candidate: config.candidate
                }));
            },
            peer: peer,
            channel: channel,
            sendData: function (data) {
                logger.log('Channel send:', data);
                channel && channel.send(data);
            },
            stop: function () {
                logger.log('Peer Stop.');
                if (options.attachStream instanceof MediaStream) {
                    stopMediaStream(options.attachStream);
                    options.attachStream = null;
                }
                peer.close();
            },
            replaceTrack: function (kind, track) {
                peer.getSenders().forEach(sender => {
                    if (sender.track.kind === kind) {
                        logger.log('found the sender by ' + kind + ", do replace track.", sender, track);
                        sender.replaceTrack(track);
                    }
                });
            }
        };
    }

    /**
     * 媒体流客户端，用于基于FreeSwitch和WebRTC协议的音视频流的发送和接收
     * @extends Destroyable
    */
    class FSRTC extends Destroyable {
        /**
         * @constructor
         * @param {Dialog} dialog
         * @param {object} callbacks 回调通知
         * @param {Function} callbacks.onIceCandidate
         * @param {Function} callbacks.onIceSDP
         * @param {Function} callbacks.onOfferSDP
         * @param {Function} callbacks.onError
         * @param {Function} callbacks.onLocalStream
         * @param {Function} callbacks.onRemoteStream
        */
        constructor(dialog, callbacks) {
            super();
            Check.defined('dialog', dialog);

            this.dialog = dialog;
            this.client = dialog.client;
            this.callbacks = deepMix({
                onIceCandidate: null,
                onIceSDP: null,
                onOfferSDP: null,
                onError: null,
                onLocalStream: null,
                onRemoteStream: null,
            }, callbacks);

            this.micEnabled = this.dialog.deviceParams.useMic !== "none" ? true : false;
            this.cameraEnabled = this.dialog.deviceParams.useCamera !== "none" ? true : false;
            this.voiceEnabled = true;

            this.hasVideo = false;
            this.mediaData = {
                SDP: null,
                profile: {},
                candidateList: []
            };

            this.offerOptions = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            };

            /** @type {FSRTCPeerConnection} */
            this.peer;
            /** @type {MediaStream} */
            this.localStream;
            /** @type {MediaStream} */
            this.remoteStream;
        }

        /**
         * @param {boolean} value
         */
        set offerToReceiveAudio(value) {
            this.offerOptions.offerToReceiveAudio = value;
        }

        /**
         * @returns {boolean}
         */
        get offerToReceiveAudio() {
            return this.offerOptions.offerToReceiveAudio;
        }

        /**
         * @param {boolean} value
         */
        set offerToReceiveVideo(value) {
            this.offerOptions.offerToReceiveVideo = value;
        }

        /**
         * @returns {boolean}
         */
        get offerToReceiveVideo() {
            return this.offerOptions.offerToReceiveVideo;
        }

        /**
         * 呼叫
         * @returns {void}
         */
        call(params = {}) {
            const self = this;
            self.type = "offer";
            self.offerToReceiveAudio = self.dialog.deviceParams.useSpeaker === "none" ? false : true;
            self.offerToReceiveVideo = self.dialog.wantVideo ? true : false;

            let screen = false;
            if (params.screenShare) { //self.videoConstraints.chromeMediaSource == 'desktop') {
                screen = true;
            }

            function onSuccess(stream) {
                self.localStream = stream;

                if (screen) {
                    self.offerOptions.offerToReceiveVideo = false;
                    self.offerOptions.offerToReceiveAudio = false;
                    self.offerOptions.offerToSendAudio = false;
                }

                self.peer = FSRTCPeerConnection({
                    type: self.type,
                    attachStream: self.localStream,
                    onIceCandidate: function (candidate) {
                        return onIceCandidate(self, candidate);
                    },
                    onIceSDP: function (sd) {
                        return onIceSDP(self, sd);
                    },
                    onRemoteStream: screen ? function (stream) { } : function (stream) {
                        return onRemoteStream(self, stream);
                    },
                    onOfferSDP: function (sd) {
                        return onOfferSDP(self, sd);
                    },
                    onChannelError: function (e) {
                        return onChannelError(self, e);
                    },
                    offerOptions: self.offerOptions,
                    turnServer: self.client.turnServer,
                    iceServers: self.client.iceServers,
                });

                onLocalStreamSuccess(self, stream);
            }

            function onError(e) {
                onLocalStreamError(self, e);
            }

            if (params.mediaStream) {
                onSuccess(params.mediaStream);
                return;
            }

            const constraints = getUserMediaConstraints(self.dialog);
            self.hasVideo = constraints.video === false ? false : true;

            // logger.log("Audio constraints", constraints.audio);
            // logger.log("Video constraints", constraints.video);

            if (constraints.audio || constraints.video) {
                getUserMediaStream({
                    constraints, onSuccess, onError,
                });
            } else {
                onSuccess(null);
            }
        }

        /**
         * 应答
         * @param {object} params
         * @returns {void}
         */
        answer(params) {
            const self = this;
            self.type = "answer";
            self.remoteSDP = params.sdp;
            self.offerToReceiveAudio = self.dialog.deviceParams.useSpeaker === "none" ? false : true;
            self.offerToReceiveVideo = self.dialog.wantVideo ? true : false;
            // logger.debug("inbound sdp: ", params.sdp);

            function onSuccess(stream) {
                self.localStream = stream;

                self.peer = FSRTCPeerConnection({
                    type: self.type,
                    attachStream: self.localStream,
                    onIceCandidate: function (candidate) {
                        return onIceCandidate(self, candidate);
                    },
                    onIceSDP: function (sd) {
                        return onIceSDP(self, sd);
                    },
                    onRemoteStream: function (stream) {
                        return onRemoteStream(self, stream);
                    },
                    onChannelError: function (e) {
                        return onChannelError(self, e);
                    },
                    offerOptions: self.offerOptions,
                    offerSDP: {
                        type: "offer",
                        sdp: self.remoteSDP
                    },
                    turnServer: self.client.turnServer,
                    iceServers: self.client.iceServers,
                });

                onLocalStreamSuccess(self, stream);
            }

            function onError(e) {
                onLocalStreamError(self, e);
            }

            if (params.mediaStream) {
                onSuccess(params.mediaStream);
                return;
            }

            const constraints = getUserMediaConstraints(self.dialog);
            self.hasVideo = constraints.video === false ? false : true;

            // logger.log("Audio constraints", constraints.audio);
            // logger.log("Video constraints", constraints.video);

            if (constraints.audio || constraints.video) {
                getUserMediaStream({
                    constraints, onSuccess, onError,
                });
            } else {
                onSuccess(null);
            }
        }

        /**
         * sdp应答
         * @param {string} sdp
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {void}
         */
        handleAnswerSDP(sdp, onSuccess, onError) {
            this.peer && this.peer.addAnswerSDP({
                type: "answer",
                sdp: sdp
            }, onSuccess, onError);
        }

        get micMuted() {
            return !this.micEnabled;
        }

        muteMic(what) {
            const self = this;
            if (!self.localStream) {
                return false;
            }

            if (typeof what === 'string') {
                switch (what) {
                    case "on":
                    case "open":
                        self.micEnabled = true;
                        break;
                    case "off":
                    case "close":
                        self.micEnabled = false;
                        break;
                    case "toggle":
                        self.micEnabled = !self.micEnabled;
                }
            } else {
                self.micEnabled = what ? false : true;
            }

            self.localStream.getAudioTracks().forEach(function (track) {
                track.enabled = self.micEnabled;
            });

            return self.micEnabled;
        }

        get cameraMuted() {
            return !this.cameraEnabled;
        }

        muteCamera(what) {
            const self = this;
            if (!self.localStream) {
                return false;
            }

            if (typeof what === 'string') {
                switch (what) {
                    case "on":
                    case "open":
                        self.cameraEnabled = true;
                        break;
                    case "off":
                    case "close":
                        self.cameraEnabled = false;
                        break;
                    case "toggle":
                        self.cameraEnabled = !self.cameraEnabled;
                }
            } else {
                self.cameraEnabled = what ? false : true;
            }

            self.localStream.getVideoTracks().forEach(function (track) {
                track.enabled = self.cameraEnabled;
            });

            return self.cameraEnabled;
        }

        get voiceMuted() {
            return !this.voiceEnabled;
        }

        muteVoice(what) {
            const self = this;
            if (!self.remoteStream) {
                return false;
            }

            if (typeof what === 'string') {
                switch (what) {
                    case "on":
                    case "open":
                        self.voiceEnabled = true;
                        break;
                    case "off":
                    case "close":
                        self.voiceEnabled = false;
                        break;
                    case "toggle":
                        self.voiceEnabled = !self.voiceEnabled;
                }
            } else {
                self.voiceEnabled = what ? false : true;
            }

            self.remoteStream.getAudioTracks().forEach(function (track) {
                track.enabled = self.voiceEnabled;
            });

            return self.voiceEnabled;
        }

        /**
         * 切换本地媒体流
         * @param {MediaStreamConstraints} constraints 获取媒体流约束条件
         * @param {MediaTrackConstraints|undefined} constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
         * @param {MediaTrackConstraints|undefined} constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
         * @returns {Promise<boolean>}
         */
        async switchMediaStream(constraints) {
            logger.log('switchMediaStream:', constraints);
            if (!constraints) return;
            // 音视频约束条件都不存在
            if (!constraints.audio && !constraints.video) return;

            const self = this;
            if (!self.localStream) return;

            // 获取原来的约束条件
            const originConstraints = getUserMediaConstraints(self.dialog);
            // 合并约束条件
            let audio = false, video = false;
            if (constraints.audio)
                audio = deepMix({}, originConstraints.audio, constraints.audio);
            if (constraints.video) {
                video = deepMix({}, originConstraints.video, constraints.video);
                // 指定了deviceId，移除facingMode
                if (constraints.video.deviceId) delete video.facingMode;
                // 指定了facingMode，移除deviceId
                else if (constraints.video.facingMode) delete video.deviceId;
            }
            logger.log('merged constraints:', audio, video);

            // 先停止本地媒体流
            if (constraints.audio) {
                // 停止本地音频轨道
                self.localStream.getAudioTracks().forEach(track => {
                    track.stop();
                    self.localStream.removeTrack(track);
                });
            }
            if (constraints.video) {
                // 停止本地视频轨道
                self.localStream.getVideoTracks().forEach(track => {
                    track.stop();
                    self.localStream.removeTrack(track);
                });
            }
            // 重新获取媒体流
            const stream = await getUserMediaStream({ constraints: { audio, video } });
            if (!stream) return;
            // 存在音频约束条件时
            if (constraints.audio) {
                const tracks = stream.getAudioTracks();
                // 存在音频轨道时
                if (tracks && tracks.length > 0) {
                    const track = tracks[0];
                    // 切换远端轨道
                    self.peer.replaceTrack('audio', track);
                    // 切换本地音频轨道
                    self.localStream.addTrack(track);
                }
            }
            // 存在视频约束条件时
            if (constraints.video) {
                const tracks = stream.getVideoTracks();
                // 存在视频轨道时
                if (tracks && tracks.length > 0) {
                    const track = tracks[0];
                    // 切换远端轨道
                    self.peer.replaceTrack('video', track);
                    // 切换本地视频轨道
                    self.localStream.addTrack(track);
                }
            }
            return true;
        }

        stopPeer() {
            this.peer && this.peer.stop();
        }

        stop() {
            const self = this;

            if (self.localStream) {
                logger.log("Stopping localStream:", self.localStream);
                stopMediaStream(self.localStream);
                self.localStream = null;
            }

            self.stopPeer();
        }

        onDestroy() {
            this.stop();
        }
    }

    /**
     * @import VertoClient, { DeviceParams } from "./VertoClient.js";
    */

    /**
     * 会话方向
     * @enum {string} Direction
     * @property {string} inbound 呼入
     * @property {string} outbound 呼出
     * @readonly
     */
    const Direction = Object.freeze({
        inbound: 'inbound',
        outbound: 'outbound',
    });

    /**
     * 会话状态
     * @enum {string} DialogState
     * @property {string} new 新建会话
     * @property {string} readying 会话准备中，获取本地媒体流，建立RTCPeerConnection
     * @property {string} inviting 发送会话邀请请求
     * @property {string} trying 发送会话邀请成功，FreeSwitch尝试呼叫
     * @property {string} waiting 呼叫成功，对方已响铃，获取到FreeSwitch下发的早期流媒体，等待对方应答
     * @property {string} ringing 响铃中
     * @property {string} answering 发送会话接听请求
     * @property {string} attaching 发送会话恢复请求
     * @property {string} active 会话已建立，通话中
     * @property {string} holding 会话保持中
     * @property {string} hangup 挂断会话
     * @property {string} destroy 销毁会话
     * @readonly
     */
    const DialogState = Object.freeze({
        new: 'new',
        readying: 'readying',
        inviting: 'inviting',
        trying: 'trying',
        ringing: 'ringing',
        waiting: 'waiting',
        answering: 'answering',
        attaching: 'attaching',
        active: 'active',
        holding: 'holding',
        hangup: 'hangup',
        destroy: 'destroy',
    });

    const dialogValidStatesChange = Object.freeze({
        new: {
            readying: true,
            inviting: true,
            ringing: true,
            answering: true,
            attaching: true,
            hangup: true,
            destroy: true,
        },
        readying: {
            inviting: true,
            ringing: true,
            answering: true,
            attaching: true,
            hangup: true,
            destroy: true,
        },
        inviting: {
            trying: true,
            hangup: true,
            active: true
        },
        trying: {
            active: true,
            waiting: true,
            hangup: true
        },
        waiting: {
            hangup: true,
            active: true
        },
        ringing: {
            readying: true,
            answering: true,
            attaching: true,
            hangup: true
        },
        answering: {
            active: true,
            hangup: true,
        },
        attaching: {
            active: true,
            hangup: true,
        },
        active: {
            inviting: true,
            answering: true,
            attaching: true,
            hangup: true,
            holding: true,
        },
        holding: {
            active: true,
            hangup: true,
        },
        hangup: {
            destroy: true
        },
        destroy: {},
    });

    /**
     * 检查状态变化是否合法
     * @param {DialogState} oldS
     * @param {DialogState} newS
     * @returns {boolean}
     * @private
     */
    function checkDialogStateChangeValid(oldS, newS) {
        return dialogValidStatesChange[oldS][newS];
    }

    /**
     * @param {Dialog} dialog
     * @returns {string}
     * @ignore
     */
    function getTargetCallNumber(dialog) {
        return dialog.direction === Direction.inbound ? dialog.callerNumber : dialog.calleeNumber
    }

    /**
     * @param {Dialog} dialog
     * @returns {string}
     * @ignore
     */
    function getTargetName(dialog) {
        return dialog.direction === Direction.inbound ? dialog.callerName : dialog.calleeName;
    }

    const send_keys = ['callID', 'sdp', 'destination_number', 'caller_id_name', 'caller_id_number', 'remote_caller_id_name', 'remote_caller_id_number', 'callee_id_name', 'callee_id_number', 'display_direction', 'login', 'wantVideo', 'screenShare'];

    /**
     * @param {HTMLMediaElement} element
     * @param {MediaStream} stream
     * @returns {void}
     * @ignore
     */
    function attachMediaStream(element, stream) {
        if (element && element instanceof HTMLMediaElement) {
            if (element.srcObject !== stream)
                element.srcObject = stream;
            else
                logger.warn('The element.srcObject equals with the stream.');
        } else {
            logger.error('Error attaching stream to element.', element);
        }
    }

    /**
     * 会话对象，发起呼叫或收到呼叫时生成该对象，同时在onDialogEvent事件回调中传递该对象
     * @extends Destroyable
    */
    let Dialog$1 = class Dialog extends Destroyable {
        /**
         * @constructor
         * @param {Direction} direction 呼叫方向，呼出还是呼入
         * @param {VertoClient} client 通讯客户端对象
         * @param {object|undefined} params 配置项
         * @param {boolean|undefined} params.wantVideo 呼叫或应答是否启用视频
         * @param {boolean|undefined} params.hasRemoteVideo 被叫时远程媒体流是否包含视频 
         * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
         * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
         * @param {number|undefined} params.overtime 等待接听超时时间，单位毫秒
         * @param {DeviceParams|undefined} params.deviceParams 设备相关参数
         * @param {Function|undefined} onDialogEvent Dialog事件回调通知
        */
        constructor(direction, client, params = {}, onDialogEvent) {
            super();
            Check.defined('direction', direction);
            Check.defined('client', client);

            const self = this;

            self.params = deepMix({
                wantVideo: false,
                hasRemoteVideo: false,
                screenShare: false,
                remoteTag: client.localParams.remoteTag,
                localTag: client.localParams.localTag,
                overtime: client.localParams.overtime,
                deviceParams: client.deviceParams,
            }, params);
            // logger.log('Create Dialog:', self.params);

            /**
             * 呼叫方向
             * @type {Direction}
            */
            this.direction = direction;
            self.client = client;
            self.onDialogEvent = onDialogEvent;

            /**
             * 当前的会话状态
             * @type {DialogState}
            */
            this.state = DialogState.new;
            /**
             * 之前的会话状态
             * @type {DialogState}
             * @private
            */
            self.lastState = self.state;
            self.answered = false;
            self.invited = false;
            self.attach = params.attach || false;
            self.gotAnswer = false;
            self.gotMedia = false;
            self.gotBye = false;
            self.sentBye = false;
            self._hangupParams = { cause: 'NORMAL_CLEARING', };

            if (!self.params.callID) self.params.callID = generateGUID();

            self.client.dialogs[self.callID] = self;

            // 含有远程视频，应答也启用视频
            if (self.params.hasRemoteVideo) self.params.wantVideo = true;

            if (self.direction === Direction.inbound) {
                // 呼入的caller_id_name包含-novideo字段，说明是音频通话，设置wantVideo为false
                if (self.params.caller_id_name && self.params.caller_id_name.endsWith("-novideo") > 0)
                    self.params.wantVideo = false;
                if (self.client.loginData.userVariables && self.client.loginData.userVariables.nickName)
                    self.params.callee_id_name = self.client.loginData.userVariables.nickName;
            } else {
                if (self.params.destination_number)
                    self.params.destinationNumber = self.params.destination_number;

                self.params.callee_id_number = self.destinationNumber;
                if (!self.params.callee_id_name) self.params.callee_id_name = self.destinationNumber;
                if (!self.params.caller_id_name) self.params.caller_id_name = self.userName;
                if (!self.params.caller_id_number) self.params.caller_id_number = self.userNumber;
            }

            if (self.client.rpcClient)
                self.rtc = new FSRTC(self, {
                    onIceSDP: function (rtc) {
                        // logger.log("RECV " + rtc.type + " SDP", rtc.mediaData.SDP);

                        // if (self.state === State.inviting || self.state === State.answering || self.state == State.active) {
                        //     location.reload();
                        //     return;
                        // }

                        if (rtc.type === "offer") { //attach or invite
                            if (self.isActive) {
                                self._setState(DialogState.attaching);
                                self._sendVertoMethod(VertoMethod.attach, {
                                    sdp: rtc.mediaData.SDP
                                });
                            } else {
                                self._setState(DialogState.inviting);
                                self._sendVertoMethod(VertoMethod.invite, {
                                    sdp: rtc.mediaData.SDP
                                });
                            }
                        } else { //attach or answer
                            if (self.attach) {
                                self._setState(DialogState.attaching);
                                self._sendVertoMethod(VertoMethod.attach, {
                                    sdp: rtc.mediaData.SDP
                                });
                            } else {
                                self._setState(DialogState.answering);
                                self._sendVertoMethod(VertoMethod.answer, {
                                    sdp: rtc.mediaData.SDP
                                });
                            }
                        }
                    },
                    onError: function (e) {
                        // logger.error("ERROR:", e);
                        self.hangup({ cause: "Device or Permission Error" });
                    },
                    /**
                     * @param {FSRTC} rtc
                     * @param {MediaStream} stream
                     * @returns {void}
                     * @private
                     */
                    onLocalStream: function (rtc, stream) {
                        if (rtc.hasVideo && self.localVideo)
                            attachMediaStream(self.localVideo, stream);
                        self._notifyEvent({
                            type: EventType.localStream,
                            stream,
                        });
                    },
                    /**
                     * @param {FSRTC} rtc
                     * @param {MediaStream} stream
                     * @returns {void}
                     * @private
                     */
                    onRemoteStream: function (rtc, stream) {
                        if (self.remoteAudio)
                            attachMediaStream(self.remoteAudio, stream);
                        self._notifyEvent({
                            type: EventType.remoteStream,
                            stream,
                        });
                    },
                });

            self._notifyStateChangeEvent();

            (async () => {
                if (self.direction === Direction.inbound) {
                    if (self.gotBye) return;

                    if (self.attach) {
                        self.answer();
                    } else {
                        self.ring();
                    }
                } else {
                    if (self.gotBye) return;

                    self.params.destination_number = self.destinationNumber;
                    self.call();
                }
            })();
        }

        /**
         * 用户号码
         * @returns {string}
         * @readonly
         */
        get userNumber() {
            return this.client.loginData.account;
        }

        /**
         * 用户名称
         * @returns {string}
         * @readonly
         */
        get userName() {
            if (this.client.loginData.userVariables && this.client.loginData.userVariables.nickName)
                return this.client.loginData.userVariables.nickName;
            else
                return this.userNumber;
        }

        /**
         * 呼叫目标号码，direction === Direction.outbound 时存在
         * @returns {string}
         * @readonly
         */
        get destinationNumber() {
            return this.params.destinationNumber;
        }

        /**
         * 会话id
         * @returns {string}
         * @readonly
        */
        get callID() {
            return this.params.callID;
        }

        /**
         * 获取设备相关参数
         * @returns {DeviceParams}
         * @readonly
        */
        get deviceParams() {
            return this.params.deviceParams;
        }

        /**
         * 是否视频呼叫
         * @returns {boolean}
         * @readonly
        */
        get wantVideo() {
            return this.params.wantVideo;
        }

        /**
         * 本地媒体流是否包含视频
         * @returns {boolean}
         * @readonly
         */
        get hasLocalVideo() {
            return this.rtc.hasVideo;
        }

        /**
         * 远程媒体流是否包含视频
         * @returns {boolean}
         * @readonly
         */
        get hasRemoteVideo() {
            return this.params.hasRemoteVideo;
        }

        /**
         * 呼叫者名称
         * @returns {string}
         * @readonly
         */
        get callerName() {
            return this.params.caller_id_name;
        }

        /**
         * 呼叫者号码
         * @returns {string}
         * @readonly
         */
        get callerNumber() {
            return this.params.caller_id_number;
        }

        /**
         * 被叫者名称
         * @returns {string}
         * @readonly
         */
        get calleeName() {
            return this.params.callee_id_name;
        }

        /**
         * 被叫者号码
         * @returns {string}
         * @readonly
         */
        get calleeNumber() {
            return this.params.callee_id_number;
        }

        /**
         * 会话远程用户号码
         * @returns {string}
         * @readonly
         */
        get remoteNumber() {
            return getTargetCallNumber(this);
        }

        /**
         * 会话远程用户名称
         * @returns {string}
         * @readonly
         */
        get remoteName() {
            return getTargetName(this);
        }

        /**
         * 是否通话中
         * @returns {boolean}
         */
        get isActive() {
            return this.state === DialogState.active;
        }

        /**
         * 是否通话保持中
         * @returns {boolean}
         */
        get isHolding() {
            return this.state === DialogState.holding;
        }

        /**
         * @private
         */
        _notifyEvent(event) {
            event.dialog = this;
            isFunction(this.onDialogEvent) && this.onDialogEvent(event);
        }

        /**
         * @private
         */
        _notifyStateChangeEvent() {
            this._notifyEvent({
                type: EventType.stateChange,
                state: this.state,
            });
        }

        /**
         * @private
         */
        _notifyErrorEvent(error) {
            this._notifyEvent({
                type: EventType.error,
                error,
            });
        }

        /**
         * @private
         */
        async _getMediaTags() {
            try {
                if (this.client.sessionManager)
                    return;
                this.remoteAudio = this.params.remoteTag ? await getMediaElementByTag(this.params.remoteTag) : null;
                this.remoteVideo = this.params.wantVideo ? this.remoteAudio : null;
                this.localVideo = this.params.localTag ? await getMediaElementByTag(this.params.localTag) : null;
            } catch (error) {
                logger.error(error);
            }
        }

        /**
         * @private
         */
        async _setState(state) {
            const self = this;
            if (self.isDestroyed() || self.state === DialogState.destroy)
                return false;

            if (self.state === state) {
                logger.warn("The state no change " + state);
                return false;
            }

            if (state !== DialogState.ringing) {
                self._stopRinging();
            }

            if (!checkDialogStateChangeValid(self.state, state)) {
                const msg = "Invalid state change from " + self.state + " to " + state;
                logger.error("Dialog " + self.callID + ": " + msg);
                self._notifyErrorEvent(new Error(msg));
                self.hangup({ cause: msg });
                return false;
            }

            logger.info("Dialog " + self.callID + ": Change state from " + self.state + " to " + state);
            self.lastState = self.state;
            self.state = state;
            self._notifyStateChangeEvent();

            switch (self.state) {
                case DialogState.readying:
                    await self._getMediaTags();
                    break;
                case DialogState.ringing:
                    setTimeout(function () {
                        if (self.state === DialogState.ringing)
                            self.hangup({ cause: 'RINGING_TIMEOUT' });
                    }, self.params.overtime);
                    break;
                case DialogState.waiting:
                case DialogState.active:
                    if (self.state === DialogState.waiting) {
                        setTimeout(function () {
                            if (self.state === DialogState.waiting)
                                self.hangup({ cause: 'CALL_TIMEOUT' });
                        }, self.params.overtime);
                    }

                    const speaker = self.deviceParams.useSpeaker;
                    logger.info("Using Speaker: ", speaker);

                    if (speaker && speaker !== "default" && speaker !== "none") {
                        setTimeout(function () {
                            self.setSpeakerDevice(speaker);
                        }, 500);
                    }

                    if (self.state === DialogState.active) {
                        //为避免状态异常，这里需要判断conference是否已生成，否则则由conference自己来调用join()
                        if (self.conference)
                            self.conference.join();
                    }
                    break;
                case DialogState.hangup:
                    if (!self.gotBye && !self.sentBye) {
                        if (self.client.sessionManager && self.session) {
                            if (self._hangupParams.cause === "CALL_REJECTED")
                                await self.client.sessionManager.decline(self.session);
                            else
                                await self.client.sessionManager.hangup(self.session);
                        } else
                            self._sendVertoMethod(VertoMethod.bye, self._hangupParams);
                        self.sentBye = true;
                    }
                    setTimeout(() => {
                        self._setState(DialogState.destroy);
                    }, 10);
                    break;
                case DialogState.destroy:
                    if (self.remoteAudio) self.remoteAudio.srcObject = null;
                    if (self.localVideo) self.localVideo.srcObject = null;
                    delete self.client.dialogs[self.callID];
                    if (self.params.screenShare) {
                        self.rtc && self.rtc.stopPeer();
                    } else {
                        self.rtc && self.rtc.stop();
                    }
                    super.destroy();
                    break;
            }
            return true;
        }

        /**
         * 处理通过sendMethod发送消息的结果
         * @param {string} method
         * @param {boolean} success
         * @param {object} e
         * @returns {void}
         * @private
         */
        _processResult(method, success, e) {
            const self = this;

            switch (method) {
                case VertoMethod.answer:
                case VertoMethod.attach:
                    if (success) {
                        self._setState(DialogState.active);
                    } else {
                        self.hangup(e.cause ? e : { cause: "CALL_" + method.toLocaleUpperCase() + "_FAILED" });
                    }
                    break;
                case VertoMethod.invite:
                    if (success) {
                        self._setState(DialogState.trying);
                    } else {
                        self.hangup(e.cause ? e : { cause: "CALL_" + method.toLocaleUpperCase() + "_FAILED" });
                    }
                    break;
                case VertoMethod.bye:
                    if (!success) //发送不成功，再次发送
                        self._sendVertoMethod(Method.bye, self._hangupParams);
                    break;
                case VertoMethod.modify:
                    if (e.holdState === "held") {
                        if (self.state !== DialogState.holding)
                            self._setState(DialogState.holding);
                    } else if (e.holdState === "active") {
                        if (self.state !== DialogState.active)
                            self._setState(DialogState.active);
                    }
                    break;
            }
        }

        /**
         * 发送Verto指令
         * @param {VertoMethod} method Verto指令
         * @param {object} params 指令内容
         * @returns {void}
         * @private
         */
        _sendVertoMethod(method, params) {
            if (this.isDestroyed())
                return;
            const self = this;

            params.dialogParams = {};

            for (const key in self.params) {
                if (key === "sdp" && method !== VertoMethod.invite && method !== VertoMethod.attach) {
                    continue;
                }

                if ((params.noDialogParams && key !== "callID")) {
                    continue;
                }

                if (send_keys.indexOf(key) === -1)
                    continue;

                params.dialogParams[key] = self.params[key];
            }

            delete params.noDialogParams;

            if (self.client.rpcClient)
                self.client.rpcClient.call(method, params,
                    function (e) {
                        /* Success */
                        self._processResult(method, true, e);
                    },
                    function (e) {
                        /* Error */
                        self._notifyErrorEvent(e);
                        self._processResult(method, false, e);
                    });
        }

        /**
         * 设置扬声器
         * @param {string} sinkId The [MediaDeviceInfo.deviceId](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo/deviceId) of the audio output device
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {Promise}
         */
        async setSpeakerDevice(sinkId, onSuccess, onError) {
            const self = this;
            const element = self.remoteAudio;
            if (element) {
                try {
                    if (isFunction(element.setSinkId)) {
                        logger.info("Dialog " + self.callID + " setSpeakerDevice: " + sinkId);

                        await element.setSinkId(sinkId);
                        isFunction(onSuccess) && onSuccess();
                    } else {
                        throw new Error('The browser does not support setSinkId function.');
                    }
                } catch (error) {
                    logger.error(error);
                    isFunction(onError) && onError(error);
                    throw error;
                }
            }
        }

        /**
         * 发起会话
         * @returns {Promise}
        */
        async call() {
            const self = this;

            await self._setState(DialogState.readying);
            if (self.rtc)
                self.rtc.call();
        }

        /**
         * 会话应答
         * @param {object|undefined} params 应答参数
         * @param {boolean|undefined} params.wantVideo 是否启用视频，默认由呼叫方决定
         * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
         * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
         * @param {DeviceParams} params.deviceParams 设备相关参数
         * @returns {Promise}
         */
        async answer(params = {}) {
            const self = this;

            if (!self.answered) {
                if (isDefined(params.wantVideo)) self.params.wantVideo = params.wantVideo;
                if (params.remoteTag) self.params.remoteTag = params.remoteTag;
                if (params.localTag) self.params.localTag = params.localTag;
                if (params.deviceParams) deepMix(self.deviceParams, params.deviceParams);

                await self._setState(DialogState.readying);
                if (self.rtc)
                    self.rtc.answer({
                        sdp: self.params.sdp
                    });
                else if (self.client.sessionManager && self.session) {
                    const constraints = getUserMediaConstraints(self);
                    const options = {
                        extraHeaders: [],
                        sessionDescriptionHandlerOptions: {
                            constraints: constraints
                        }
                    };
                    self._setState(DialogState.answering);
                    self.client.sessionManager.answer(self.session, options);
                }
                self.answered = true;
            } else {
                logger.warn("Dialog " + this.callID + " has answered.");
            }
        }

        /**
         * 挂断
         * @param {object} params 参数
         * @param {string|undefined} params.cause 原因文本
         * @param {number|undefined} params.causeCode 原因编码
         * @returns {Promise}
         */
        async hangup(params = { cause: 'NORMAL_CLEARING', }) {
            if (this.isDestroyed() || this.state === DialogState.hangup || this.state === DialogState.destroy)
                return;

            if (params.cause) this._hangupParams.cause = params.cause;
            if (params.causeCode) this._hangupParams.causeCode = params.causeCode;
            logger.log("Dialog " + this.callID + " hangup:", this._hangupParams);

            await this._setState(DialogState.hangup);
        }

        /**
         * 拒绝接听
         * @returns {Promise}
         */
        reject() {
            return this.hangup({ cause: "CALL_REJECTED" });
        }

        /**
         * @private
         */
        _stopRinging() {
            if (this.client.ringer) {
                this.client.ringer.pause();
                this.client.ringer.currentTime = 0;
                this.client.ringer.src = "";
            }
        }

        /**
         * @private
         */
        async _startRinging() {
            const self = this;

            if (self.client.ringer) {
                const ringFile = self.client.localParams.ringFile;
                if (ringFile) {
                    self.client.ringer.src = ringFile;
                    self.client.ringer.loop = true;
                    await self.client.ringer.play();
                } else
                    logger.warn("The ringFile is undefined, can not play ring");
            }
        }

        /**
         * 响铃
         * @returns {Promise}
         */
        async ring() {
            await this._startRinging();
            this._setState(DialogState.ringing);
        }

        /**
         * 通话转移
         * @param {string} destination
         * @param {object} params
         * @returns {void}
         */
        transfer(destination, params) {
            if (destination) {
                this._sendVertoMethod(VertoMethod.modify, {
                    action: "transfer",
                    destination,
                    params,
                });
            }
        }

        replace(replaceCallID, params) {
            if (replaceCallID) {
                this._sendVertoMethod(VertoMethod.modify, {
                    action: "replace",
                    replaceCallID: replaceCallID,
                    params: params
                });
            }
        }

        /**
         * 通话保持
         * @param {object} params
         * @returns {void}
         */
        hold(params) {
            this._sendVertoMethod(VertoMethod.modify, {
                action: "hold",
                params: params
            });
        }

        /**
         * 取消通话保持
         * @param {object} params
         * @returns {void}
         */
        unhold(params) {
            this._sendVertoMethod(VertoMethod.modify, {
                action: "unhold",
                params: params
            });
        }

        /**
         * 切换通话保持状态
         * @param {object} params
         * @returns {void}
         */
        toggleHold(params) {
            this._sendVertoMethod(VertoMethod.modify, {
                action: "toggleHold",
                params: params
            });
        }

        /**
         * 发送文本消息
         * @param {string} message 消息内容
         * @returns {void}
         */
        sendTextMessage(message) {
            return this.client.sendTextMessage(this.remoteNumber, message);
        }

        dtmf(digits) {
            this._sendVertoMethod(VertoMethod.info, {
                dtmf: digits
            });
        }

        /**
         * @private
         */
        _handleMedia(params) {
            const self = this;

            if (self.gotMedia) {
                logger.warn("Dialog " + self.callID + " Remote Media has got.");
                return;
            }
            // logger.log("Dialog " + self.callID + " EARLY SDP", params.sdp);

            self.gotMedia = true;

            if (params.sdp.indexOf("m=video") > 0) self.params.hasRemoteVideo = true;
            self.rtc.handleAnswerSDP(params.sdp, function () {
                logger.log("Dialog " + self.callID + " Establishing early media");
                self._setState(DialogState.waiting);

                if (self.gotAnswer) {
                    logger.log("Dialog " + self.callID + " is gotAnswer, set state to active.");
                    self._setState(DialogState.active);
                }
            }, function (e) {
                logger.error(e);
                self.hangup({ cause: "AnswerSDP Error" });
            });
        }

        /**
         * @private
         */
        _handleAnswer(params) {
            const self = this;

            if (self.gotAnswer) {
                logger.warn("Dialog " + self.callID + " Answer has got.");
                return;
            }

            self.gotAnswer = true;

            if (self.state === DialogState.waiting) {
                self._setState(DialogState.active);
            } else {
                if (self.gotMedia) {
                    logger.warn("Dialog " + self.callID + " Got answer while still establishing early media, delaying...");
                } else {
                    if (params.sdp.indexOf("m=video") > 0) self.params.hasRemoteVideo = true;
                    self.rtc.handleAnswerSDP(params.sdp, function () {
                        self._setState(DialogState.active);
                    }, function (e) {
                        logger.error(e);
                        self.hangup({ cause: "AnswerSDP Error" });
                    });
                }
            }
        }

        /**
         * @private
         */
        async _handleDisplay(params) {
            const self = this;

            let changed = false;
            if (isStringNotEmpty(params.caller_id_name) && self.params.caller_id_name !== params.caller_id_name) {
                self.params.caller_id_name = params.caller_id_name;
                // changed = true;
            }
            if (isStringNotEmpty(params.caller_id_number) && self.params.caller_id_number !== params.caller_id_number) {
                self.params.caller_id_number = params.caller_id_number;
                changed = true;
            }
            if (isStringNotEmpty(params.callee_id_name) && self.params.callee_id_name !== params.callee_id_name) {
                self.params.callee_id_name = params.callee_id_name;
                // changed = true;
            }
            if (isStringNotEmpty(params.callee_id_number) && self.params.callee_id_number !== params.callee_id_number) {
                self.params.callee_id_number = params.callee_id_number;
                changed = true;
            }

            self.params.display_name = params.display_name;
            self.params.display_number = params.display_number;
            self.params.display_direction = params.display_direction;

            if (changed) {
                logger.info("Dialog " + self.callID + " HandleDisplay caller or callee changed.");
                if (self.callerNumber === self.userNumber)
                    self.direction = Direction.outbound;
                else if (self.calleeNumber === self.userNumber)
                    self.direction = Direction.inbound;
            }

            self._notifyEvent({
                type: EventType.display,
                params,
            });
        }

        /**
         * @private
         */
        _handleInfo(params) { }

        /**
         * @private
        */
        _handleBye(params) {
            this.gotBye = true;
            this.hangup(params);
        }

        /**
         * 麦克风是否已关闭
         * @returns {boolean}
         */
        get micMuted() {
            return this.rtc.micMuted;
        }

        /**
         * 设置麦克风开启或关闭
         * @param {string|boolean|undefined} what 执行何种动作，默认toggle
         * @property {string} on 开启
         * @property {string} open 开启
         * @property {string} off 关闭
         * @property {string} close 关闭
         * @property {string} toggle 切换
         * @property {boolean} true 关闭
         * @property {boolean} false 开启
         * @returns {boolean} 麦克风是否开启
         */
        muteMic(what = 'toggle') {
            return this.rtc.muteMic(what);
        }

        /**
         * 切换麦克风开启或关闭
         * @returns {boolean} 麦克风是否开启
         */
        toggleMic() {
            return this.rtc.muteMic('toggle');
        }

        /**
         * 相机是否已关闭
         * @returns {boolean}
         */
        get cameraMuted() {
            return this.rtc.cameraMuted;
        }

        /**
         * 设置相机开启或关闭
         * @param {string|boolean|undefined} what 执行何种动作，默认toggle
         * @property {string} on 开启
         * @property {string} open 开启
         * @property {string} off 关闭
         * @property {string} close 关闭
         * @property {string} toggle 切换
         * @property {boolean} true 关闭
         * @property {boolean} false 开启
         * @returns {boolean} 相机是否开启
         */
        muteCamera(what = 'toggle') {
            return this.rtc.muteCamera(what);
        }

        /**
         * 切换相机开启或关闭
         * @returns {boolean} 相机是否开启
         */
        toggleCamera() {
            return this.rtc.muteCamera('toggle');
        }

        /**
         * 通话音是否已关闭
         * @returns {boolean}
         */
        get voiceMuted() {
            return this.rtc.voiceMuted;
        }

        /**
         * 设置通话音开启或关闭
         * @param {string|boolean} what 执行何种动作
         * @property {string} on 开启
         * @property {string} off 关闭
         * @property {string} toggle 切换
         * @property {boolean} true 关闭
         * @property {boolean} false 开启
         * @returns {boolean} 通话音是否开启
         */
        muteVoice(what) {
            return this.rtc.muteVoice(what);
        }

        /**
         * 切换通话音开启或关闭
         * @returns {boolean} 通话音是否开启
         */
        toggleVoice() {
            return this.rtc.muteVoice('toggle');
        }

        /**
         * 切换本地媒体流
         * @param {MediaStreamConstraints} constraints 获取媒体流约束条件
         * @param {MediaTrackConstraints|undefined} constraints.audio 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
         * @param {MediaTrackConstraints|undefined} constraints.video 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
         * @returns {Promise<boolean>}
         */
        switchMediaStream(constraints) {
            return this.rtc.switchMediaStream(constraints);
        }

        /**
         * 切换摄像头
         * @param {MediaTrackConstraints|undefined} videoConstraints 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
         * @returns {Promise<boolean>}
         */
        async switchCamera(videoConstraints) {
            if (!videoConstraints) return;
            return await this.switchMediaStream({ video: videoConstraints });
        }

        /**
         * 切换麦克风
         * @param {MediaTrackConstraints|undefined} audioConstraints 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
         * @returns {Promise<boolean>}
         */
        async switchMic(audioConstraints) {
            if (!audioConstraints) return;
            return await this.switchMediaStream({ audio: audioConstraints });
        }

        /**
         * 根据传入的deviceId切换摄像头
         * @param {string} deviceId
         * @returns {Promise<boolean>}
         */
        async switchCameraByDeviceId(deviceId) {
            if (!deviceId) return;
            return await this.switchCamera({ deviceId });
        }

        /**
         * 根据传入的deviceId切换麦克风
         * @param {string} deviceId
         * @returns {Promise<boolean>}
         */
        async switchMicByDeviceId(deviceId) {
            if (!deviceId) return;
            return await this.switchMic({ deviceId });
        }

        /**
         * 根据传入的deviceLabel切换摄像头
         * @param {string} deviceLabel
         * @returns {Promise<boolean>}
         */
        async switchCameraByLabel(deviceLabel) {
            if (!deviceLabel) return;
            const deviceId = getDeviceIdByLabel(deviceLabel);
            return await this.switchCameraByDeviceId(deviceId);
        }

        /**
         * 根据传入的deviceLabel切换麦克风
         * @param {string} deviceLabel
         * @returns {Promise<boolean>}
         */
        async switchMicByLabel(deviceLabel) {
            if (!deviceLabel) return;
            const deviceId = getDeviceIdByLabel(deviceLabel);
            return await this.switchMicByDeviceId(deviceId);
        }

        /**
         * 切换移动端前后摄像头
         * @param {string} facingMode user-前摄像头，environment-后摄像头，不传则默认用user
         * @returns {Promise<boolean>}
         */
        async switchCameraByFacingMode(facingMode = 'user') {
            return await this.switchCamera({ facingMode });
        }

        /**
         * 销毁会话
         * @returns {void}
         */
        destroy() {
            this._setState(DialogState.destroy);
        }

        onDestroy() {
            delete this.localVideo;
            delete this.remoteAudio;
            delete this.remoteVideo;
            if (this.rtc) {
                this.rtc.destroy();
                delete this.rtc;
            }
            if (this.session) {
                this.session.dispose();
                delete this.session;
            }
        }
    };
    Object.defineProperties(Dialog$1, {
        Direction: {
            get: function () {
                return Direction;
            }
        },
        State: {
            get: function () {
                return DialogState;
            }
        },
    });

    // const strict = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const splitPattern = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    /**
     * 使用正则表达式把一个url解析为["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]数组
     * @param {String} url 传入的url
     * @returns {Array} 解析结果数组
     */
    function splitUrl(url) {
        return splitPattern.exec(url);
    }

    const queryPattern = /(?:^|&)([^&=]*)=?([^&]*)/g;

    /**
     * 解析urlQuery字符串中的参数
     * @param {string} urlQuery
     * @param {object} result
     * @returns {object}
     */
    function parseQueryParams(urlQuery, result = {}) {
        urlQuery.replace(queryPattern, function (match, key, value) {
            if (key)
                result[key] = value;
        });
        return result;
    }

    const names = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];

    /**
     * 解析url，输出结果如下：
     * {
     *  source: '',
     *  protocol: '',
     *  authority: '',
     *  userInfo: '',
     *  user: '',
     *  password: '',
     *  host: '',
     *  port: '',
     *  relative: '',
     *  path: '',
     *  directory: '',
     *  file: '',
     *  query: '',
     *  queryParams: {
     *      key1: value1,
     *      key2: value2,
     *      ...
     *  },
     *  anchor: '',
     * }
     * @param {String} url 传入的url
     * @param {Object} result 传入的结果对象，可不填
     * @returns {Object} 输出的结果对象
     */
    function parseUrl(url, result = {}) {
        const allParts = splitUrl(url);
        for (let i = 0; i < names.length; i++) {
            result[names[i]] = allParts[i];
        }
        result.queryParams = {};
        if (result.query)
            parseQueryParams(result.query, result.queryParams);
        return result;
    }

    /**
     * JsonRPC协议客户端，用于JsonRPC协议消息的发送与接受，目前只支持WebSocket连接方式
     * @class
     */
    class JsonRpcClient extends Destroyable {
        /**
         * @constructor
         * @param {object} options 配置项
         * @param {string|URL} options.url WebSocket地址
         * @param {string|URL|Array<string|URL>} options.backupUrl 备用地址，可以是单个地址，也可以是地址数组，地址会在连接失败时轮流切换使用
         * @param {boolean} options.autoRetry 自动重试，默认true
         * @param {number} options.maxRetryCount 最大重试次数，设置0或负数表示不限制重试次数
         * @param {number} options.switchUrlConut 重试多少次后切换url
         * @param {number} options.retryInterval 重试间隔时间，单位毫米，默认1000
         * @param {string} options.sessid session id
         * @param {LoginData} options.loginData 登录相关参数
         * @param {object} callbacks 回调通知
         * @param {Function} callbacks.handleMessage 处理FreeSwitch的消息句柄
         * @param {Function} callbacks.onSocketEvent Socket事件回调
         * @param {Function} callbacks.onLogin 登录事件回调
         * @param {Function} callbacks.onLogout 登出事件回调
         */
        constructor(options = {}, callbacks = {}) {
            super();
            Check.defined('options.url', options.url);

            this.options = deepMix({
                url: null,
                backupUrl: null,
                autoLogin: false,
                autoRetry: true,
                maxRetryCount: -1,
                switchUrlConut: 10,
                retryInterval: 1000,
                sessid: null,
                loginData: {
                    account: null,
                    password: null,
                    loginParams: null,
                    userVariables: null,
                }
            }, options);
            this.callbacks = callbacks;

            this.urls = [];
            this.urls.push(this.options.url);
            if (Array.isArray(this.options.backupUrl)) {
                this.options.backupUrl.forEach(url => {
                    this.urls.push(url);
                });
            } else if (this.options.backupUrl) {
                this.urls.push(this.options.backupUrl);
            }
            /** @type {WebSocket} */
            this._socket = null;
            this._retry_count = 0;
            this._to = null;
            this._req_callbacks = {};
            this._req_id = 1;
            this._req_queue = [];
            this._st_result = {};
            this._authorizing = false;
            this._login_queue = [];
            this._wsOnMessage = this._wsOnMessage.bind(this);
        }

        /**
         * Returns the state of the WebSocket object's connection. It can have the values described below.
         *
         * [MDN Reference](https://developer.mozilla.org/docs/Web/API/WebSocket/readyState)
         * 
         * @returns {number}
         */
        get socketState() {
            return this._socket ? this._socket.readyState : -1;
        }

        /**
         * socket是否处于链接中
         * @returns {boolean}
         */
        get socketConnecting() {
            return this._socket && this._socket.readyState === 0;
        }

        /**
         * socket是否已准备好
         * @returns {boolean}
         */
        get socketReady() {
            return this._socket && this._socket.readyState === 1;
        }

        /**
         * 是否已登录
         * @returns {boolean}
        */
        get authorized() {
            return this._loginResult ? true : false;
        }

        /**
         * @private
         */
        _notifySocketEvent(event) {
            event.socket = this._socket;
            isFunction(this.callbacks.onSocketEvent) && this.callbacks.onSocketEvent(event);
        }

        /**
         * @private
         */
        _notifySocketStateChangeEvent() {
            this._notifySocketEvent({
                type: EventType.stateChange,
                state: this.socketState
            });
        }

        /**
         * @private
         */
        _notifySocketErrorEvent(error) {
            this._notifySocketEvent({
                type: EventType.error,
                error,
            });
        }

        /**
         * @private
         */
        _clearTimeout() {
            if (this._to) {
                clearTimeout(this._to);
                this._to = null;
            }
        }

        /**
         * @param {Function} onmessage 
         * @returns {boolean}
         * @private
        */
        _connectSocket(onmessage) {
            const self = this;

            self._clearTimeout();

            if (!self._socket || self._socket.readyState > 1) {
                self._authorizing = false;

                // 判断是否需要切换url
                if (self.urls.length > 1) {
                    let index = self._retry_count / self.options.switchUrlConut;
                    if (index >= self.urls.length)
                        index = 0;
                    self.url = self.urls[index];
                } else {
                    self.url = self.urls[0];
                }

                // No socket, or dying socket, let's get a new one.
                self._socket = new WebSocket(self.url);

                self._notifySocketStateChangeEvent();

                if (self._socket) {
                    // Set up onmessage handler.
                    self._socket.onmessage = onmessage;
                    self._socket.onclose = function (e) {
                        logger.error("Websocket Lost. The current retry count: " + self._retry_count + " interval: " + self.options.retryInterval + " msec.", e);

                        self._notifySocketStateChangeEvent();

                        //自动重试为false，退出
                        if (self.options.autoRetry === false) {
                            //执行登出
                            self._logout();
                            return;
                        }

                        self._retry_count++;

                        //超过最大重试次数，不再重试
                        if (self.options.maxRetryCount > 0 && self._retry_count > self.options.maxRetryCount) {
                            logger.warn('The retry count ' + self._retry_count + ' > the max retry count ' + self.options.maxRetryCount + ' , stop reconnection.');

                            //执行登出
                            self._logout();
                            return;
                        }

                        self._to = setTimeout(function () {
                            logger.log("Attempting Reconnection....", self.url);
                            self._connectSocket(onmessage);
                        }, self.options.retryInterval);
                    };

                    // Set up sending of message for when the socket is open.
                    self._socket.onopen = function () {
                        logger.info('Websocket Opened:', self.url);
                        self._clearTimeout();
                        self._retry_count = 0;

                        self._notifySocketStateChangeEvent();

                        // 已经登录过的，直接重新登录，登录成功后再调用popReqQueue
                        if (self.authorized) {
                            self._login(function () {
                                self._popReqQueue(self._socket);
                            });
                        } else {
                            self._popReqQueue(self._socket);
                        }
                    };

                    self._socket.onerror = function (e) {
                        logger.error('Websocket Error:', self.url, e);
                        self._notifySocketErrorEvent(e);
                    };
                }
            }

            return self._socket ? true : false;
        }

        /**
         * 获取WebSocket对象
         * @returns {WebSocket}
         */
        getSocket() {
            this._connectSocket(this._wsOnMessage);
            return this._socket;
        }

        /**
         * 网络测速
         * @param {number} bytesNum
         * @param {Function} callback
         * @returns {void}
         */
        speedTest(bytesNum = 1024 * 10, callback) {
            const socket = this.getSocket();
            if (socket) {
                this._st_request = { bytesNum, callback };
                socket.send("#SPU " + bytesNum);

                const loops = bytesNum / 1024;
                const rem = bytesNum % 1024;
                let i;
                const data = new Array(1024).join(".");
                for (i = 0; i < loops; i++) {
                    socket.send("#SPB " + data);
                }

                if (rem) {
                    socket.send("#SPB " + data);
                }

                socket.send("#SPE");
            }
        }

        /**
         * @param {WebSocket} socket
         * @param {object} data
         * @param {boolean} printLog
         * @returns {void}
         * @private
         */
        _wsSend(socket, data, printLog) {
            if (socket && data) {
                if (printLog)
                    logger.info('Websocket Send:', data);
                socket.send(JSON.stringify(data));
            }
        }

        /**
         * @private
        */
        _popReqQueue(socket) {
            let req;
            // Send the requests.
            while ((req = this._req_queue.pop())) {
                this._wsSend(socket, req, true);
            }
        }

        /**
         * @param {WebSocket} socket
         * @param {object} request
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {void}
         * @private
         */
        _wsCall(socket, request, onSuccess, onError) {
            // Setup callbacks.  If there is an id, this is a call and not a notify.
            if ('id' in request) {
                this._req_callbacks[request.id] = { request, onSuccess, onError };
            }

            if (socket.readyState !== 1) {
                this._req_queue.push(request);
            } else {
                this._wsSend(socket, request, true);
            }
        }

        /**
         * Sends a command to the JSON-RPC server
         * @param {string} method
         * @param {object} params
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {void}
         */
        call(method, params = {}, onSuccess, onError) {
            Check.defined('method', method);

            this.options.sessid && (params.sessid = this.options.sessid);

            const request = {
                jsonrpc: '2.0',
                method: method,
                params: params,
                id: this._req_id++  // Increase the id counter to match request/response
            };

            // Try making a WebSocket call.
            const socket = this.getSocket();
            socket && this._wsCall(socket, request, onSuccess, onError);
        }

        /**
         * Notify sends a command to the JSON-RPC server that won't need a response.
         * @param {string} method
         * @param {void} params
         * @returns {void}
         */
        notify(method, params = {}) {
            Check.defined('method', method);

            this.options.sessid && (params.sessid = this.options.sessid);

            const request = {
                jsonrpc: '2.0',
                method: method,
                params: params
            };

            // Try making a WebSocket call.
            const socket = this.getSocket();
            socket && this._wsCall(socket, request);
        }

        set loginData(params) {
            if (!params) return;
            Object.assign(this.options.loginData, params);
        }

        get loginData() {
            return this.options.loginData;
        }

        _login(onSuccess, onError) {
            this._authorizing = true;
            this.call("login", {
                login: this.loginData.account,
                passwd: this.loginData.password || '1234',
                loginParams: this.loginData.loginParams,
                userVariables: this.loginData.userVariables
            }, onSuccess, onError);
        }

        /**
         * 登录
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {void}
         */
        login(onSuccess, onError) {
            const self = this;
            //已登录，直接返回
            if (self.authorized) {
                logger.warn('The login has been successful and a repeated login is not required.');
                isFunction(onSuccess) && onSuccess(self._loginResult);
                return;
            }
            //登录中，放入login_queue中等待回调
            if (self._authorizing) {
                self._login_queue.push({
                    onSuccess,
                    onError,
                });
                return;
            }
            if (self.loginData.account) {
                self._login(onSuccess, onError);
            } else
                isFunction(onError) && onError(new Error('Login Error: the login account is undefined.'));
        }

        /**
         * 异步登录
         * @returns {Promise<Object>}
         */
        loginAsync() {
            const self = this;
            return new Promise((resolve, reject) => {
                self.login((result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            });
        }

        _logout() {
            this._closeSocket();
            delete this._loginResult;
            this._req_id = 1;
        }

        /**
         * 登出
         * @returns {void}
         */
        logout() {
            const self = this;
            //未登录，直接返回
            if (!self.authorized) return;

            self._logout();

            isFunction(self.callbacks.onLogout) && self.callbacks.onLogout();
        }

        /**
         * @param {any} result
         * @param {any} error
         * @returns {void}
         * @private
         */
        _popLoginQueue(result, error) {
            let req;
            while ((req = this._login_queue.pop())) {
                if (result && isFunction(req.onSuccess)) req.onSuccess(result);
                else if (error && isFunction(req.onError)) req.onError(error);
            }
        }

        /**
         * @param {MessageEvent} event
         * @returns {void}
         * @private
         */
        _wsOnMessage(event) {
            const self = this;

            // Speed Test Result
            if (event.data[0] === "#" && event.data[1] === "S" && event.data[2] === "P") {
                if (event.data[3] === "U") {
                    self._st_result.upDur = parseInt(event.data.substring(4));
                } else if (isFunction(self._st_request.callback) && event.data[3] === "D") {
                    self._st_result.downDur = parseInt(event.data.substring(4));

                    self._st_result.upKPS = (((self._st_request.bytesNum * 8) / (self._st_result.upDur / 1000)) / 1024).toFixed(0);
                    self._st_result.downKPS = (((self._st_request.bytesNum * 8) / (self._st_result.downDur / 1000)) / 1024).toFixed(0);

                    logger.info("Speed Test Result:", self._st_result);
                    const callback = self._st_request.callback;
                    delete self._st_request;
                    callback(self._st_result);
                }
                return;
            }

            // Handle Receive Data
            try {
                const response = JSON.parse(event.data);
                if (response.method === 'verto.ping' || (response.method === 'verto.event' && response.params && response.params.data && response.params.data.action === 'modify')) {
                    /// @todo
                } else
                    logger.log('Websocket Receive:', response);

                /// @todo Make using the jsonrcp 2.0 check optional, to use this on JSON-RPC 1 backends.

                // if (typeof response === 'object' &&
                //     'jsonrpc' in response &&
                //     response.jsonrpc === '2.0') {

                /// @todo Handle bad response (without id).

                if (self._req_callbacks[response.id]) {
                    // If this is an object with result, it is a response.
                    if ('result' in response) {
                        // Get the success callback.
                        const onSuccess = self._req_callbacks[response.id].onSuccess;
                        // Get the request data.
                        const orig_req = self._req_callbacks[response.id].request;

                        // Delete the callback from the storage.
                        delete self._req_callbacks[response.id];

                        // Run callback with result as parameter.
                        isFunction(onSuccess) && onSuccess(response.result);

                        if (orig_req.method === 'login') {
                            self._loginResult = response.result;
                            delete self._loginError;
                            self._authorizing = false;
                            isFunction(self.callbacks.onLogin) && self.callbacks.onLogin(true, response.result);
                            self._popLoginQueue(response.result);
                        }
                        return;
                    } else if ('error' in response) {
                        // Get the success callback.
                        const onSuccess = self._req_callbacks[response.id].onSuccess;
                        // Get the error callback.
                        const onError = self._req_callbacks[response.id].onError;
                        // Get the request data.
                        const orig_req = self._req_callbacks[response.id].request;

                        // Delete the callback from the storage.
                        delete self._req_callbacks[response.id];

                        // 返回-32000，说明授权已失效，需重新登录
                        if (response.error.code === -32000) {
                            if (self.loginData.account) {
                                delete self._loginResult;
                                self._login((result) => { //重登录成功，重新发起请求
                                    // if (orig_req.method === 'login') {
                                    //     isFunction(onSuccess) && onSuccess(result);
                                    //     return;
                                    // }
                                    const socket = self.getSocket();
                                    socket && self._wsCall(socket, orig_req, onSuccess, onError);
                                }, (err) => { //重登录失败
                                    isFunction(onError) && onError(response.error);
                                });
                                return;
                            }
                        }

                        // Run callback with the error object as parameter.
                        isFunction(onError) && onError(response.error);

                        if (orig_req.method === 'login') {
                            self._loginError = response.error;
                            delete self._loginResult;
                            self._authorizing = false;
                            isFunction(self.callbacks.onLogin) && self.callbacks.onLogin(false, response.error);
                            self._popLoginQueue(undefined, response.error);
                        }
                        return;
                    }
                }
                // }

                if (response && isFunction(self.callbacks.handleMessage)) {
                    const reply = self.callbacks.handleMessage(response);

                    // 需要发送回复消息
                    if (reply && response.id) {
                        const msg = {
                            jsonrpc: "2.0",
                            id: response.id,
                            result: reply
                        };

                        if (reply.method !== 'verto.ping')
                            logger.log('Websocket Reply:', msg);
                        self._wsSend(self._socket, msg);
                    }
                }
            } catch (e) {
                // Probably an error while parsing a non json-string as json.  All real JSON-RPC cases are
                // handled above, and the fallback method is called below.
                logger.error("Handle Response Error:", e);
                self._notifySocketErrorEvent(e);
                return;
            }
        }

        /**
         * 关闭WebSocket
         * @returns {void}
         * @private
         */
        _closeSocket() {
            const self = this;
            if (self._socket && self._socket.readyState < 2) {
                self._socket.onclose = function (e) {
                    logger.log("Websocket Closed:", self.url, e);
                    self._notifySocketStateChangeEvent();
                };
                self._socket.close();
            }
        }

        onDestroy() {
            this._closeSocket();
        }
    }

    /**
     * 登录账号配置数据
     * @typedef {object} LoginData
     * @property {string} account 登录账号
     * @property {string} password 登录密码
     * @property {object|undefined} loginParams 其他登录参数
     * @property {object|undefined} userVariables 用户其他参数，比如nickName、email、phone等
     */
    /**
     * 设备配置参数
     * @typedef {object} DeviceParams
     * @property {string|undefined} useCamera 使用的摄像头设备id，默认default表示使用系统默认摄像头，设置为none表示不使用摄像头
     * @property {string|undefined} useCameraLabel 使用的摄像头设备label，设置后会覆盖useCamera参数
     * @property {string|undefined} useMic 使用的麦克风设备id，默认default表示使用系统默认麦克风，设置为none表示不使用麦克风
     * @property {string|undefined} useMicLabel 使用的麦克风设备label，设置后会覆盖useMic参数
     * @property {string|undefined} useSpeaker 使用的扬声器设备id，默认default表示使用系统默认扬声器，设置为none表示不使用扬声器
     * @property {string|undefined} useSpeakerLabel 使用的扬声器设备label，设置后会覆盖useSpeaker参数
     * @property {MediaTrackConstraints|undefined} audioConstraints 捕获音频流条件，@see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
     * @property {MediaTrackConstraints|undefined} videoConstraints 捕获视频流条件，@see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
    */

    /**
     * 事件频道对象，在subscribeChannel函数中生成并返回
    */
    class EventChannel {
        /**
         * @constructor
         * @param {string} eventChannel 事件频道名称
         * @param {Function} handler 事件频道消息处理句柄
         * @param {object} subParams 其他参数
        */
        constructor(eventChannel, handler, subParams) {
            this.eventChannel = eventChannel;
            this.handler = handler;
            this.subParams = subParams;
            // this.ready = false;
        }
    }
    /**
     * @param {VertoClient} verto
     * @param {string} eventChannel
     * @returns {void}
     * @private
     */
    function drop_unauthorized_channel(verto, eventChannel) {
        logger.error("drop_unauthorized_channel: " + eventChannel);
        delete verto.eventChannels[eventChannel];
    }

    // let SERNO = 1;

    /**
     * Verto协议客户端，主要用于与FreeSwitch通信
     * @extends Destroyable
    */
    class VertoClient extends Destroyable {
        /**
         * @constructor
         * @param {object} options 配置项
         * @param {object} options.fsConfig FreeSwitch服务相关配置参数
         * @param {string} options.fsConfig.url FreeSwitch服务器wss地址
         * @param {string|Array<string>} options.fsConfig.backupUrl 备用wss地址
         * @param {number} options.fsConfig.maxRetryCount 最大重试次数，设置0或负数表示不限制重试次数
         * @param {number} options.fsConfig.switchUrlConut 重试多少次后切换url
         * @param {number} options.fsConfig.retryInterval 重试间隔时间，单位毫米
         * @param {boolean|RTCIceServer} options.fsConfig.turnServer WebRTC服务是否启用turnServer
         * @param {Array<RTCIceServer>|undefined} options.fsConfig.iceServers WebRTC服务iceServer列表
         * @param {object} options.localParams 本地相关配置参数
         * @param {string|HTMLMediaElement|Function} options.localParams.remoteTag 播放远程音视频的dom标签
         * @param {string|HTMLMediaElement|Function} options.localParams.localTag 播放本地音视频的dom标签
         * @param {string|HTMLMediaElement|Function} options.localParams.ringerTag 播放本地铃声的dom标签
         * @param {string} options.localParams.ringFile 响铃文件地址
         * @param {number|undefined} options.localParams.overtime 等待接听超时时间，单位毫秒，默认30000
         * @param {LoginData} options.loginData 登录账号配置数据
         * @param {DeviceParams} options.deviceParams 设备相关配置参数
         * @param {boolean} options.enableLog 是否启用日志输出，默认true
         * @param {object} callbacks 回调通知
         * @param {Function} callbacks.onClientEvent 客户端事件回调
         * @param {Function} callbacks.onDialogEvent 会话事件回调
         * @param {Function} callbacks.onConferenceEvent 组会事件回调
         */
        constructor(options = {}, callbacks = {}) {
            super();
            const self = this;

            self.options = deepMix({
                fsConfig: {
                    protocol: 'verto',
                    retryInterval: 1000,
                },
                localParams: {
                    remoteTag: null,
                    localTag: null,
                    ringerTag: null,
                    ringFile: null,
                    emergencyRingFile: null,
                    overtime: 30000,
                    useStream: null
                },
                loginData: {},
                deviceParams: {
                    useCamera: 'default',
                    useCameraLabel: null,
                    useMic: 'default',
                    useMicLabel: null,
                    useSpeaker: 'default',
                    useSpeakerLabel: null,
                    audioConstraints: {
                        autoGainControl: true, //自动增益
                        echoCancellation: true, //回声消除
                        noiseSuppression: true, //噪声抑制
                        highpassFilter: true, //高通滤波
                    },
                    videoConstraints: {
                        width: {
                            min: 640,
                            ideal: 1280,
                        },
                        height: {
                            min: 480,
                            ideal: 720,
                        },
                        frameRate: {
                            min: 10,
                            ideal: 30,
                        },
                        facingMode: 'user',
                    },
                },
                enableLog: true,
            }, options);
            self.callbacks = callbacks;
            // logger.log('Create Verto:', self.options);

            self.options.enableLog ? logger.enable() : logger.disable();
            delete self.options.enableLog;

            const urlParsed = parseUrl(self.options.fsConfig.url);
            self.urlParsed = urlParsed;

            if (self.options.sessid) {
                self.sessid = self.options.sessid;
            } else {
                self.sessid = localStorage.getItem("session_uuid") || generateGUID();
                localStorage.setItem("session_uuid", self.sessid);
            }

            /** @type {Object<string, Dialog>} */
            self.dialogs = {};
            /** @type {Object<string, Array<EventChannel>>} */
            self.eventChannels = {};
            /** @type {Object<string, Conference>} */
            self.conferences = {};

            /**
             * @type {JsonRpcClient}
             * @private
             */
            self.rpcClient = new JsonRpcClient({
                url: self.options.fsConfig.url,
                backupUrl: self.options.fsConfig.backupUrl,
                autoRetry: self.options.fsConfig.autoRetry,
                maxRetryCount: self.options.fsConfig.maxRetryCount,
                switchUrlConut: self.options.fsConfig.switchUrlConut,
                retryInterval: self.options.fsConfig.retryInterval,
                sessid: self.sessid,
                loginData: self.options.loginData,
            }, {
                handleMessage: function (e) {
                    return self._handleVertoMessage(e);
                },
                onSocketEvent: function (e) {
                    if (e.state === WebSocket.CLOSED)
                        self._purge();
                },
            });
            delete self.options.loginData;

            (async () => {
                self.ringer = await getMediaElementByTag(self.options.localParams.ringerTag, true);
            })();
        }

        /**
         * 是否启用日志输出
         * @type {boolean}
         * @default true
        */
        set enableLog(value) {
            logger.enabled = value;
        }
        get enableLog() {
            return logger.enabled;
        }

        /**
         * 本地配置参数
         * @returns {object}
         * @readonly
         */
        get localParams() {
            return this.options.localParams;
        }

        /**
         * 设置turnServer
         * @param {boolean|RTCIceServer} value
        */
        set turnServer(value) {
            this.options.fsConfig.turnServer = value;
        }

        /**
         * 获取turnServer
         * @returns {boolean|RTCIceServer}
         */
        get turnServer() {
            return this.options.fsConfig.turnServer;
        }

        /**
         * 设置iceServers
         * @param {Array<RTCIceServer>|null} value
         */
        set iceServers(value) {
            this.options.fsConfig.iceServers = value;
        }

        /**
         * 获取iceServers
         * @returns {Array<RTCIceServer>|null}
         */
        get iceServers() {
            return this.options.fsConfig.iceServers;
        }

        /**
         * 设置登录账号配置数据
         * @param {LoginData} params
         */
        set loginData(params) {
            if (!params) return;
            if (this.rpcClient)
                this.rpcClient.loginData = params;
        }

        /**
         * 获取登录账号配置数据
         * @returns {LoginData}
         */
        get loginData() {
            if (this.rpcClient)
                return this.rpcClient.loginData;
            else
                return this.options.loginData;
        }

        /**
         * @private
        */
        get socketReady() {
            if (this.rpcClient) return this.rpcClient.socketReady;
            else if (this.sessionManager) return this.sessionManager.isConnected();
            else return this.socketState === 1;
        }

        /**
         * 登录
         * @param {Function} onSuccess
         * @param {Function} onError
         * @returns {void}
         */
        login(onSuccess, onError) {
            const self = this;

            const notifyResult = (result) => {
                isFunction(onSuccess) && onSuccess(result);
                self._notifyEvent({
                    type: EventType.loginSuccess,
                    result,
                });
            };

            const notifyError = (error) => {
                isFunction(onError) && onError(error);
                self._notifyEvent({
                    type: EventType.loginError,
                    error,
                });
            };

            if (self.rpcClient) {
                self.logout();
                self.rpcClient.login(notifyResult, notifyError);
            }
        }

        /**
         * 登出
         * @returns {void}
        */
        logout() {
            if (this.rpcClient)
                this.rpcClient.logout();
            this._purge();
            this._notifyEvent({
                type: EventType.logout,
            });
        }

        /**
         * 设置设备相关参数
         * @param {DeviceParams} params
         * @returns {void}
         */
        set deviceParams(params) {
            if (!params) return;
            deepMix(this.options.deviceParams, params);
        }

        /**
         * 获取设备相关参数
         * @returns {DeviceParams}
         */
        get deviceParams() {
            return this.options.deviceParams;
        }

        /**
         * 设置捕获音频流条件
         * @param {MediaTrackConstraints} constraints
         * @see [MediaTrackConstraints#audio](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_audio_tracks)
         * @returns {void}
         */
        set audioConstraints(constraints) {
            if (!constraints) return;
            deepMix(this.options.deviceParams.audioConstraints, params);
        }

        /**
         * 获取音频流条件
         * @returns {MediaTrackConstraints}
         */
        get audioConstraints() {
            return this.options.deviceParams.audioConstraints;
        }

        /**
         * 设置捕获视频流条件
         * @param {MediaTrackConstraints} constraints
         * @see [MediaTrackConstraints#video](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints#instance_properties_of_video_tracks)
         * @returns {void}
         */
        set videoConstraints(params) {
            if (!constraints) return;
            deepMix(this.options.deviceParams.videoConstraints, params);
        }

        /**
         * 获取视频流条件
         * @returns {MediaTrackConstraints}
         */
        get videoConstraints() {
            return this.options.deviceParams.videoConstraints;
        }

        /**
         * @param {object} event 
         * @param {string} event.type
         * @returns {void}
         * @private
        */
        _notifyEvent(event) {
            event.client = this;
            isFunction(this.callbacks.onClientEvent) && this.callbacks.onClientEvent(event);
        }

        /**
         * 处理接收到的verto消息
         * @private
        */
        _handleVertoMessage(message) {
            if (!message || !message.method) {
                logger.error('Invalid Message:', message);
                return;
            }

            // if (message.method !== VertoMethod.ping)
            //     logger.log('handleMessage:', message);
            if (message.params.callID) {
                let dialog = this.dialogs[message.params.callID];

                if (message.method === VertoMethod.attach && dialog) {
                    dialog.destroy();
                    dialog = null;
                }

                if (dialog) {
                    switch (message.method) {
                        case VertoMethod.media:
                            dialog._handleMedia(message.params);
                            break;
                        case VertoMethod.answer:
                            dialog._handleAnswer(message.params);
                            break;
                        case VertoMethod.display:
                            dialog._handleDisplay(message.params);
                            break;
                        case VertoMethod.info:
                            dialog._handleInfo(message.params);
                            break;
                        case VertoMethod.bye:
                            dialog._handleBye(message.params);
                            break;
                        default:
                            logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", dialog, message.method);
                            break;
                    }
                } else {
                    switch (message.method) {
                        case VertoMethod.attach:
                            message.params.attach = true;

                            if (message.params.sdp && message.params.sdp.indexOf("m=video") > 0) {
                                message.params.hasRemoteVideo = true;
                            }

                            dialog = new Dialog$1(Dialog$1.Direction.inbound, this, message.params, this.callbacks.onDialogEvent);

                            break;
                        case VertoMethod.invite:
                            if (message.params.sdp && message.params.sdp.indexOf("m=video") > 0) {
                                message.params.hasRemoteVideo = true;
                            }

                            dialog = new Dialog$1(Dialog$1.Direction.inbound, this, message.params, this.callbacks.onDialogEvent);
                            break;
                        default:
                            logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", message.method);
                            break;
                    }
                }

                return {
                    method: message.method
                };
            } else {
                switch (message.method) {
                    case VertoMethod.punt://被踢下线，自动重连
                        // this.logout();
                        this.login();
                        break;
                    case VertoMethod.event:
                        let eventType = null;
                        let channels = null;
                        let eventChannel = null;

                        if (message.params) {
                            eventType = message.params.eventType;
                            eventChannel = message.params.eventChannel;
                        }

                        if (eventType === 'channelPvtData') {
                            const pvtData = message.params.pvtData;
                            if (!pvtData) {
                                logger.warn("The pvtData is undefined.");
                                return;
                            }
                            const dialog = this.dialogs[pvtData.callID];
                            let conference = this.conferences[pvtData.callID];
                            switch (pvtData.action) {
                                case "conference-liveArray-join"://加入组会
                                    if (conference)
                                        conference.destroy();
                                    conference = new Conference(dialog, message.params, this.callbacks.onConferenceEvent);
                                    break;
                                case "conference-liveArray-part"://离开组会
                                    if (conference)
                                        conference.destroy();
                                    break;
                            }
                            return;
                        }

                        if (eventChannel)
                            channels = this.eventChannels[eventChannel];

                        if (channels) {
                            channels.forEach(channel => {
                                isFunction(channel.handler) && channel.handler(message.params);
                            });
                        } else {
                            if (eventChannel) {
                                if (eventChannel === this.sessid) {
                                    this._notifyEvent({
                                        type: EventType.eventChannel,
                                        params: message.params,
                                    });
                                } else if (this.dialogs[eventChannel]) {
                                    this.dialogs[eventChannel]._notifyDialogEvent({
                                        type: EventType.eventChannel,
                                        params: message.params,
                                    });
                                }
                            }
                        }
                        break;
                    case VertoMethod.info:
                        // if (this.callbacks.onMessage) {
                        //     this.callbacks.onMessage(this, null, Verto.enum.message.info, response.params.msg);
                        // }
                        // logger.debug("MESSAGE from: " + data.params.msg.from, data.params.msg.body);
                        break;
                    case VertoMethod.clientReady:
                        this._notifyEvent({
                            type: EventType.ready
                        });
                        break;
                    case VertoMethod.ping:
                        return {
                            method: message.method
                        };
                    default:
                        logger.warn("INVALID METHOD OR NON-EXISTANT CALL REFERENCE IGNORED", message.method);
                        break;
                }
            }
        }

        /**
         * 处理通过sendMethod发送消息的结果
         * @private
         */
        _processResult(method, success, e) {
            let key;
            switch (method) {
                case VertoMethod.subscribe:
                    for (key in e.unauthorizedChannels) {
                        drop_unauthorized_channel(this, e.unauthorizedChannels[key]);
                    }
                    // for (key in e.subscribedChannels) {
                    //     ready_subscribed_channel(this, e.subscribedChannels[key]);
                    // }
                    break;
                case VertoMethod.unsubscribe:
                    break;
            }
        }

        /**
         * 发送Verto指令
         * @param {VertoMethod} method Verto指令
         * @param {object} params 指令内容
         * @returns {void}
         * @private
         */
        _sendVertoMethod(method, params) {
            const self = this;
            if (self.rpcClient)
                self.rpcClient.call(method, params,
                    function (e) {
                        /* Success */
                        self._processResult(method, true, e);
                    },
                    function (e) {
                        /* Error */
                        self._processResult(method, false, e);
                    });
        }

        /**
         * 发送事件频道广播
         * @param {string} eventChannel 事件频道
         * @param {object} data 广播数据
         * @returns {void}
         * @private
         */
        sendChannelBroadcast(eventChannel, data) {
            this._sendVertoMethod(VertoMethod.broadcast, {
                eventChannel,
                data,
            });
        }

        /**
         * 事件频道订阅
         * @param {string} eventChannel 事件频道名称
         * @param {Function} handler 事件频道消息处理句柄
         * @param {object} subParams 其他参数
         * @returns {EventChannel}
         * @private
         */
        subscribeChannel(eventChannel, handler, subParams) {
            Check.typeOf.string('eventChannel', eventChannel);

            const channel = new EventChannel(eventChannel, handler, subParams);

            if (!this.eventChannels[eventChannel]) {
                this.eventChannels[eventChannel] = [];
                this._sendVertoMethod(VertoMethod.subscribe, {
                    eventChannel, subParams
                });
            }
            this.eventChannels[eventChannel].push(channel);

            return channel;
        }

        /**
         * 取消事件频道订阅
         * @param {EventChannel} channel 由subscribeChannel函数返回的EventChannel对象
         * @returns {boolean}
         * @private
         */
        unsubscribeChannel(channel) {
            Check.instanceOf('channel', channel, EventChannel);

            const list = this.eventChannels[channel.eventChannel];
            if (list) {
                const idx = list.indexOf(channel);
                if (idx === -1) {
                    logger.warn('The channel is not in eventChannels array.', channel);
                    return false;
                }
                list.splice(idx, 1);
                if (list.length === 0) {
                    delete this.eventChannels[channel.eventChannel];
                    this._sendVertoMethod(VertoMethod.unsubscribe, {
                        eventChannel: channel.eventChannel
                    });
                }
                return true;
            } else {
                logger.warn("Not found the " + channel.eventChannel + "'s array.");
                this._sendVertoMethod(VertoMethod.unsubscribe, {
                    eventChannel: channel.eventChannel
                });
                return false;
            }
        }

        /**
         * 挂断会话
         * @param {object} params 参数
         * @param {string|undefined} params.callID 呼叫id，不传表示挂断所有的会话
         * @param {string|undefined} params.cause 原因文本
         * @param {number|undefined} params.causeCode 原因编码
         * @returns {void}
         */
        hangup(params = {}) {
            if (params.callID) {
                this.dialogs[params.callID] && this.dialogs[params.callID].hangup(params);
            } else {
                for (const key in this.dialogs) {
                    this.dialogs[key].hangup(params);
                }
            }
        }

        /**
         * 发起一个新呼叫
         * @param {object|string} params 呼叫参数或呼叫号码
         * @param {string} params.destinationNumber 呼叫号码，必填项
         * @param {boolean|undefined} params.wantVideo 是否使用视频呼叫，默认false
         * @param {string|HTMLMediaElement|Function|undefined} params.remoteTag 播放远程音视频的dom标签
         * @param {string|HTMLMediaElement|Function|undefined} params.localTag 播放本地音视频的dom标签
         * @param {number|undefined} params.overtime 等待接听超时时间，单位毫秒
         * @param {DeviceParams|undefined} params.deviceParams 设备相关参数
         * @returns {Dialog}
         */
        newCall(params = {}) {
            if (!this.socketReady) {
                logger.error("Not Connected...");
                return;
            }
            if (typeof params === 'string') params = { destinationNumber: params };
            // 兼容以前使用destination_number时的代码
            if (params.destination_number) params.destinationNumber = params.destination_number;
            Check.defined('params.destinationNumber', params.destinationNumber);

            if (params.destinationNumber === this.loginData.account) {
                logger.error("destinationNumber " + params.destinationNumber + " equals account " + this.loginData.account);
                return;
            }

            return new Dialog$1(Dialog$1.Direction.outbound, this, params, this.callbacks.onDialogEvent);
        }

        /**
         * 发送文本消息
         * @param {string} destinationNumber 目标号码
         * @param {string} message 消息内容
         * @returns {void}
         */
        sendTextMessage(destinationNumber, message) {
            Check.defined('destinationNumber', destinationNumber);
            Check.typeOf.string('message', message);
            if (this.isSip) {
                const destination = "sip:" + destinationNumber + "@" + this.urlParsed.host;
                this.sessionManager.message(destination, message);
            } else if (this.isVerto) {
                this._sendVertoMethod(VertoMethod.info, {
                    msg: {
                        from: this.loginData.account,
                        to: destinationNumber,
                        body: message,
                    }
                });
            }
        }

        /**
         * 清理所有的会话与订阅
         * @returns {void}
         * @private
        */
        _purge() {
            for (const key in this.conferences) {
                this.conferences[key].destroy();
            }
            this.conferences = {};
            for (const key in this.dialogs) {
                this.dialogs[key].destroy();
            }
            this.dialogs = {};

            // for (key in this.eventChannels) {
            //     delete this.eventChannels[key];
            // }
            this.eventChannels = {};
        }

        /**
         * 获取当前的会话列表
         * @returns {Array<Dialog>}
         */
        getDialogs() {
            const result = [];
            for (const key in this.dialogs) {
                result.push(this.dialogs[key]);
            }
            return result;
        }

        getDialogBySession(session) {
            for (const key in this.dialogs) {
                const dialog = this.dialogs[key];
                if (dialog.session === session) {
                    return dialog;
                }
            }
        }

        /**
         * 获取当前正在通话的会话列表
         * @returns {Array<Dialog>}
         */
        getActiveDialogs() {
            const result = [];
            for (const key in this.dialogs) {
                const dialog = this.dialogs[key];
                if (dialog.isActive) {
                    result.push(dialog);
                }
            }
            return result;
        }

        /**
         * 是否存在会话
         * @returns {boolean}
         */
        hasDialog() {
            return this.getDialogs().length > 0;
        }

        /**
         * 是否存在正在通话的会话
         * @returns {boolean}
         */
        hasActiveDialog() {
            return this.getActiveDialogs().length > 0;
        }

        onDestroy() {
            delete this.ringer;
            this.logout();
            this.rpcClient && this.rpcClient.destroy();
        }
    }
    Object.defineProperties(VertoClient, {
        Method: {
            get: function () {
                return VertoMethod;
            }
        },
        EventChannel: {
            get: function () {
                return EventChannel;
            }
        }
    });

    /**
     * 创建VertoClient实例
     * @param {object} options 配置项，@see VertoClient.constructor
     * @param {object} callbacks 回调通知，@see VertoClient.constructor
     * @returns {VertoClient}
    */
    function createClient(options, callbacks) {
        return new VertoClient(options, callbacks);
    }

    exports.Client = VertoClient;
    exports.Conference = Conference;
    exports.ConferenceLiveArray = ConferenceLiveArray;
    exports.ConferenceLiveArrayAction = ConferenceLiveArrayAction;
    exports.ConferenceState = ConferenceState;
    exports.Dialog = Dialog$1;
    exports.DialogState = DialogState;
    exports.Direction = Direction;
    exports.EventChannel = EventChannel;
    exports.EventType = EventType;
    exports.VertoClient = VertoClient;
    exports.VertoMethod = VertoMethod;
    exports.createClient = createClient;
    exports.enumerateMediaDevices = enumerateMediaDevices;

}));
//# sourceMappingURL=vertojs.umd.js.map
