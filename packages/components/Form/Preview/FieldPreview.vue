<template>
  <a-form-item
    :label="fieldOptions.title"
    :label-col="fieldOptions.labelCol"
    :wrapper-col="fieldOptions.wrapperCol">
    <!-- 挂载点优先级最高 -->
    <slot v-if="fieldOptions.previewSlot"></slot>
    <template v-else>
      <location-picker v-if="isType('point')" disabled :value="value" style="height: 300px;width: 100%"/>
      <span v-else>{{ formatValue }}</span>
    </template>
  </a-form-item>
</template>

<script>
import format from '../../../utils/format'
import LocationPicker from '../../Picker/Location/LocationPicker'
export default {
  components: {
    LocationPicker
  },
  props: {
    formValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fieldOptions: {
      // 待渲染的对象
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    value () {
      return this.formValue[this.fieldOptions.key]
    },
    formatValue () {
      const formatFun = format[this.fieldOptions.type] || format.text
      return formatFun(this.formValue, this.fieldOptions) || '暂无'
    }
  },
  methods: {
    isType (type) {
      return this.fieldOptions.type && this.fieldOptions.type === type
    }
  }
}
</script>
<style lang="less">
.preview-form-item .ant-form-item-label {
  min-width: 120px !important;
  width: unset;
}
</style>
