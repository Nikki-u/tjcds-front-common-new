import ResourceInsert from './Insert/ResourceInsert.vue'
import ResourceDetail from './Detail/ResourceDetail.vue'
import ResourceList from './List/ResourceList.vue'
import ResourceBuild from './Build/ResourceBuild.vue'
ResourceInsert.install = function (Vue) {
  Vue.component(ResourceInsert.name, ResourceInsert)
}
ResourceDetail.install = function (Vue) {
  Vue.component(ResourceDetail.name, ResourceDetail)
}
ResourceList.install = function (Vue) {
  Vue.component(ResourceList.name, ResourceList)
}
ResourceBuild.install = function (Vue) {
  Vue.component(ResourceBuild.name, ResourceBuild)
}
export { ResourceInsert, ResourceDetail, ResourceList, ResourceBuild }
