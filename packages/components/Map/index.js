import MapContent from './MapContent.vue'
import SpacePicker from './SpacePicker.vue'
MapContent.install = function (Vue) {
  Vue.component(MapContent.name, MapContent)
}
SpacePicker.install = function (Vue) {
  Vue.component(SpacePicker.name, SpacePicker)
}
export {
  MapContent,
  SpacePicker
}
