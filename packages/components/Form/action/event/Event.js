import { CtxAware } from '../ctx/CtxAware'

/**
 * 行为动作类
 * 用于监听器触发时执行指定的行为
 */
export class Event extends CtxAware {
  /**
   * 行为名称 必须由子类实现
   */
  static getName () {
    this.thorwException('Subclass event must implements static method getName')
  }

  /**
   * 行为具体执行内容 必须由子类实现
   */
  handle () {
    this.thorwException('Subclass event must implements method handle')
  }
}
