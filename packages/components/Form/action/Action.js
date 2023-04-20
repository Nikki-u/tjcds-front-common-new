import { CtxAware, ActionContext } from './ctx/CtxAware'
import { ValueChangeListener } from './listener'

/**
 * 活动信息类
 */
export class Action extends CtxAware {
  constructor (options, context) {
    super(options, context)
    if (options.listeners && Array.isArray(options.listeners)) {
      this.listeners = options.listeners.map(lisOptions => this.loadListener(lisOptions))
    } else {
      this.thorwException(`listener options.events is illegal ${options.events}`)
    }
    // console.log(this)
  }

  /**
   * 根据监听器名称指定触发监听器
   * 第一个参数为监听器名称
   * 第二到N参数列表作为行为的参数信息
   */
  trigger () {
    const listenerName = arguments[0]
    const args = Array.prototype.slice.call(arguments)
    args.splice(0, 1)
    this.listeners.filter(lis => lis.getOriginOptions().name === listenerName)
      .forEach(lis => lis.trigger.apply(lis, args))
  }

  /**
   * 根据监听器配置信息实例化监听器
   * @param {*} lisOptions 监听器配置信息
   */
  loadListener (lisOptions) {
    if (lisOptions.name) {
      switch (lisOptions.name) {
        case ValueChangeListener.getName():
          return new ValueChangeListener(lisOptions, this.getActionContext())
        default:
          this.thorwException(`listener options.name ${lisOptions.name} not supports`)
      }
    }
    this.thorwException('listener options must have name')
  }
}

export { ActionContext, ValueChangeListener }
