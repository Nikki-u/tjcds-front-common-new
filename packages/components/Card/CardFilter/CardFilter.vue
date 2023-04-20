<template>
  <a-card
    class="card-search-wrapper"
    :bordered="false"
  >
    <a-form :form="form">
      <a-form-item
        v-if="search"
        style="text-align: center;"
      >
        <a-input-search
          style="width: 60%;"
          placeholder="请输入查询关键字"
          size="large"
          v-decorator="['search']"
          @search="submit"
          @pressEnter="pressEnter"
        >
          <a-button
            type="primary"
            icon="search"
            slot="enterButton"
          >搜索</a-button>
        </a-input-search>
      </a-form-item>

      <!-- checkbox点选查询区域 -->
      <field-render
        v-if="renderFields && renderFields.length > 0"
        v-for="(item, index) in renderFields"
        :fieldOptions="item"
        :key="index"
      >
        <template v-if="item.slot">
          <slot :name="item.slot"></slot>
        </template>
      </field-render>

      <a-row>
        <a-col class="ant-form-item-label" v-if="sorts && sorts.length > 0">
          <!-- 排序 -->
          <filter-sort
            :sorts="sorts"
            @on-sort="handleSort"
          ></filter-sort>
        </a-col>
        <a-col
          class="ant-form-item-control-wrapper action-button-zone"
          v-if="Object.keys(displays).length>0||actions.length>0"
        >
          <!-- 功能按钮 -->
          <tooltip-button-group
            v-if="actions.length>0"
            :actions="actions"
            @click="handleAction"
          ></tooltip-button-group>
          <a-divider
            type="vertical"
            v-if="actions.length>0&&displays"
          />

          <a-radio-group
            v-if="displays"
            name="display"
            :defaultValue="displays.defaultValue"
            buttonStyle="solid"
            @change="handleDisplayChange"
          >
            <a-radio-button
              v-show="displays.options"
              v-for="(display, index) in displays.options"
              :key="index"
              :value="display.value"
            >
              <a-icon :type="display.icon" /> {{ display.label }}
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import TooltipButton from '../../Button/TooltipButton'
import FieldRender from '../../Form/Field/FieldRender'
import formMixins from '../../Form/mixins/formMixins'
import FilterSort from './FilterSort'
export default {
  name: 'CardFilter',
  components: {
    TooltipButton,
    FieldRender,
    FilterSort
  },
  mixins: [formMixins],
  data () {
    return {
      // 全局的配置
      globalOptions: {
        filterType: 'cardFilter'
      },
      // 排序参数
      sortParams: {}
    }
  },
  computed: {
    renderFields () {
      // 重组传入的数据，合并全局配置，子项的配置优先全局
      return this.fields
        .map(item => {
          return Object.assign(item, this.globalOptions, {
            slot: item.filterSlot
          })
        })
    }
  },
  props: {
    // 是否显示上部的搜索框
    search: {
      type: Boolean,
      default: true
    },
    // 排序字段 {key, label, icon, order}
    sorts: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作按钮 {} 与tipButtons一致
    actions: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 展现形式 {defaultValue, options: [{label, icon, value}]}
    displays: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    // 响应排序
    handleSort (sort) {
      this.sortParams = {
        orderColumn: sort.key,
        orderType: sort.order
      }
      this.$emit('on-sort', this.queryParams, this.sortParams)
    },
    // 响应操作按钮
    handleAction (action) {
      this.$emit('on-action', action)
    },
    // 响应显示卡变化
    handleDisplayChange (event) {
      this.$emit('on-display-change', event.target.value)
    },
    pressEnter (e) {
      e.preventDefault()
    }
  }
}
</script>

<style lang="less">
.card-search-wrapper {
  .ant-form-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #e8e8e8;
    .ant-form-item-label {
      padding-right: 8px;
      width: auto;
    }
    .ant-form-item-control-wrapper {
      -webkit-box-flex: 1;
      -ms-flex: 1 1;
      flex: 1 1;
      line-height: 40px;
      .ant-tag-checkable {
        font-size: 14px;
      }
    }
  }
  .ant-form-item:first-child,
  .ant-form-item:last-child {
    border-bottom: none;
  }
  .action-button-zone {
    display: inline-flex !important;
    display: -webkit-inline-box !important;
    display: -ms-inline-flexbox !important;
    position: absolute;
    right: 0;
  }
}
</style>
