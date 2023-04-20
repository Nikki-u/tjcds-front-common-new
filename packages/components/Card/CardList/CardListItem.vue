<template>
  <a-card :hoverable="hoverable" class="resource-card" @click="handleCardClick">
    <template class="ant-card-actions" slot="actions">
      <span
        v-for="(action, index) in actions"
        :key="'res_card_' + index"
        @click="handleAction(action)"
      >{{ action.text }}</span>
    </template>
    <a-card-meta>
      <p slot="title" class="meta-title">
        <tooltip-cell :title="(resource.name?resource.name:'无名称') + '【' + resource.type + '】'"></tooltip-cell>
      </p>
      <template slot="description">
        <div
          v-if="resource.subscript"
          class="superscript"
          :style="{ color: resource.subscript.color }"
        >
          <a-tooltip>
            <div slot="title" v-html="resource.subscript.tip"></div>
            <div
              class="triangle"
              :style="{ 'border-top-color': resource.subscript.backgroundColor }"
            ></div>
            <div class="desc">{{ resource.subscript.title }}</div>
          </a-tooltip>
        </div>
        <p>
          <tooltip-cell v-if="resource.type" :title="resource.type"></tooltip-cell>
        </p>
        <p>
          <tooltip-cell :title="(resource.lastTimePrefix || '更新时间：') + resource.lastTime"></tooltip-cell>
        </p>
      </template>
      <a-avatar
        slot="avatar"
        :icon="resource.resourceTypeId?'':resource.icon"
        :style="{background: resource.avatarColor?resource.avatarColor: '#3e86f1'}"
        :src="resource.src"
        :size="60"
        @click="$emit('on-img-click', item)"
      >
        <icon-font
          :type="'iconresource'+resource.resourceTypeId"
          style="font-size:30px;line-height:62px;"
        ></icon-font>
      </a-avatar>
    </a-card-meta>
  </a-card>
</template>
<script>
import TooltipCell from './TooltipCell'
export default {
  name: 'CardListItem',
  components: {
    TooltipCell
  },
  props: {
    // 展现的基础形式{name, type, lastTime, icon, subscript{title, backgroundColor, color, tip}}
    resource: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 活动按钮
    actions: {
      type: Array,
      default: () => {
        return []
      }
    },
    hoverable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCardClick () {
      this.$emit('on-card-click', this.resource)
    },
    handleAction (action) {
      this.$emit('on-card-action', action, this.resource)
    }
  }
}
</script>
<style lang="less" scoped>
.meta-title {
  margin-bottom: 0;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.superscript {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 60px;
  height: 60px;
  overflow: hidden;
  .triangle {
    width: 0;
    height: 0;
    border-top: 60px solid;
    border-left: 60px solid transparent;
  }
  .desc {
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 1;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -o-transform: rotate(45deg);
  }
}
.resource-card {
  .ant-card-meta-title {
    margin-bottom: 13px !important;
  }
  .ant-card-meta-description {
    p {
      margin-bottom: 13px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    p:last-of-type {
      margin: 0;
    }
  }
  .ant-card-actions > li {
    margin: 9px 0;
    span {
      display: block;
    }
  }
  .ant-avatar-icon {
    font-size: 40px !important;
  }
}
</style>
