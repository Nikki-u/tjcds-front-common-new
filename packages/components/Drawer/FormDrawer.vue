<!--  -->
<template>
  <a-drawer
    :title="title"
    :width="width"
    @close="visible = false"
    :closable="false"
    :visible="visible"
    :maskClosable="false"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <form-list
      style="margin-bottom: 53px;"
      ref="formList"
      :fields="fields"
      hiddenFooter
      @on-submit="handleFormSubmit"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="field in slotFields" :slot="field.formSlot">
        <slot :name="field.formSlot"></slot>
      </template>
    </form-list>
    <div
      :style="{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
      }"
    >
      <a-button :style="{marginRight: '8px'}" @click="visible = false">取消</a-button>
      <a-button @click="handleOk" :loading="loading" type="primary">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import FormList from '../Form/List/FormList'
export default {
  name: 'FormDrawer',
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
      return this.fields.filter(item => item.formSlot).map(item => ({ ...this.globalOptions, ...item }))
    }
  },
  methods: {
    handleOk () {
      this.$refs['formList'].submit()
    },
    handleFormSubmit (queryParams) {
      this.visible = false
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
