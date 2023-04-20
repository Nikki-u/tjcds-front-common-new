<!-- 功能性表格组件  -->
<template>
  <a-table
    class="format-table"
    :bordered="$attrs.bordered || bordered"
    :columns="renderColumns"
    :row-key="rowKey ? rowKey : genRowkey"
    :components="components"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <!-- slot传递 与 内部格式化的挂载点渲染 -->
    <template
      v-for="key in Object.keys($scopedSlots).filter(k => !Object.keys($slots).includes(k))"
      :slot="key"
      slot-scope="p1,p2,p3,p4,p5"
    >
      <slot :name="key" :params="[p1,p2,p3,p4,p5]"></slot>
    </template>
    <template v-for="key in Object.keys($slots)" :slot="key">
      <slot :name="key"></slot>
    </template>
    <template
      v-for="col in slotColumns"
      :slot="col.scopedSlots.customRender"
      slot-scope="text, record"
    >
      <format-column v-if="col.isFormatScopedSlots" :key="col.dataIndex" :column="matchRenderColumn(col.dataIndex) || col" :row="record" v-on="$listeners"></format-column>
      <tooltip-cell v-else-if="col.ellipsis" :key="'twarp_' + col.dataIndex" :column="col" :title="text">
        {{ text }}
      </tooltip-cell>
    </template>
  </a-table>
</template>

<script>
import Vue from 'vue'
import FormatColumn from './Column/FormatColumn'
import VueDraggableResizable from 'vue-draggable-resizable'
import TooltipCell from './Column/TooltipCell'
import lodash from 'lodash'
let rowKeyIndex = 1
export default {
  name: 'FormatTable',
  components: {
    FormatColumn,
    VueDraggableResizable,
    TooltipCell
  },
  props: {
    rowKey: {
      type: [String, Function],
      default: null
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    matchRenderColumn (dataIndex) {
      return this.renderColumns.find(o => o.dataIndex === dataIndex)
    },
    genRowkey () {
      return this._uid + ++rowKeyIndex
    },
    loadRenderColumns () {
      this.renderColumns = this.columns
        .filter(col => col.hidden !== true)
        .map(col => {
          const ellipsis = col.ellipsis !== false
          return Object.assign(lodash.cloneDeep(col), {
            ellipsis: ellipsis,
            // 当外部没有传入scopedSlots且format参数存在时 为内部格式化的挂载点 这代表外部挂载点的优先级更高
            isFormatScopedSlots: col.format && col.scopedSlots === undefined,
            // 当外部没有传入scopedSlots且format参数也不存在时 自动添加一个用于tooltip显示的挂载点 它的优先级是最低的
            isTooltipWarpScopedSlots: ellipsis && !col.format && col.scopedSlots === undefined,
            // 设置挂载点信息 以外部传入的挂载点为主 内部构建的挂载点统一命名为table_format_加上列ID 防止重复
            scopedSlots: col.scopedSlots || { customRender: `format_table_slot_${col.dataIndex}` }
          })
        })
    },
    loadComponents () {
      const draggingMap = {}
      const hasDraggableColumns = this.renderColumns.some(col => col.draggable && col.width)
      if (!hasDraggableColumns) {
        return
      }
      this.renderColumns
        .filter(col => col.draggable && col.width)
        .forEach(col => {
          draggingMap[col.dataIndex] = col.width
        })
      const draggingState = Vue.observable(draggingMap)
      const ResizeableTitle = (h, props, children) => {
        const columns = this.renderColumns
        let thRender = null
        const { key, ...restProps } = props
        const col = columns.find(col => {
          const k = col.dataIndex || col.key
          return k === key
        })
        if (!col) {
          return h(
            'th',
            {
              props: { ...restProps }
            }, children
          )
        }
        children = [h(TooltipCell, {
          props: {
            column: col,
            title: col.title,
            warpComponet: 'th',
            content: col.title,
            offset: 5
          }
        })]
        if (!col.draggable || !col.width) {
          thRender = h(
            'th',
            {
              props: { ...restProps },
              class: { 'ellipsis-th': col.ellipsis }
            }, children
          )
          return thRender
        }
        this.bordered = true
        const onDrag = x => {
          draggingState[key] = 0
          col.width = Math.max(x, 10)
        }

        const onDragstop = () => {
          draggingState[key] = thRender.elm.getBoundingClientRect().width
        }

        const thProps = Object.assign({}, restProps, {
          width: col.width
        })
        const draggableChildrens = [...children]
        draggableChildrens.push(
          h(VueDraggableResizable, {
            props: {
              key: key,
              w: 10,
              x: draggingState[key] || col.width,
              z: 1,
              axis: 'x',
              draggable: true,
              resizable: false
            },
            on: {
              dragging: onDrag,
              dragstop: onDragstop
            },
            class: { 'table-draggable-handle': true }
          })
        )
        thRender = h(
          'th',
          {
            props: thProps,
            class: { 'resize-table-th': true, 'ellipsis-th': col.ellipsis }
          },
          draggableChildrens
        )
        return thRender
      }
      this.components = {
        header: {
          cell: ResizeableTitle
        }
      }
      Object.freeze(this.components)
    }
  },
  watch: {
    columns: {
      handler () {
        this.loadRenderColumns()
      },
      deep: true
    }
  },
  data () {
    return {
      bordered: false,
      components: {},
      renderColumns: [],
      slotColumns: []
    }
  },
  created () {
    this.loadRenderColumns()
    this.loadComponents()
    // 需要挂载格式化的列 与 tooltip提示包装的列
    this.slotColumns = lodash.cloneDeep(this.renderColumns.filter(col => (col.isFormatScopedSlots || col.isTooltipWarpScopedSlots)))
    Object.freeze(this.slotColumns)
  }
}
</script>
<style lang="less">
.format-table {
  table {
    table-layout: fixed;
  }
  .ellipsis-th {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
  }
  .resize-table-th {
    position: relative;
    .table-draggable-handle {
      height: 100% !important;
      bottom: 0;
      left: auto !important;
      right: -5px;
      cursor: col-resize;
      touch-action: none;
    }
  }
}
</style>
