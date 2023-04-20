import lodash from 'lodash'
import { Event } from '../Event'

/**
 * 表单事件的抽象类 不可直接用于事件定义 因为它没有重写getName
 */
export class FormEvent extends Event {
  constructor (options, context) {
    super(options, context)
    this.checkContext()
  }

  checkContext () {
    const { vm, options } = this.getActionContext()
    // options中必须带有当前表单项的配置信息
    if (!lodash.isPlainObject(options.field)) {
      this.thorwException('FormEvent context options.field must be plain object')
    }
    if (!(lodash.hasIn(vm, 'fields') && lodash.isArray(vm.fields))) {
      this.thorwException('FormEvent vue context must have fields prop and type must be a array')
    }
  }
}
