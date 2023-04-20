import { CtxAware } from '../ctx/CtxAware'
import { ConsoleEvent, OptionsChangeEvent } from '../event'

/**
 * 监听器
 */
export class Listener extends CtxAware {
  constructor (options, context) {
    super(options, context)
    if (options.events && Array.isArray(options.events)) {
      this.events = options.events.map(eventOptions => this.loadEvent(eventOptions))
    } else {
      this.thorwException(`listener options.events is illegal ${options.events}`)
    }
  }

  /**
   * 触发监听下绑定的所有行为 可由子类重写实现指定环境下触发
   */
  trigger () {
    this.getEvents().forEach(event => event.handle.apply(event, arguments))
  }

  /**
   * 监听器的名称标志 必须由子类实现
   */
  static getName () {
    this.thorwException('Subclass listener must implements static method getName')
  }

  getEvents () {
    return this.events
  }

  /**
   * 根据行为配置信息实例化行为
   * @param {*} eventOptions 行为配置信息
   */
  loadEvent (eventOptions) {
    if (eventOptions.name) {
      switch (eventOptions.name) {
        case ConsoleEvent.getName():
          return new ConsoleEvent(eventOptions, this.getActionContext())
        case OptionsChangeEvent.getName():
          return new OptionsChangeEvent(eventOptions, this.getActionContext())
        default:
          this.thorwException(`event options.name ${eventOptions.name} not supports`)
      }
    } else {
      this.thorwException('event options must have name')
    }
  }
}
