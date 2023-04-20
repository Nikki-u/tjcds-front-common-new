<template>
  <div class="step-form">
    <a-alert class="alert" message="请根据企业实际情况进行如实填写，确保信息真实有效！" type="info" showIcon closable/>
    <form-list
      class="form-list"
      v-bind="$attrs"
      ref="formList"
      hiddenFooter
      v-on="$listeners"
      @on-res-select-value-change="selectValueChange"/>
  </div>
</template>

<script>
import { FormList } from '../../Form'
export default {
  name: 'StepForm',
  components: {
    FormList
  },
  methods: {
    submit () {
      this.$refs['formList'].submit()
    },
    selectValueChange (queryParams) {
      if (queryParams) {
        this.$emit('on-res-select-value-change', this.queryParams)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step-form {
  text-align: left;
  .alert {
    width: 480px;
    margin: 0 auto;
  }
  .form-list {
    margin-top: 20px;
  }
}
</style>
