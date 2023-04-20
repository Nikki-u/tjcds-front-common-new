<template>
  <a-form class="advance-search-wrapper" :form="form" layout="inline">
    <a-row :gutter="gutter">
      <a-col
        v-bind="filterCol"
        v-for="(item, index) in renderFields"
        v-show="index < showFilterLength"
        :key="index">
        <field-render :fieldOptions="item">
          <template v-if="item.slot">
            <slot :name="item.slot"></slot>
          </template>
        </field-render>
      </a-col>

      <a-col
        :xs="24"
        :md="12"
        :lg="8">
        <a-form-item class="action-button-zone">
          <tooltip-button
            type="primary"
            icon="search"
            :loading="loading"
            @click="handleSubmit">查询</tooltip-button>
          <tooltip-button
            type="default"
            icon="redo"
            @click="resetSearchForm">重置</tooltip-button>
          <tooltip-button
            v-if="useCollapsed && renderFields.length > maxCollapsed"
            type="default"
            :style="{ border: 'none', boxShadow: 'none' }"
            :icon="collapsed ? 'down' : 'up'"
            @click="togglecollapsed">{{ collapsed ? '展开' : '收起' }}</tooltip-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import TooltipButton from '../../Button/TooltipButton'
import FieldRender from '../Field/FieldRender'
import formMixins from '../mixins/formMixins'
// import TemplateCode from '../../../../docs/.vuepress/components/Common/TemplateCode'
export default {
  name: 'FormFilter',
  components: {
    // TemplateCode,
    TooltipButton,
    FieldRender
  },
  mixins: [formMixins],
  props: {
    filterCol: {
      type: Object,
      default: () => {
        return {
          xs: 24,
          md: 12,
          lg: 8
        }
      }
    },
    loading: {
      // 提交loading效果
      type: Boolean,
      default: false
    },
    useCollapsed: {
      type: Boolean,
      default: true
    },
    defaultCollapsed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      collapsed: true,
      gutter: 32,
      // 超过多少就显示展开，按照index从0开始
      maxCollapsed: 2,
      // label, formItem的全局配置可以在这里进行配置修改
      globalOptions: {}
    }
  },
  watch: {
    defaultCollapsed: {
      handler (val) {
        this.collapsed = val
      },
      immediate: true
    }
  },
  computed: {
    showFilterLength () {
      if (!this.useCollapsed) {
        return this.renderFields.length
      }
      if (this.renderFields.length <= this.maxCollapsed) {
        return this.maxCollapsed
      } else if (this.collapsed) {
        return this.maxCollapsed
      } else {
        return this.renderFields.length
      }
    },
    renderFields () {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.fields
        .map(item => {
          return Object.assign(item, this.globalOptions, {
            slot: item.filterSlot
          })
        })
    },
    showFields () {
      return this.renderFields.slice(0, this.showFilterLength)
    }
  },
  methods: {
    togglecollapsed () {
      this.collapsed = !this.collapsed
    },
    handleSubmit (e) {
      this.submit()
    },
    resetSearchForm () {
      this.reset()
    }
  }
}
</script>

<style lang="less">
  .advance-search-wrapper {
    .ant-form-item {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;
      >.ant-form-item-label {
        padding-right: 8px;
        width: auto;
      }
      >.ant-form-item-control-wrapper {
        -webkit-box-flex: 1;
        -ms-flex: 1 1;
        flex: 1 1;
      }
    }
    .action-button-zone .ant-btn:not(:last-of-type) {
      margin-right: 8px;
    }
  }
</style>
