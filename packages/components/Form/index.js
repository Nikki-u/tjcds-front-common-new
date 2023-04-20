import FormList from './List/FormList.vue'
import FormFilter from './Filter/FormFilter.vue'
import FormEditor from './Editor/FormEditor.vue'
import FileUpload from './Field/FileUpload.vue'
FormList.install = function (Vue) {
  Vue.component(FormList.name, FormList)
}
FormFilter.install = function (Vue) {
  Vue.component(FormFilter.name, FormFilter)
}
FormEditor.install = function (Vue) {
  Vue.component(FormEditor.name, FormEditor)
}
FileUpload.install = function (Vue) {
  Vue.component(FileUpload.name, FileUpload)
}
export {
  FormList,
  FormFilter,
  FormEditor,
  FileUpload
}
