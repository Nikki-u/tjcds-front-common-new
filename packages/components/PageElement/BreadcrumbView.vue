<template>
  <div class="page-header">
    <a-row class="page-header-index-wide">
      <a-col
        :xs="24"
        :sm="24"
        :lg="20"
      >
        <!-- 面包屑展示 -->
        <a-breadcrumb v-if="routes && routes.length !== 0">
          <a-breadcrumb-item
            v-for="(route, index) in routes"
            :key="route.name"
          >
            <router-link
              v-if="index !== (routes.length - 1)"
              :to="{ path: route.path === '' ? '/' : route.path }"
            >
              <span v-if="index===0"><a-icon type="home" /></span>
              <span v-else>{{ route.meta.title }}</span>
            </router-link>
            <span v-else>
              <span v-if="index===0"><a-icon type="home" /></span>
              <span v-else>{{ route.meta.title }}</span>
            </span>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <a-row class="detail">
          <a-col :span="24">
            <!-- 标题 -->
            <span class="title">{{ routeTitle }}<span v-if="extraTitle">【{{ extraTitle }}】</span></span>
            <!-- 提示标签 -->
            <span class="tag-group">
              <a-button
                v-for="(tag, index) in tags"
                size="small"
                class="page-header-tag"
                :style="{backgroundColor: tag.color}"
                :key="index"
              >{{ tag.title }}</a-button>
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <!-- tab的展示形式 -->
            <template v-if="type === 'tab'">
              <a-tabs
                @change="handleTabChange"
                :activeKey="tabActiveKey"
              >
                <a-tab-pane
                  v-for="href in hrefs"
                  :key="href.routerName"
                  v-if="!href.hidden||(tabActiveKey===href.routerName)"
                >
                  <span
                    slot="tab"
                  >
                    <a-icon v-if="href.icon" :type="href.icon" />
                    {{ href.title }}
                    <a-tag v-if="href.tag" :color="href.tag.color" >{{ href.tag.title }}</a-tag>
                  </span>
                </a-tab-pane>
              </a-tabs>
            </template>
            <!-- 可点跳转菜单的展示形式 -->
            <template v-if="type === 'menu'">
              <a-menu
                mode="horizontal"
                :selectedKeys="selectedKeys"
                @click="handleMenuChange"
              >
                <a-menu-item
                  v-for="href in hrefs"
                  :key="href.routeName"
                >
                  <router-link :to="{ name: href.routeName === '' ? '/' : href.routeName }">
                    <a-icon
                      v-if="href.icon"
                      :type="href.icon"
                    />{{ href.title }}
                  </router-link>
                </a-menu-item>
              </a-menu>
            </template>
            <!-- 文本的展示形式 -->
            <template v-if="type === 'text'">
              <p class="detail_desc">{{ text }}</p>
            </template>
          </a-col>
        </a-row>
      </a-col>
      <a-col
        :xs="0"
        :sm="0"
        :lg="4"
        style="text-align: right; margin-top: -7px;"
      >
        <img
          class="detail-img"
          src="data:image/png;base64,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"
        >
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'BreadcrumbView',
  data () {
    return {
      tabActiveKey: this.activeKey
    }
  },
  props: {
    activeKey: {
      type: String,
      default: null
    },
    // 面包屑路由
    routes: {
      type: Array,
      required: true
    },
    // 扩展的标题
    extraTitle: {
      type: String,
      required: false,
      default: ''
    },
    // tab 标签页，menu 菜单形式，text 文本形式
    type: {
      type: String,
      default: 'text'
    },
    // tab menu时对应的子菜单项 {icon, title, routeName,hidden}
    hrefs: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    // text时展示的文本内容
    text: {
      type: String,
      required: false,
      default: ''
    },
    // title后展示的提示标签 {color, title}
    tags: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    }
  },
  computed: {
    // 获取当前路由
    routeTitle () {
      return this.routes && this.routes.length !== 0 ? this.routes[this.routes.length - 1].meta.title : ''
    },
    // 设置所有菜单默认显示用于构建展示样式
    selectedKeys () {
      const selectedKeys = []
      if (this.hrefs) {
        for (let i = 0; i < this.hrefs.length; i++) {
          selectedKeys.push(i)
        }
      }
      return selectedKeys
    }
  },
  methods: {
    // 响应菜单切换
    handleMenuChange (active) {
      this.$emit('menuChange', active)
    },
    // 响应tab面板的切换
    handleTabChange (activeKey) {
      this.tabActiveKey = activeKey
      this.$emit('tabChange', activeKey)
    }
  },
  watch: {
    activeKey () {
      this.tabActiveKey = this.activeKey
    }
  }
}
</script>

<style lang="less">
.page-header {
  background: #fff;
  padding: 16px 32px 0;

  .ant-breadcrumb {
    margin-bottom: 16px;
  }

  .detail {
    margin-bottom: 16px;
    .title {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .tag-group {
      margin-left: 20px;
      .page-header-tag {
        border: 0;
        color: #ffffff;
        border-radius: 12px;
        margin-right: 16px;
      }
    }
  }
  .ant-menu-horizontal {
    margin-top: -10px;
    border-bottom: none;
    .ant-menu-item {
      padding: 0 25px 0 0;
    }
    .ant-menu-item-selected {
      border-bottom: 2px solid transparent;
    }
    .ant-menu-item-active {
      border-bottom: 2px solid transparent;
    }
  }
  .ant-tabs {
    margin-top: -10px;
    .ant-tabs-bar {
      border-bottom: none;
      margin: 0;
      .ant-tabs-nav-container {
        margin-bottom: 0;
      }
    }
  }
  .detail_desc {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
  .detail-img {
    max-width: 180px;
  }
}
</style>
