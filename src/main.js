import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import  * as echarts  from "echarts";
import {post, get} from './util/require'
import router from './router'
import moment from 'moment'
import less from 'less'
import '@/style/index.css'
import '@/style/indextool.less'
import '@/style/mobile.less'
import Bus from '@/util/bus'
import '@/style/index.css'


Vue.use(less)
Vue.use(Bus);
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment
Vue.prototype.$post = post
Vue.prototype.$get = get

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
