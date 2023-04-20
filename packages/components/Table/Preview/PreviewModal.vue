<!--  -->
<template>
  <a-modal
    title="详情"
    v-model="visible"
    :width="width">
    <template slot="footer">
      <a-button type="primary" @click="visible = false">确定</a-button>
    </template>
    <p v-for="field in fields" :key="field.key">
      <a-row>
        <a-col :span="4" style="text-align: right;">
          <span>{{ field.title }}：</span>
        </a-col>
        <a-col :span="20">
          <template v-if="field.scopedSlots && field.scopedSlots.customRender">
            <slot
              :name="field.scopedSlots.customRender"
              :params="[previewValue[field.dataIndex],previewValue,field]"
            ></slot>
          </template>
          <format-column v-else-if="field.format" :column="field" :row="previewValue"></format-column>
          <span v-else>{{ previewValue[field.dataIndex] }}</span>
        </a-col>
      </a-row>

    </p>
  </a-modal>
</template>

<script>
import FormatColumn from '../Column/FormatColumn'
export default {
  name: 'PreviewModal',
  components: {
    FormatColumn
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    previewValue: {
      type: Object,
      default: function () {
        return {}
      }
    },
    width: {
      type: [String, Number],
      default: 520
    },
    fields: {
      // 表单项
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.visible = val
      },
      immediate: true
    },
    visible (val) {
      this.$emit('input', val)
      this.$emit('on-visible-change', val)
    }
  }
}
</script>
