<template>
  <div>
    <a-form :layout="preview ? 'inline' : layout" :form="form">
      <a-row v-for="i in rows" :key="'preview_row' + i" :gutter="gutter">
        <a-col v-for="j in getCols(i)" :span="24 / cols" :key="i + 'row_preview_col' + j">
          <span>
            <field-preview
              v-show="preview || getField(i, j).preview"
              :formValue="curFormValue"
              :fieldOptions="getField(i, j)"
              :class="{ 'preview-form-item': preview }">
              <template v-if="getField(i, j).previewSlot">
                <slot :name="getField(i, j).previewSlot"></slot>
              </template>
            </field-preview>
            <field-render
              v-show="!preview && !getField(i, j).preview"
              :fieldOptions="getField(i, j)"
              :key="i + 'row_field_col' + j">
              <template v-if="getField(i, j).formSlot">
                <slot :name="getField(i, j).formSlot"></slot>
              </template>
            </field-render>
          </span>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import FieldRender from '../Field/FieldRender'
import FieldPreview from '../Preview/FieldPreview'
import formMixins from '../mixins/formMixins'
export default {
  name: 'FormEditor',
  components: {
    FieldRender,
    FieldPreview
  },
  mixins: [formMixins],
  props: {
    layout: {
      type: String,
      default: 'horizontal'
    },
    gutter: {
      type: Number,
      default: 96
    },
    preview: {
      // 预览状态
      type: Boolean,
      default: true
    },
    cols: {
      // 每行展示多少列
      type: Number,
      default: 3
    }
  },
  data () {
    return {}
  },
  computed: {
    rows () {
      const len = this.fields.length
      return Math.ceil(len / this.cols)
    },
    renderFields () {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.fields
        .map(item => {
          return Object.assign(item, this.globalOptions, {
            slot: item.formSlot
          })
        })
    }
  },
  methods: {
    getField (i, j) {
      const index = (i - 1) * this.cols + j - 1
      return this.renderFields[index]
    },
    getCols (i) {
      const len = this.renderFields.length
      return i === this.rows ? (len % this.cols === 0 ? this.cols : len % this.cols) : this.cols
    }
  }
}
</script>
