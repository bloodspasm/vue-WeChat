/**
 * Created by bloodspasm on 2018/6/6.
 */
let utils = {}
utils.install = function (Vue, options) {

  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
    console.log('myGlobalMethod')

  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
  })

  Vue.prototype.$msg = 'Hello I am utils.js'

  //获取宽度
  Vue.prototype.getDomWidth = function (dom) {
    return document.getElementById(dom).offsetWidth
  }

  //获取高度
  Vue.prototype.getDomHeight = function (dom) {
    return document.getElementById(dom).offsetHeight
  }



}
export default utils
