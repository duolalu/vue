/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'
//获取数组的原型对象
const arrayProto = Array.prototype
//创建一个新的数组对象，修改数组的原生方法
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
//重写数组的方法
//注意：修改了数组的原生方法以后我们还是没法像原生数组一样直接通过数组的下标或者设置length来修改数组，可以通过Vue.set以及splice方法。
methodsToPatch.forEach(function (method) {
  // cache original method
  //缓存原生方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    //调用原生的数组方法
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    //、、、数组插入元素后重新进行observe
    if (inserted) ob.observeArray(inserted)
    // notify change
    //通知观察者进行相应式处理
    ob.dep.notify()
    //返回调用原生数组方法所得的值
    return result
  })
})
