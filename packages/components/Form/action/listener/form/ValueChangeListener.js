import lodash from 'lodash'
import { FormListener } from './FormListener'

/**
 * 表单数据更改时的监听器
 */
export class ValueChangeListener extends FormListener {
  static getName () {
    return 'valueChangeListener'
  }

  trigger (props, values) {
    const { vm, options } = this.getActionContext()
    const { field } = options
    const historyVal = vm.formValue ? vm.formValue[field.key] : null
    const currentVal = values[field.key]
    if (!lodash.isEqual(historyVal, currentVal)) {
      super.trigger(props, values)
    }
  }
}
