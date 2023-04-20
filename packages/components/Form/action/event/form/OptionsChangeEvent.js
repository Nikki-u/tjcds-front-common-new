import lodash from 'lodash'
import { FormEvent } from './FormEvent'

/**
 * 选项及联更新改变的行为类
 */
export class OptionsChangeEvent extends FormEvent {
  constructor (options, context) {
    super(options, context)
    if (lodash.hasIn(options, 'target') && lodash.isString(options.target)) {
      this.target = options.target
    } else {
      this.thorwException('OptionsChangeEvent options.target not null and must be a type string')
    }
  }

  static getName () {
    return 'optionsChangeEvent'
  }

  handle (props, valueObj) {
    const { vm, options } = this.getActionContext()
    const { field } = options
    const targetField = vm.fields.find(f => f.key === this.target)
    if (!targetField || !targetField.origin) {
      return
    }
    const value = valueObj[field.key]
    const fieldId = targetField.origin.id
    const params = {}
    params[field.key] = value
    vm.$http.get(`/tjcds/res/options/${fieldId}`, {
      params
    }).then(optionsData => {
      targetField.options = optionsData.map(item => ({
        value: item.typeOptionValue,
        label: item.typeOptionLabel
      }))
    })
  }
}
