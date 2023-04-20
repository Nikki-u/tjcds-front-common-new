<template>
  <div>
    <a-skeleton v-if="loading" />
    <div v-else>
      <div class="step-div">
        <span class="span-div">资源类型:</span>
        <a-radio-group
          buttonStyle="solid"
          @change="changeResType"
        >
          <a-radio-button
            style="margin-right:auto 2px"
            class="ant-tag ant-tag-checkable"
            v-for="(type, index) in resType"
            :key="index"
            :value="type.id"
          >
            {{ type.name }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="step-div" v-if="childResData&&childResData.length>0">
        <span class="span-div">资源项:</span>
        <a-radio-group
          buttonStyle="solid"
          @change="changeChildType"
        >
          <a-radio-button
            class="ant-tag ant-tag-checkable"
            v-for="(res, index) in childResData"
            :key="index"
            :value="res.id"
          >
            {{ res.name }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class="step-div" v-if="resTableData&&resTableData.length>0">
        <span class="span-div">资源:</span>
        <a-radio-group
          buttonStyle="solid"
          v-model="defaultType"
          @change="changeTable"
        >
          <a-radio
            class="ant-tag ant-tag-checkable"
            v-for="(table, index) in resTableData"
            :key="index"
            :value="table.id"
          >
            {{ table.tableDesc }}
          </a-radio>
        </a-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
import resourceServer from '../mixins/resourceServer'
export default {
  name: 'StepType',
  data () {
    return {
      loading: false,
      resType: [],
      allResData: [],
      childResData: [],
      resTableData: [],
      defaultType: null
    }
  },
  mixins: [resourceServer],
  methods: {
    // 资源类型的选中事件
    changeResType (e) {
      const typeId = e.target.value
      this.childResData = []
      let chooseResType = []
      chooseResType = this.resType.filter(res => {
        return res.id === typeId
      })
      // 需求变更：港口资源新增里-港口基础信息里-删除企业信息
      this.childResData = chooseResType[0].childTypeList.filter(res => {
        if (res.name !== '港口企业' && res.name !== '港口' && res.name !== '港区') {
          return res
        }
      })
    },
    // 资源的选中事件
    changeChildType (e) {
      const typeChildId = e.target.value
      this.resTableData = []
      const chooseChildResData = this.childResData.filter(childRes => {
        return childRes.id === typeChildId
      })
      this.resTableData = chooseChildResData[0].resTableList
      this.defaultType = this.resTableData[0].id
      this.$emit('on-change', this.defaultType)
    },
    // 资源表选中事件
    changeTable (e) {
      const tableId = e.target.value
      this.$emit('on-change', tableId)
    }
  },
  created () {
    this.loading = true
    this.getResTypes().then(types => (
      this.resType = types
    )).finally(() => (this.loading = false))
    this.getResConfigs().then(resConfigs => (this.allResData = resConfigs))
  }
}
</script>

<style lang="less" scoped>
.step-div {
  text-align: left;
  background-color: #fff;
  margin: 0 auto;
  line-height: 50px;
  font-size: 0;
  .ant-tag {
    font-size: 14px;
    margin: 20px;
  }
  .ant-radio-group {
    width: 90%;
  }
  .ant-radio-button-wrapper {
    border-radius: 4px !important;
  }
}
.span-div {
  width: 10%;
  display: inline-block;
  text-align: right;
  font-size: 14px;
  line-height: 64px;
  vertical-align: top;
}
</style>
