import lodash from 'lodash'
import { Event } from './Event'

/**
 * 控制台可能的方法枚举
 */
export const ConsoleFunction = { LOG: 'log', INFO: 'info', ERROR: 'error' }

/**
 * 控制台行为类
 */
export class ConsoleEvent extends Event {
  constructor (options, context) {
    super(options, context)
    if (lodash.isNil(options.function) || lodash.isNil(options.params)) {
      this.thorwException('ConsoleEvent options.function or options.params should not null or undefined')
    } else {
      if (Object.values(ConsoleFunction).includes(options.function)) {
        this.function = options.function
      } else {
        this.thorwException('ConsoleEvent options.consoleFunction not supports')
      }
      if (lodash.isArray(options.params)) {
        this.params = options.params
      } else {
        this.thorwException('ConsoleEvent options.params not array')
      }
    }
  }

  static getName () {
    return 'consoleEvent'
  }

  handle () {
    // console[this.function].apply(this, this.params)
  }
}
