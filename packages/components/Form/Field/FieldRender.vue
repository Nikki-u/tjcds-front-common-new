<template>
  <a-form-item
    class="field-render"
    :label-col="renderOptions.labelCol"
    :wrapper-col="renderOptions.wrapperCol"
    v-if="(isType('tagcheck')&&renderOptions.options.length>0)||!isType('tagcheck')"
  >
    <a-tooltip slot="label">
      <template slot="title">{{ renderOptions.title }}</template>
      <span>{{ renderOptions.title }}</span>
    </a-tooltip>
    <!-- 挂载点优先级最高     :label="renderOptions.title"-->
    <slot v-if="renderOptions.slot"></slot>
    <tag-check
      v-else-if="isType('tagcheck')"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key
      ]"
    />
    <a-switch
      v-else-if="isType('switch')"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : undefined,
          rules: renderOptions.rules
        }
      ]"
    />

    <a-select
      v-else-if="isType('select')"
      style="min-width: 200px;width: 100%;"
      allowClear
      v-bind="renderOptions"
      showSearch
      optionFilterProp="children"
      :filterOption="selectFilterOption"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : undefined,
          rules: renderOptions.rules
        }
      ]"
    />
    <a-input-number
      v-else-if="isType('number')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%' ,minWidth:'200px'} : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : '',
          rules: renderOptions.rules
        }
      ]"
    />
    <a-radio-group
      v-else-if="isType('radio') && Array.isArray(fieldOptions.options)"
      :size="fieldOptions.size"
      :disabled="fieldOptions.disabled"
      buttonStyle="solid"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : '',
          rules: renderOptions.rules
        }
      ]"
    >
      <a-radio-button
        v-for="(item, index) in renderOptions.options"
        :key="index + '_' + item.value"
        :value="item.value"
      >{{ item.label }}</a-radio-button>
    </a-radio-group>
    <a-switch
      v-else-if="isType('switch')"
      v-bind="renderOptions"
      v-decorator="[
        fieldOptions.key,
        {
          initialValue:fieldOptions.default,
          rules: renderOptions.rules,
          valuePropName: 'checked'
        }
      ]"
    />
    <a-date-picker
      v-else-if="isType('datetime')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : null,
          rules: renderOptions.rules
        }
      ]"
    ></a-date-picker>
    <a-month-picker
      v-else-if="isType('datemonth')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%' } : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : null,
          rules: renderOptions.rules
        }
      ]"
    ></a-month-picker>
    <a-range-picker
      v-else-if="isType('datetimeRange')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%',minWidth:'200px',display: 'table-caption',lineHeight:'40px' } : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : null,
          rules: renderOptions.rules
        }
      ]"
      :placeholder="renderOptions.placeholder"
    ></a-range-picker>
    <a-cascader
      v-else-if="isType('cascader')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      v-bind="renderOptions"
      v-decorator="[

        renderOptions.key,
        { initialValue: renderOptions.default ? renderOptions.default : [] }
      ]"
    />
    <a-time-picker
      v-else-if="isType('timepicker')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : null,
          rules: renderOptions.rules
        }
      ]"
    />
    <a-textarea
      v-else-if="isType('textarea')"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : null,
          rules: renderOptions.rules
        }
      ]"
      :autosize="{ minRows: 6, maxRows: 24 }"
    ></a-textarea>
    <a-select
      v-else-if="isType('multiple')"
      v-bind="renderOptions"
      mode="multiple"
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      optionFilterProp="children"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : [],
          rules: renderOptions.rules
        }
      ]"
    />
    <file-upload
      v-else-if="isType('file')"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : undefined,
          rules: renderOptions.rules
        }
      ]"
    ></file-upload>
    <field-content
      v-else-if="isType('content')"
      v-bind="renderOptions"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : undefined,
          rules: renderOptions.rules
        }
      ]"
    ></field-content>
    <location-picker
      v-else-if="isType('point')"
      style="height: 300px;width: 100%"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : [],
          rules: renderOptions.rules
        }
      ]"
    />
    <a-input
      v-else
      :style="renderOptions.filterType !== 'cardFilter' ? { width: '100%', minWidth:'200px' } : ''"
      v-bind="renderOptions"
      :allowClear="true"
      v-decorator="[
        renderOptions.key,
        {
          initialValue: renderOptions.default ? renderOptions.default : '',
          rules: renderOptions.rules
        }
      ]"
    />
  </a-form-item>
</template>

<script>
import quickRuleGenFun from './quickRuleGenFun'
import LocationPicker from '../../Picker/Location/LocationPicker'
import TagCheck from './TagCheck'
import FileUpload from './FileUpload'
import FieldContent from './FieldContent'
export default {
  components: {
    TagCheck,
    FileUpload,
    FieldContent,
    LocationPicker
  },
  props: {
    fieldOptions: {
      // 待渲染的对象
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    renderOptions () {
      const fieldOptions = this.fieldOptions
      delete fieldOptions.hidden
      return Object.assign({}, fieldOptions, {
        showTime: !!fieldOptions.showTime,
        rules: this.concatRules(fieldOptions),
        placeholder: this.genPlaceholder(fieldOptions),
        size: fieldOptions.size || 'default'
      })
    }
  },
  methods: {
    isType (type) {
      return this.renderOptions.type && this.renderOptions.type === type
    },
    // 下拉搜索框
    selectFilterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    genPlaceholder (field) {
      if (field.placeholder) return field.placeholder
      if (field.type === 'datetimeRange') return ['开始时间', '结束时间']
      return `${placeholderActionText[field.type] ? placeholderActionText[field.type] : '请填写'}${field.title}`
    },
    concatRules (field) {
      // 合并校验规则
      const quickRules = this.genQuickRules(field)
      if (field.rules) {
        return quickRules.concat(field.rules)
      } else {
        return quickRules
      }
    },
    genQuickRules (field) {
      // 自动生成部分表单校验
      const quickRule = field.quickRule
      if (quickRule && quickRule instanceof Object && Object.keys(quickRule).length > 0) {
        return Object.keys(quickRule)
          .filter(ruleKey => quickRule[ruleKey] && quickRuleGenFun[ruleKey])
          .map(ruleKey => {
            return quickRuleGenFun[ruleKey](field, quickRule[ruleKey])
          })
      }
      return []
    }
  }
}
const placeholderActionText = {
  text: '请填写',
  select: '请选择',
  number: '请填写',
  radio: '请选择',
  datetime: '请选择',
  datetimeRange: '请选择',
  cascader: '请选择',
  multiple: '请选择',
  textarea: '请输入',
  timepicker: '请选择',
  file: '请选择',
  point: '请选择',
  content: ''
}
</script>
<style lang="less">
.field-render .ant-form-item-label label {
  min-width: 85px;
  display: inline-block;
  vertical-align: middle;
  text-align: left;
  word-break: break-all !important;
  white-space: initial;
  line-height: 14px
}
.field-render .ant-form-item-children{
  display: block;
}
</style>
