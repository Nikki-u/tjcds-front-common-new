<!--  -->
<template>
  <a-modal
    :title="title"
    v-model="visible"
    :width="width"
    :maskClosable="false"
    okText="提交"
    cancelText="取消"
    :confirmLoading="loading"
    @ok="handleOk">
    <form-list
      ref="formList"
      :fields="fields"
      hiddenFooter
      @on-submit="handleFormSubmit"
      v-bind="$attrs"
      v-on="$listeners">
      <template
        v-for="field in slotFields"
        :slot="field.formSlot">
        <slot :name="field.formSlot"></slot>
      </template>
    </form-list>
  </a-modal>
</template>

<script>
import FormList from '../Form/List/FormList'
export default {
  name: 'FormModal',
  components: {
    FormList
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '表单编辑'
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
  computed: {
    slotFields () {
      // 挂载的子项
      return this.fields
        .filter(item => (item.formSlot))
        .map(item => ({ ...this.globalOptions, ...item }))
    }
  },
  methods: {
    handleOk () {
      this.$refs['formList'].submit()
    },
    handleFormSubmit (queryParams) {
      // this.visible = false
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
