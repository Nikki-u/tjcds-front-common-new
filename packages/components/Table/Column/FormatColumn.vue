<!-- 提供列的格式化支持 -->
<template>
  <span>
    <span v-if="isFormateStatusCol(column)">
      <a-badge
        :status="formatStatus(column, row, 'status')"
        :text="formatStatus(column, row, 'label')"
      />
    </span>
    <span v-else-if="isFormateActionsCol(column)">
      <tooltip-button-group :actions="column.actions" @click="handleActionClick"></tooltip-button-group>
    </span>
    <span v-else-if="isFormatTextAction(column)">
      <a
        v-for="(action, index) in column.actions"
        :key="'text_action_' + index"
        href="javascript:;"
        :style="{marginLeft: index === 0 ? '' : '8px'}"
        v-permission="action.permission"
        @click="handleActionClick(action)"
      >{{ action.text }}</a>
    </span>
    <span v-else-if="isFormatAvatar(column)">
      <a-avatar :src="formatObj(column,row)" />
    </span>
    <space-picker
      v-else-if="isFormatPoint(column)"
      :searchWidth="180"
      style="height: 300px;width: 100%"
      :value="row[column.dataIndex]"
      spaceType="point"
      operType="view"
    />
    <tooltip-cell v-else :title="text" :column="column">
      {{ text }}
    </tooltip-cell>
  </span>
</template>

<script>
import SpacePicker from '../../Map/SpacePicker'
import { TooltipButtonGroup } from '../../Button'
import { formatDate, formatObj } from '../../../utils'
import TooltipCell from './TooltipCell'
export default {
  name: 'FormatColumn',
  components: {
    SpacePicker,
    TooltipButtonGroup,
    TooltipCell
  },
  props: {
    column: {
      // 格式化的列
      type: Object,
      default: () => {
        return {}
      }
    },
    row: {
      // 行内容
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    text () {
      const column = this.column
      const row = this.row
      if (this.isFormateDateCol(column)) {
        return this.formatDate(column, row)
      } else if (this.isFormateStatusCol(column)) {
        return this.formatStatus(column, row, 'label')
      } else if (this.isFormateObjCol(column)) {
        return this.formatObj(column, row)
      } else if (this.isFormatOptions(column)) {
        return this.formatOptions(column, row)
      } else if (this.isFormatText(column)) {
        return this.formatText(column, row)
      } else {
        return row(column.dataIndex)
      }
    }
  },
  methods: {
    isFormateDateCol (column) {
      // 是否为日期格式化列
      return column.format.indexOf('formatDate') >= 0
    },
    formatDate (column, row) {
      // 时间格式化
      const formatOptions = column.format.split('|')
      const defaultFormate = 'YYYY-MM-DD HH:mm:ss'
      const value = row[column.dataIndex]
      if (Array.isArray(value)) {
        return value.map(o => formatDate(Number(o), formatOptions.length > 1 ? formatOptions[1] : defaultFormate)).join('-')
      }
      return formatDate(value, formatOptions.length > 1 ? formatOptions[1] : defaultFormate)
    },
    isFormateStatusCol (column) {
      // 是否为状态格式化列
      return column.format === 'formatStatus'
    },
    formatStatus (column, row, statusFlag) {
      // 状态格式化
      const status = column.options.find(status => {
        return status.value === row[column.dataIndex]
      })
      if (!status) return ''
      return status[statusFlag] ? status[statusFlag] : ''
    },
    isFormateObjCol (column) {
      // 是否为对象格式化列
      return column.format.indexOf('formatObj') >= 0
    },
    formatObj (column, row) {
      // 格式化对象
      const formatOptions = column.format.split('|')
      if (formatOptions.length <= 1) return row[column.dataIndex]
      return formatObj(row, formatOptions[1])
    },
    isFormateActionsCol (column) {
      // 是否为按钮样式的动作格式化列
      return column.format === 'formatActions' && Array.isArray(column.actions) && column.actions.length > 0
    },
    isFormatTextAction (column) {
      // 是否为文本样式的动作格式化列
      return column.format === 'formatTextActions' && Array.isArray(column.actions) && column.actions.length > 0
    },
    handleActionClick (action) {
      // 处理行内点击事件
      this.$emit('on-row-action', action, this.column, this.row)
    },
    isFormatAvatar (column) {
      // 是否为头像格式化列
      return column.format.indexOf('formatAvatar') >= 0
    },
    isFormatOptions (column) {
      // 是否为选项格式化列
      return column.format.indexOf('formatOptions') >= 0
    },
    formatOptions (column, row) {
      const option = column.options.find(o => o.value === row[column.dataIndex])
      return option ? option.label : ''
    },
    isFormatText (column) {
      // 是否为格式化文本
      return column.format.indexOf('formatText') >= 0
    },
    formatText (column, row) {
      const formatOptions = column.format.split('|')
      if (formatOptions.length < 2) {
        return ''
      }
      const template = formatOptions[1]
      // 高亮template部分并使用参数渲染
      const result = template
        .split(/(\$\{\w+\})/)
        .filter(item => {
          return item !== ''
        })
        .map(item => {
          const matchResult = /\${(.+?)}/.exec(item)
          if (matchResult) {
            if (row[matchResult[1]] !== null && row[matchResult[1]] !== undefined) {
              return row[matchResult[1]]
            } else {
              return matchResult[0]
            }
          } else return item
        })
        .join('')
      return result
    },
    isFormatPoint (column) {
      // 是否为格式化地图点位
      return column.format === 'formatPoint'
    }
  }
}
</script>
