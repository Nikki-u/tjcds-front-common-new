 <!-- 用于根据文件的后置提供一张预览图片  -->
<template>
  <span class="preview-icon">
    <a-tooltip placement="top" :title="previewDef[match].tip">
      <a-avatar :src="previewUrl" size="large" @click="download"></a-avatar>
    </a-tooltip>
  </span>
</template>

<script>
import { saveAs } from 'file-saver'
export default {
  name: 'DocPreviesIcon',
  props: {
    fileKey: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      previewDef: {
        img: {
          tip: '图片文件，点此查看大图',
          exts: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
        },
        excel: {
          tip: 'excel文档，点此下载',
          exts: ['xls', 'xlsx']
        },
        word: {
          tip: 'word文档，点此下载',
          exts: ['doc', 'docx']
        },
        pdf: {
          tip: 'pdf文档，点此下载',
          exts: ['pdf']
        },
        txt: {
          tip: '文本文件，点此下载',
          exts: ['txt']
        },
        video: {
          tip: '视频文件，点此下载',
          exts: ['mp4', 'mpg', 'mpeg', 'avi', 'rm', 'rmvb', 'mov', 'wmv', 'asf', 'dat']
        },
        audio: {
          tip: '音频文件，点此下载',
          exts: ['mp3', 'wma', 'rm', 'wav', 'mid', 'ape', 'flac']
        },
        null: {
          tip: '未知类型的文件，点此下载',
          exts: []
        }
      }
    }
  },
  computed: {
    ext () {
      if (!this.fileKey) {
        return ''
      }
      // 获取最后一个.的位置
      var index = this.fileKey.lastIndexOf('.')
      if (index < 0) {
        return ''
      }
      return this.fileKey.substr(index + 1).toLowerCase()
    },
    match () {
      let match = 'null'
      for (const key in this.previewDef) {
        if (this.previewDef[key].exts.indexOf(this.ext) !== -1) {
          match = key
          break
        }
      }
      return match
    },
    previewUrl () {
      if (this.match === 'img') {
        return this.url
      }
      return require(`./ext/${this.match}.png`)
    }
  },
  methods: {
    download () {
      saveAs(this.url, this.name)
      // window.open(`http://218.67.246.252:83/filePreview/onlinePreview?url=${encodeURIComponent(this.url)}`)
    }
  }
}
</script>

 <style lang="less" scoped>
 .preview-icon {
   cursor: pointer;
 }
 </style>
