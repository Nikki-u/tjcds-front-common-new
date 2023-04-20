<template>
  <div class="clearfix">
    <a-upload
      v-if="!preview && align === 'left'"
      :accept="accept"
      :action="uploadAction"
      listType="picture-card"
      :fileList="fileList"
      :headers="headers"
      :beforeUpload="beforeUpload"
      :remove="removeFileHandler"
      :showUploadList="false"
      @preview="handlePreview"
      @change="handleChange"
      style="width: 104px;display: inline-block;vertical-align: top;margin: 5px;"
    >
      <div v-if="max === 0 || fileList.length < max">
        <a-icon type="plus" />
        <div class="ant-upload-text">点此上传</div>
      </div>
    </a-upload>
    <FilePreview
      v-if="fileList && fileList.length > 0"
      class="fileUpload"
      :fileList="fileList"
      :previewUrl="previewUrl"
      :preview="preview"
      @on-file-redo="reuploadfileHandler"
      @on-file-remove="removeFileHandler"
      style="vertical-align: top;"
    ></FilePreview>
    <a-upload
      v-if="!preview && align === 'right'"
      :accept="accept"
      :action="uploadAction"
      listType="picture-card"
      :fileList="fileList"
      :headers="headers"
      :beforeUpload="beforeUpload"
      :remove="removeFileHandler"
      :showUploadList="false"
      @preview="handlePreview"
      @change="handleChange"
      style="display:inline-block;vertical-align: bottom;margin: 5px;width:auto;"
    >
      <div v-if="max === 0 || fileList.length < max">
        <a-icon type="plus" />
        <div class="ant-upload-text">点此上传</div>
      </div>
    </a-upload>
  </div>
</template>
<script>
import FilePreview from './FilePreview'
let self = this
export default {
  name: 'FileUpload',
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    headers: {
      type: Object,
      default: () => {
        return {}
      }
    },
    previewUrl: {
      type: String,
      default: 'http://218.67.246.252:83/filePreview/onlinePreview'
    },
    action: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'large'
    },
    align: {
      type: String,
      default: 'right'
    },
    preview: {
      type: Boolean,
      default: false
    },
    beforeUpload: {
      type: Function,
      default: (file, cb) => {
        const isLt30M = file.size / 1024 / 1024 < 30
        if (!isLt30M && typeof cb === 'function') {
          self.$message.error('上传文件不能超过30MB!')
        }
        return isLt30M
      }
    }
  },
  data () {
    return {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      historyFileList: [],
      uploadList: []
    }
  },
  components: {
    FilePreview
  },
  computed: {
    uploadAction () {
      const baseUrl = this.$http.defaults.baseURL || ''
      return baseUrl + this.action
    }
  },
  methods: {
    handlePreview (file) {
      window.open(`${this.previewUrl}?url=${encodeURIComponent(file.url)}`)
    },
    reuploadfileHandler (file) {

    },
    removeFileHandler (file) {
      this.fileList.splice(this.fileList.indexOf(file), 1)
      const newFileList = this.fileList.map(o => ({
        key: o.key,
        name: o.name,
        url: o.url
      }))
      this.$emit('input', newFileList)
      this.$nextTick(() => this.$emit('change', newFileList))
      if (file.response && file.response.data && file.response.data.key) {
        return new Promise((resolve, reject) => {
          this.$http
            .delete(`${this.action}/${file.response.data.key}`)
            .then(() => {
              resolve()
            })
            .catch(err => {
              reject(err)
            })
        })
      } else {
        return true
      }
    },
    handleChange ({ file, fileList }) {
      const next = this.beforeUpload(file, msg => {
        this.$message.error(msg)
      })
      if (!next) {
        return
      }
      let fileListTmp = [...fileList]
      fileListTmp = fileListTmp.map(o => {
        if (o.response && o.response.status && o.response.status === 200) {
          const data = o.response.data
          o.key = data.key
          o.url = data.url
        }
        return o
      })
      this.fileList = fileListTmp
      if (file.response) {
        if (file.status === 'error' || file.response.status !== 200) {
          this.$notification.error({
            description: '文件上传失败',
            message: file.response.errorMsg || '文件上传服务出错'
          })
          // this.removeFileHandler(file)
        } else {
          this.historyFileList = this.fileList.map(o => ({
            key: o.key,
            name: o.name,
            url: o.url
          }))
          this.$emit('input', this.historyFileList)
          this.$nextTick(() => this.$emit('change', this.historyFileList))
        }
      }
    }
  },
  watch: {
    value (val) {
      if (val === this.historyFileList) {
        return
      }
      if (val) {
        this.fileList = val.map(o => {
          return {
            key: o.key,
            uid: o.key,
            name: o.name,
            url: o.url,
            status: 'done'
          }
        })
      } else {
        this.fileList = []
      }
    }
  },
  mounted () {
    self = this
  }
}
</script>
<style lang="less">
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
