import Vue from 'vue';
import upload from './upload.vue';
import search from './search.vue';
Vue.component(upload.name, upload);
Vue.component(search.name, search);
export default {
  upload,
  search,
}
