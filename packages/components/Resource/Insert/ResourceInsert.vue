<template>
  <a-card>
    <a-steps :current="current">
      <a-step title="选择资源类型" />
      <a-step title="基础信息" />
      <a-step title="空间信息" />
    </a-steps>
    <div class="steps-content">
      <step-type
        v-show="current === 0"
        @on-change="handleResIdChange"
      />
      <step-form
        v-show="current === 1"
        ref="setpForm"
        :fields="curResConfig.fields"
        :formValue="formValue"
        @on-submit="handleFormSubmit"
        @on-res-select-value-change="selectValueChange"
      />
      <space-picker
        style="width:100%;height:400px;"
        v-show="current === 2"
        operType="add"
        :spaceType="spaceType"
        v-model="resData.spaceInfo">
      </space-picker>
    </div>
    <div class="steps-action">
      <a-button
        v-show="current > 0"
        style="margin-left: 8px"
        @click="prev"
      >上一步</a-button>
      <a-button
        style="margin-left: 8px"
        v-show="current < 2"
        type="primary"
        :disabled="nextDisabled"
        :loading="nextLoading"
        @click="next"
      >下一步</a-button>
      <a-button
        style="margin-left: 8px"
        v-show="current === 2"
        type="primary"
        :disabled="completeDisabled"
        :loading="completeLoading"
        @click="complete"
      >保存</a-button>
    </div>
    <div class="steps-footer">
      <div
        v-show="current === 0"
        class="desc-content"
      >
        <p class="desc-title">填写说明</p>
        <p class="desc">港口资源信息，请按照企业自身实际的资源情况进行填写，确保信息的真实有效，选择一次资源类型可以填加多条同类型资源。</p>
      </div>
    </div>
  </a-card>
</template>

<script>
import StepType from './StepType'
import StepForm from './StepForm'
import resourceServer from '../mixins/resourceServer'
export default {
  name: 'ResourceInsert',
  components: {
    StepType,
    StepForm
  },
  mixins: [resourceServer],
  props: {},
  data () {
    return {
      current: 0,
      nextLoading: false,
      completeLoading: false,
      resId: null,
      historyResId: null,
      curResConfig: {
        comment: '',
        spaceType: '',
        fields: []
      },
      resData: {},
      formValue: {}
    }
  },
  computed: {
    nextDisabled () {
      if (this.current === 0) {
        return !this.resId
      }
      return false
    },
    completeDisabled () {
      return !(this.resData && this.resData.spaceInfo)
    },
    spaceType () {
      return this.curResConfig.spaceType && this.curResConfig.spaceType.toLowerCase()
    }
  },
  methods: {
    handleResIdChange (resId) {
      this.resId = resId
    },
    handleFormSubmit (queryParams) {
      this.resData = queryParams
      this.current = 2
    },
    next () {
      switch (this.current) {
        case 0:
          this.loadForm()
          break
        case 1:
          this.$refs['setpForm'].submit()
          break
      }
    },
    prev () {
      this.current--
    },
    complete () {
      if (this.curResConfig.spaceType && this.resData.spaceInfo.length <= 0) {
        this.$message.error('未填写空间信息')
      } else {
        this.completeLoading = true
        this.commitResData(this.resId, this.resData).then(() => {
          this.completeLoading = false
          this.$message.success('操作完成!')
          this.$emit('resdata-success')
        })
      }
    },
    loadForm () {
      if (this.historyResId === this.resId) {
        this.current = 1
        return
      }
      this.nextLoading = true
      this.getResConfigById(this.resId).then(curResConfig => {
        this.curResConfig = curResConfig
        curResConfig.fields.forEach(item => {
          if (item.key === 'belongPortId') {
            if (item.options && item.options.length === 1) {
              this.$set(item, 'default', 1)
              this.formValue = { belongPortId: 1 }
            }
          }
        })
        this.nextLoading = false
        this.current = 1
        this.historyResId = this.resId
      })
    },
    // 填写表单时，select值的变化
    selectValueChange (queryParams) {
      if (queryParams) {
        this.getResConfigByIdAndFilter(this.resId, queryParams).then(curResConfig => {
          this.curResConfig = curResConfig
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.steps-content {
  margin-top: 16px;
  min-height: 200px;
  text-align: center;
}

.steps-action {
  text-align: center;
  margin-top: 24px;
}

.steps-footer {
  padding-top: 60px;
  .desc-content {
    text-align: left;
    color: rgba(0, 0, 0, 0.45);
    .desc-title {
      font-size: 16px;
      line-height: 12px;
    }
    .desc {
      font-size: 14px;
      line-height: 12px;
    }
  }
}
</style>
