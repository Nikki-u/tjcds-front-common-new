<template>
  <a-card class="map-detail" v-show="visible" :style="{width:'100%' }">
    <a-button
      class="detail-back"
      size="small"
      @click="rebackDetail"
    >
      <a-icon type="arrow-left" />返回
    </a-button>
    <div v-if="$slots.markerDetailSlot" :style="{height:screenHeight-200+'px',width:'100%' }">
      <slot name="markerDetailSlot"></slot>
    </div>
    <section v-else>
      <div class="map-detail-img" v-if="markerDetail.type!=='video'">
        <img :src="markerDetail.imgs?markerDetail.imgs[0]:markerDetail.detaildefaultImg" @click="handleImg" @error="defImg()"/>
        <p><icon-font type="iconpicture" />{{ markerDetail.imgs?markerDetail.imgs.length:0 }}</p>
      </div>
      <div class="map-detail-img" v-else>
        <slot name="detailHeadSlot"></slot>
      </div>
      <div class="map-detail-desc" style="position:relative;">
        <h3>{{ markerDetail.name }}</h3>
        <p v-for="(item,index) in markerDetail.desc" :key="index">
          <template v-for="(itemObj,key,ind) in item">
            <a-icon v-if="key==='icon'" :type="itemObj" :key="ind" />
            <span v-else :key="ind">{{ itemObj }}</span>
          </template >
        </p>
        <a-button type="link" v-if="!markerDetail.disCollect" style="position:absolute;right:0;top:5px;" @click="handlePointCollect"><a-icon type="heart" :theme="collect?'filled':'outlined'" :style="{color:(collect?'red':'default'),marginRight:'0'}"/>{{ collect?'已收藏':'收藏' }}</a-button>
        <tooltip-button-group :actions="markerDetail.extraButtons" v-if="markerDetail.extraButtons" @click="handleBtnClick"></tooltip-button-group>
      </div>
      <vue-scroll :style="{height:screenHeight-400+'px'}" :ops="ops">
        <div class="map-detail-cont" v-if="$slots.detailBodySlot">
          <slot name="detailBodySlot"></slot>
        </div>
        <a-row class="map-detail-cont" v-else>
          <!-- <p v-for="(item,key,index) in markerDetail.details" :key="index">
          <span class="label">{{ key }}:</span><span class="cont">{{ item }}</span>
        </p> -->
          <a-col :span="markerDetail.detailSpan?markerDetail.detailSpan:'12'" v-for="(item,key,index) in markerDetail.details" :key="index">
            <a-tooltip>
              <template slot="title">
                {{ key }}
              </template>
              <span class="label">{{ key }}:</span>
            </a-tooltip>
            <a-tooltip>
              <template slot="title">
                {{ item }}
              </template>
              <span class="cont">{{ item }}</span>
            </a-tooltip>

          </a-col>
          <!-- </div> -->
        </a-row>
      </vue-scroll>
      <a-modal
        title="图片"
        v-model="imgVisible"
        @ok="ok"
      >
        <a-carousel arrows>
          <div
            slot="prevArrow"
            class="custom-slick-arrow"
            style="left: 10px;zIndex: 1"
          >
            <a-icon type="left-circle" />
          </div>
          <div
            slot="nextArrow"
            class="custom-slick-arrow"
            style="right: 10px"
          >
            <a-icon type="right-circle" />
          </div>
          <div v-for="(item,index) in markerDetail.imgs" :key="index"><img :src="item" class="detailImg" @error="defImg()"/></div>
        </a-carousel>
      </a-modal>
    </section>
  </a-card>
</template>

<script>
export default {
  name: 'MapDetail',
  data () {
    return {
      imgVisible: false,
      ops: {
        bar: {
          background: '#c1c1c1',
          size: '6px'
        }
      },
      visible: false
    }
  },
  computed: {
    collect () {
      return this.markerDetail.collect
    }
  },
  props: {
    // 点位详情 （imgs,desc,details）
    markerDetail: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    screenHeight: {
      type: Number,
      default: 0
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleImg () {
      this.imgVisible = true
    },
    ok () {
      this.imgVisible = false
    },
    rebackDetail () {
      this.visible = false
    },
    defImg () {
      const img = event.srcElement
      img.src = this.markerDetail.detaildefaultImg
      img.onerror = null // 防止闪图
    },
    handlePointCollect () {
      this.$emit('on-point-collect', this.markerDetail)
    },
    handleBtnClick (val) {
      this.$emit('on-extBtn-click', val, this.markerDetail)
    }
  },
  watch: {
    value: {
      handler (val) {
        this.visible = val
      },
      immediate: true
    },
    visible (val) {
      this.$emit('input', val)
      this.$emit('on-visible-change', val)
    },
    markerDetail: {
      immediate: true, // 这句重要
      handler (val) {
      }
    }
  },
  mounted () {
  }
}
</script>
<style lang="less">
.map-detail{
    position: absolute!important;
    top: 0;
    .detail-back{
      background: rgba(51, 51, 51, 0.5);
      color: #fff;
      padding: 0 5px;
      position: absolute;
      z-index: 1;
      top: 10px;
      left: 10px;
      border: 0;
      &:hover{
        background: rgba(51, 51, 51, 0.5);
        color: #0e89f5
      }
    }
    .map-detail-img{
        position:relative;
        color:#fff;
        img{
            height:200px;
            width: 100%;
        }
        p{
            position: absolute;
            bottom:0;
            margin: 0;
            left: 10px;
            i{
                margin-right:5px;
                font-size: 20px;
            }
        }
    }
}
.map-detail-desc{
    padding:10px;
    .anticon{
        margin-right:10px;
    }
    p{
        margin:0;
    }
}
.map-detail-cont{
    padding:10px;
    border-top: 10px solid #f5f5f5;
    .ant-col-24{
      .label{
        width:100px;
      }
       .cont{
            vertical-align: middle;
            margin-right:10px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width:auto;
            display:inline-block;
        }
    }
    span{
        margin:0;
        font-size: 12px;
        &.label{
            margin-right:10px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width:70px;
            display:inline-block;
            text-align: right;
            vertical-align: middle;
        }
         &.cont{
            vertical-align: middle;
            margin-right:10px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            width:90px;
            display:inline-block;
        }
    }
}
</style>
