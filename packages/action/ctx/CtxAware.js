import lodash from 'lodash'
/**
 * 活动上下文实体类
 */
export class ActionContext {
  /**
   * 构造一个上下文
   * @param {VueComponent} vm vue组件实例对象
   * @param {*} options 额外的配置信息
   */
  constructor (vm, options) {
    if (lodash.isEmpty(vm)) {
      throw new Error('ActionContext must injection vue context')
    }
    this.vm = vm
    this.options = options
  }

  getVM () {
    return this.vm
  }

  getOptions () {
    return this.options
  }
}

/**
 * 上下文与源配置的提供类
 */
export class CtxAware {
  /**
   * 使用源配置与上下文构造配置信息提供器
   * @param {*} options 源配置信息
   * @param {*} context 上下文信息
   */
  constructor (options, context) {
    if (!(context instanceof ActionContext)) {
      throw new Error('action context must be ActionContext type')
    }
    this.originOptions = options
    this.actionContext = context
  }

  getOriginOptions () {
    return this.originOptions
  }

  getActionContext () {
    return this.actionContext
  }

  thorwException (errMsg) {
    console.error(errMsg)
    throw new Error(errMsg)
  }
}
