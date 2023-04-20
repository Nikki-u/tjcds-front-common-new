import FormatTable from './FormatTable.vue'
import FormTable from './FormTable.vue'
import FuncTable from './FuncTable.vue'
import { VueAxios } from '../../utils/axios'
FormatTable.install = function (Vue) {
  Vue.component(FormatTable.name, FormatTable)
}
FormTable.install = function (Vue) {
  Vue.component(FormTable.name, FormTable)
}
FuncTable.install = function (Vue, axios) {
  Vue.component(FuncTable.name, FuncTable)
  if (axios) {
    Vue.use(VueAxios, axios)
  }
}
export {
  FormatTable,
  FormTable,
  FuncTable
}
