// ie polyfill
import '@babel/polyfill'
// 引入图片预览组件
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
// 引入高德地图
import VueAmap from 'vue-amap'
import { VueAxios } from './utils/axios'
import { TooltipButton, TooltipButtonGroup } from './components/Button'
import { CountDown } from './components/CountDown'
import { CountTo } from './components/CountTo'
import { FormList, FormFilter, FormEditor, FileUpload } from './components/Form'
import { FormModal } from './components/Modal'
import { FormDrawer } from './components/Drawer'
import { IconPicker, LocationPicker } from './components/Picker'
import { FormatTable, FormTable, FuncTable } from './components/Table'
import { OrgTree } from './components/Tree'
import { BreadcrumbView } from './components/PageElement'
import { CardFilter, CardList } from './components/Card'
import { MapContent, SpacePicker } from './components/Map'
import { ResourceInsert, ResourceDetail, ResourceList, ResourceBuild } from './components/Resource'
import { IconFont } from './components/Icon'
import vuescroll from 'vuescroll'
const components = [
  TooltipButton,
  TooltipButtonGroup,
  CountDown,
  CountTo,
  FormList,
  FormFilter,
  FormEditor,
  FileUpload,
  FormModal,
  FormDrawer,
  IconPicker,
  LocationPicker,
  SpacePicker,
  FormatTable,
  FormTable,
  FuncTable,
  OrgTree,
  BreadcrumbView,
  CardFilter,
  CardList,
  MapContent,
  ResourceInsert,
  ResourceDetail,
  ResourceList,
  ResourceBuild,
  IconFont
]

const Tjcds = {
  install (Vue, options) {
    if (options && options.axios) {
      Vue.use(VueAxios, options.axios)
    } else {
      console.warn('You have to use axios to tjcds-front-common')
    }
    if (options && options.Antd) {
      Vue.use(options.Antd)
    } else {
      import('ant-design-vue').then(moudule => {
        Vue.use(moudule.default)
      })
    }
    Vue.use(VueAmap)
    Vue.use(Viewer)
    Vue.use(vuescroll)
    Object.values(components).forEach(component => {
      Vue.use(component)
    })
  }
}

export default Tjcds

export {
  TooltipButton,
  TooltipButtonGroup,
  CountDown,
  CountTo,
  FormList,
  FormFilter,
  FormEditor,
  FormModal,
  FormDrawer,
  IconPicker,
  LocationPicker,
  SpacePicker,
  FormatTable,
  FormTable,
  FuncTable,
  OrgTree,
  BreadcrumbView,
  CardFilter,
  CardList,
  MapContent,
  ResourceInsert,
  ResourceDetail,
  ResourceList,
  ResourceBuild,
  IconFont
}
