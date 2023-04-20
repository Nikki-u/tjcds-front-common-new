<!-- 文件上传组件的已上次文件预览模块 -->
<template>
  <span>
    <a-col
      span="8"
      class="file-list"
      :style="boxStyle"
      v-for="(item, index) in fileList"
      :key="index"
    >
      <template>
        <div :class="{ 'error-status': item.status === 'error', 'clicked-status': item._clicked }">
          <a-spin v-if="item.status === 'uploading'">
            <label class="file-label">正在上传</label>
            <img :style="boxStyle" :src="loadImgUrl(item)" />
          </a-spin>
          <div v-else>
            <div>
              <a-tooltip max-width="200" :title="item.name" white-space="normal">
                <label class="file-label">{{ item.name.split(".")[0] }}</label>
              </a-tooltip>
              <img :style="boxStyle" :src="loadImgUrl(item)" />
            </div>
            <a-row class="file-list-cover">
              <a-col :span="preview ? 12 : 8" v-if="item.status === 'done' || preview">
                <a-tooltip max-width="200" title="预览文件" white-space="normal">
                  <a :href="loadFilePreviewUrl(item)" @click="handleItemClick(item)" target="_blank">
                    <a-icon type="eye" :size="iconSize"></a-icon>
                  </a>
                </a-tooltip>
              </a-col>
              <a-col :span="preview ? 12 : 8" v-if="item.status === 'done' || preview">
                <a-tooltip max-width="200" title="下载文件" @click="handleItemClick(item)" white-space="normal">
                  <a :href="item.url" target="_blank">
                    <a-icon type="download" :size="iconSize"></a-icon>
                  </a>
                </a-tooltip>
              </a-col>
              <a-col :span="12" v-if="item.status === 'error'">
                <a-tooltip max-width="200" title="重新上传" white-space="normal">
                  <a-icon type="redo" @click="handleRedo(item)" :size="iconSize"></a-icon>
                </a-tooltip>
              </a-col>
              <a-col :span="8" v-if="!preview">
                <a-tooltip max-width="200" title="删除文件" white-space="normal">
                  <a-icon type="delete" @click="handleFileRemove(item)" :size="iconSize"></a-icon>
                </a-tooltip>
              </a-col>
            </a-row>
          </div>
        </div>
      </template>
    </a-col>
  </span>
</template>

<script>
export default {
  name: 'FilePreview',
  props: {
    // 预览处理的文件列表
    fileList: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    // 尺寸
    size: {
      type: String,
      required: false,
      default: 'large'
    },
    previewUrl: {
      type: String,
      default: 'http://218.67.246.252:83/filePreview/onlinePreview'
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      previewDef: {
        img: {
          tip: '图片文件，点此预览',
          exts: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
        },
        excel: {
          tip: 'excel文档，点此预览',
          exts: ['xls', 'xlsx']
        },
        word: {
          tip: 'word文档，点此预览',
          exts: ['doc', 'docx']
        },
        pdf: {
          tip: 'pdf文档，点此预览',
          exts: ['pdf']
        },
        txt: {
          tip: '文本文件，点此预览',
          exts: ['txt']
        },
        video: {
          tip: '视频文件，点此预览',
          exts: ['mp4', 'mpg', 'mpeg', 'avi', 'rm', 'rmvb', 'mov', 'wmv', 'asf', 'dat']
        },
        audio: {
          tip: '音频文件，点此预览',
          exts: ['mp3', 'wma', 'rm', 'wav', 'mid', 'ape', 'flac']
        },
        null: {
          tip: '未知类型的文件，点此预览',
          exts: []
        }
      }
    }
  },
  computed: {
    // 样式
    boxStyle () {
      if (this.size === 'small') {
        return { width: '58px', height: '58px', lineHeight: '58px' }
      } else if (this.size === 'large') {
        return { width: '104px', height: '104px', lineHeight: '104px' }
      } else if (this.size === 'mini') {
        return { width: '37px', height: '37px', lineHeight: '37px' }
      } else {
        return { width: '78px', height: '78px', lineHeight: '78px' }
      }
    },
    // 图标大小
    iconSize () {
      if (this.size === 'small') {
        return 16
      } else if (this.size === 'large') {
        return 24
      } else {
        return 20
      }
    }
  },
  watch: {},
  methods: {
    handleItemClick (item) {
      this.$set(item, '_clicked', true)
    },
    loadFilePreviewUrl (item) {
      return `${this.previewUrl}?url=${encodeURIComponent(item.url)}`
    },
    loadImgUrl (item) {
      const ext = this.loadExt(item)
      let matchExt = 'null'
      for (const key in this.previewDef) {
        if (this.previewDef[key].exts.indexOf(ext) !== -1) {
          matchExt = key
          break
        }
      }
      if (matchExt === 'img') {
        return item.url
      }
      return require(`./ext/${matchExt}.png`)
    },
    loadExt (file) {
      if (!file.name) {
        return ''
      }
      const index = file.name.lastIndexOf('.')
      if (index < 0) {
        return ''
      }
      return file.name.substr(index + 1).toLowerCase()
    },
    // 处理文件移除操作
    handleFileRemove (item) {
      this.$emit('on-file-remove', item)
    },
    // 处理文件上传重试
    handleRedo (item) {
      this.$emit('on-file-redo', item)
    }
  }
}
</script>

<style lang="less" scoped>
.file-list {
  display: inline-block;
  text-align: center;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin: 5px;
  .file-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.6);
    i {
      color: #fff;
      /* font-size: 22px; */
      cursor: pointer;
      /* padding: 5px; */
    }
  }
  &:hover .file-list-cover {
    display: block;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .error-status {
    border: #ff4d4f solid 2px;
    height: 100%;
  }
  .clicked-status {
    border: #1890ff solid 2px;
    height: 100%;
  }
  .file-label {
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    font-weight: 700;
    bottom: 2px;
    width: 100%;
    color: #000;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    z-index: 200;
  }
}
</style>
