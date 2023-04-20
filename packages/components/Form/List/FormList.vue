<template>
  <div class="form-list-wrapper">
    <a-form :layout="formLayout" :form="form">
      <template v-for="(item) in renderFields">
        <template v-if="item.key">
          <field-preview
            v-show="preview || item.preview"
            :class="{ 'preview-form-item': preview }"
            :key="'preview' + item.key"
            :formValue="curFormValue"
            :fieldOptions="item">
            <template v-if="item.previewSlot">
              <slot :name="item.previewSlot"></slot>
            </template>
          </field-preview>
          <field-render
            v-show="!preview && !item.preview&&!item.hidden"
            :fieldOptions="item"
            :key="'form' + item.key" >
            <template v-if="item.formSlot">
              <slot :name="item.formSlot"></slot>
            </template>
          </field-render>
        </template>
      </template>
      <a-form-item style="text-align:center" v-if="!hiddenFooter">
        <slot v-if="$slots.footer" name="footer"></slot>
        <template v-else>
          <tooltip-button
            title="提交表单"
            type="primary"
            icon="check"
            :size="size"
            :loading="loading"
            @click="handleSubmit">提交</tooltip-button>
          <tooltip-button style="margin-left: 8px" title="将表单恢复为初始值" icon="redo" :size="size" @click="resetSearchForm">重置</tooltip-button>
        </template>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import TooltipButton from '../../Button/TooltipButton'
import FieldRender from '../Field/FieldRender'
import formMixins from '../mixins/formMixins'
import FieldPreview from '../Preview/FieldPreview'
export default {
  name: 'FormList',
  components: {
    TooltipButton,
    FieldRender,
    FieldPreview
  },
  mixins: [formMixins],
  props: {
    formLayout: {
      // 表单布局
      type: String, // 'horizontal'|'vertical'|'inline'
      default: 'horizontal'
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      // 全局控件大小
      type: String,
      default: 'default'
    },
    preview: {
      // 预览状态
      type: Boolean,
      default: false
    },
    responsive: {
      // 表单项的响应布局
      type: Object,
      default: function () {
        return {
          labelCol: { span: 5 },
          wrapperCol: { span: 16 }
        }
      }
    },
    hiddenFooter: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    globalOptions () {
      // 全局配置
      return {
        size: this.size,
        ...this.formItemLayout
      }
    },
    renderFields () {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.fields
        .map(item => {
          return Object.assign(item, this.globalOptions, {
            slot: item.formSlot
          })
        })
    },
    formItemLayout () {
      // 更改布局项目的尺寸
      const { formLayout } = this
      if (formLayout === 'horizontal') {
        return this.responsive
      } else {
        return {}
      }
    },
    buttonItemLayout () {
      // 提交按钮布局
      const { formLayout } = this
      return formLayout === 'horizontal'
        ? {
          wrapperCol: { span: 14, offset: 4 }
        }
        : {}
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.submit()
    },
    resetSearchForm () {
      this.reset()
    }
  }
}
</script>

<style lang="less" scoped>
.preview-form-item {
    margin-bottom: 0;
}
</style>
