<!-- FormTable -->
<template>
  <div>
    <form-filter
      v-if="hasFormFilter"
      :filterCol="filterCol"
      :fields="filterFields"
      :loading="filterLoading"
      :formValue="filterValue"
      v-bind="filterOptions"
      @submit="handleFilterSubmit"
      @on-value-change="handleFilterValueChange"
      @reset="handleFilterReset"
    >
      <template v-for="field in slotFilterFields">
        <slot :slot="field.filterSlot" :name="field.filterSlot"></slot>
      </template>
    </form-filter>
    <div class="filter-table-topbar">
      <div class="topbarActionsSlot">
        <slot v-if="$slots.topbar" name="topbar"></slot>
      </div>
      <tooltip-button-group
        class="topbarActionsSlot"
        v-if="topbarActions"
        :actions="topbarActions"
        @click="handleTopbarActionClick"
      ></tooltip-button-group>
    </div>
    <format-table :columns="columns" v-bind="$attrs" v-on="$listeners">
      <template
        v-for="key in Object.keys($scopedSlots).filter(k => !Object.keys($slots).includes(k))"
        :slot="key"
        slot-scope="props"
      >
        <slot :name="key" v-bind="props"></slot>
      </template>
      <template v-for="key in Object.keys($slots)" :slot="key">
        <slot :name="key"></slot>
      </template>
    </format-table>
    <div v-if="hasFormModal">
      <form-modal
        v-if="formType === 'modal'"
        v-model="formModalVisible"
        :width="formWidth"
        :formValue="formValue"
        :title="formModalAction | formModalActionFilter(formName)"
        :fields="formFields"
        :loading="formLoading"
        @submit="handleFormSubmit"
        @on-value-change="handleFormValueChange"
      >
        <template v-for="field in slotFormFields">
          <slot :slot="field.formSlot" :name="field.formSlot"></slot>
        </template>
      </form-modal>
      <form-drawer
        v-else
        v-model="formModalVisible"
        :width="formWidth"
        :formValue="formValue"
        :title="formModalAction | formModalActionFilter(formName)"
        :fields="formFields"
        :loading="formLoading"
        @submit="handleFormSubmit"
      >
        <template v-for="field in slotFormFields">
          <slot :slot="field.formSlot" :name="field.formSlot"></slot>
        </template>
      </form-drawer>
    </div>

    <!-- 用于展示数据 -->
    <preview-modal
      v-model="previewModalVisible"
      :width="formWidth"
      :fields="previewFields"
      :previewValue="previewValue"
    >
      <template
        v-for="key in Object.keys($scopedSlots).filter(k => !Object.keys($slots).includes(k))"
        :slot="key"
        slot-scope="props"
      >
        <slot :name="key" v-bind="props"></slot>
      </template>
      <template v-for="key in Object.keys($slots)" :slot="key">
        <slot :name="key"></slot>
      </template>
    </preview-modal>
  </div>
</template>

<script>
import { FormFilter } from '../Form'
import { FormModal } from '../Modal'
import { FormDrawer } from '../Drawer'
import { TooltipButtonGroup } from '../Button'
import { FormatTable } from '../Table'
import PreviewModal from './Preview/PreviewModal'
import tableFilterMixins from './mixins/tableFilterMixins'
import tableFormMixins from './mixins/tableFormMixins'

export default {
  name: 'FormTable',
  components: {
    FormFilter,
    PreviewModal,
    FormModal,
    FormDrawer,
    TooltipButtonGroup,
    FormatTable
  },
  mixins: [tableFilterMixins, tableFormMixins],
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
    filterOptions: {
      type: Object,
      default: () => {
        return {
          useCollapsed: true,
          defaultCollapsed: true
        }
      }
    },
    formType: {
      type: String,
      default: 'modal'
    },
    formWidth: {
      type: Number,
      default: 720
    },
    formName: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    filterValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    topbarActions: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleTopbarActionClick (action) {
      // 工具栏点击事件
      this.$emit('on-topbar-action', action)
    },
    handleFilterValueChange (queryParams) {
      this.$emit('on-filter-value-change', queryParams)
    },
    handleFormValueChange (queryParams) {
      this.$emit('on-value-change', queryParams)
    }
  }
}
</script>

<style lang="less">
.filter-table-topbar {
  text-align: right;
  margin: 0 auto 10px auto;
  .ant-card-wider-padding .ant-card-head {
    padding: 0;
  }
}
.topbarActionsSlot {
  display: inline-block;
}
</style>
