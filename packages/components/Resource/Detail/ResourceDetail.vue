<template>
  <div>
    <a-card title="基础信息" :loading="loadFormLoading">
      <tooltip-button
        slot="extra"
        style="margin-right:10px"
        @click="handleCancelInfo"
        v-if="!formPreview"
      >取消</tooltip-button>
      <tooltip-button
        type="primary"
        slot="extra"
        :loading="formLoading"
        @click="handleFormPreviewChange"
      >{{ formPreview | previewFilters }}</tooltip-button>
      <form-editor
        ref="formEditor"
        :preview="formPreview"
        :fields="curResConfig.fields"
        :formValue="formValue"
        @on-submit="handleFormSubmit"
      >
        <template slot="previewResSlot">
          <FilePreview :fileList="formValue.deptFile"></FilePreview>
        </template>
      </form-editor>
    </a-card>
    <a-card
      title="空间信息"
      class="space-info"
    >
      <div slot="extra">
        <tooltip-button
          style="margin-right:10px"
          @click="handleCancelMap"
          v-if="!spacePreview"
        >取消</tooltip-button>
        <tooltip-button
          type="primary"
          :loading="spaceLoading"
          @click="handleSpacePreviewChange"
        >{{ spacePreview | previewFilters }}</tooltip-button>
      </div>
      <space-picker
        style="width:100%;height:400px;"
        :operType="spaceOperType"
        :spaceType="spaceType"
        v-model="formValue.spaceInfo"
      >
      </space-picker>
    </a-card>
  </div>
</template>
<script>
import resourceServer from '../mixins/resourceServer'
import { isNumber } from '../../../utils'
import FilePreview from './FilePreview'
export default {
  name: 'ResourceDetail',
  mixins: [resourceServer],
  components: {
    FilePreview
  },
  props: {
    resId: {
      type: Number,
      default: null
    },
    dataId: {
      type: Number,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formPreview: true,
      formLoading: false,
      formValue: {},
      spacePreview: true,
      spaceLoading: false,
      curResConfig: {
        comment: '',
        spaceType: '',
        fields: []
      },
      // 防止多次重复加载同样的资源类型数据
      historyResId: null,
      // 防止重复加载资源数据
      loadFormLoading: false,
      commonInfo: null,
      commonMap: null
    }
  },
  computed: {
    spaceOperType () {
      return this.spacePreview ? 'view' : 'edit'
    },
    spaceType () {
      return this.curResConfig.spaceType && this.curResConfig.spaceType.toLowerCase()
    }
  },
  filters: {
    previewFilters (preview) {
      return preview ? '编辑' : '保存'
    }
  },
  methods: {
    loadForm () {
      if (this.loadFormLoading) {
        return
      }
      this.loadFormLoading = true
      if (this.historyResId === this.resId) {
        this.loadFormData()
      } else {
        this.getResConfigById(this.resId).then(curResConfig => {
          this.historyResId = this.resId
          this.curResConfig = curResConfig
          this.loadFormData()
        })
      }
    },
    loadFormData () {
      this.getResDataById(this.resId, this.dataId).then(resData => {
        this.formValue = {}
        this.formValue = this.formatFormData(resData, this.curResConfig)
        this.commonInfo = this.formatFormData(resData, this.curResConfig)
        this.formValue.spaceInfo = JSON.parse(resData.spaceInfo)
        this.loadFormLoading = false
      }).finally(() => (this.loadFormLoading = false))
    },
    handleFormPreviewChange () {
      if (this.formPreview) {
        this.formPreview = false
      } else {
        this.$refs['formEditor'].submit()
        this.loadFormData()
      }
    },
    handleSpacePreviewChange () {
      if (this.spacePreview) {
        this.spacePreview = false
      } else {
        this.handleSpaceSubmit()
      }
    },
    handleFormSubmit (queryParams) {
      this.formLoading = true
      const resData = Object.assign({}, this.formValue, queryParams)
      this.updateResData(this.resId, this.dataId, resData).then(() => {
        this.formPreview = true
        this.formLoading = false
        this.commonInfo = resData
        this.formValue = resData
      }).finally(() => (this.formLoading = false))
    },
    handleSpaceSubmit () {
      this.spaceLoading = true
      if (this.curResConfig.spaceType && this.formValue.spaceInfo.length <= 0) {
        this.$message.error('未填写空间信息')
        this.spaceLoading = true
      } else {
        this.spacePreview = true
        setTimeout(() => {
          const resData = Object.assign({}, this.formValue)
          this.updateResData(this.resId, this.dataId, resData).then(() => {
            this.spaceLoading = false
            this.spacePreview = true
          }).finally(() => (this.spaceLoading = false))
        }, 1000)
      }
    },
    handleCancelInfo () {
      this.formValue = Object.assign({}, this.commonInfo)
      this.formLoading = false
      this.formPreview = true
    },
    handleCancelMap () {
      this.formValue.spaceInfo = this.commonInfo.spaceInfo
      this.spaceLoading = false
      this.spacePreview = true
    }
  },
  watch: {
    resId: {
      immediate: true,
      handler (val, oval) {
        if (isNumber(val)) {
          this.loadForm()
        }
      }
    },
    dataId: {
      immediate: true,
      handler (val, oval) {
        if (isNumber(val) && isNumber(this.resId)) {
          this.loadForm()
        }
      }
    },
    '$route': {
      immediate: true,
      handler (val, oval) {
        if (JSON.stringify(val.query) !== '{}' && val.query.action === 'edit') {
          this.formPreview = false
          this.spacePreview = false
        }
      },
      deep: true
    }
  }
}
</script>

<style>
.space-info {
  margin-top: 20px;
}
</style>
