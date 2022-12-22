import axios from 'axios' // 引入axios
import { Message } from 'element-ui'
import Router from '@/router/index'


// import { store } from '@/store'
import { basePath } from './base.js'
// import { MessageBox } from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
const service = axios.create({
  baseURL: basePath,
  timeout: 99999,
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // const token = localStorage.getItem("token");
    // //store.state.token
    // // const user = store.getters['user/userInfo']
    // config.data = JSON.stringify(config.data)
    // //判断请求的类型
    // //如果是post请求就把默认参数拼到data里面
    // //如果是get请求就拼到params里面
    // if (config.method === 'post') {
    //   console.log(config,'config.method')
    //   let data={}
    //   if(config.data){
    //      data =JSON.parse(config.data)
    //   }
    //   config.data = qs.stringify({
    //     token: token,
    //     ...data
    //   })
    // } else if(config.method === 'get') {
    //   console.log(config.method,'config2.method')
    //   config.params = {
    //     token: token,
    //     ...data
    //   }
    // }
    return config
  },
  error => {
    Message({
      showClose: true,
      message: error,
      type: 'error'
    })
    return error
  }
)
const post = function (url,params,config) {
  // const token = store.getters['token']
  // const token = localStorage.getItem("token");

  // console.log(token);
  // const data = {...params,token:token}
  const data = {...params}
  return new Promise(( resolve,reject )=>{
    service({
      method: 'post',
      // url: '/apis' + url,
      url: url,
      data: data,
      ...config
    }).then((res)=>{
      console.log(res,'post');
      if (res.data.code == 200) {
        if (res.data.msg == '尚未登录，请先登录') {
          console.log(12312123123);
          Router.push({
            name: 'Login'
          })
        }
        resolve(res.data)
      } else {
        console.log(res,'error')
        this.$message({
          message: res.data.msg,
          type: "error",
        });
        reject(res)
      }
    })
  })
}
const get = function (url,params) {
  // const token = store.getters['token']
  const token = localStorage.getItem("token");

  // console.log(token);
  const data = {...params,token:token}
  return new Promise(( resolve,reject )=>{
    service({
      method: 'get',
      // url: '/apis' + url,
      url: url,
      params: data,
      transformRequest: [
        function (data) {
          let ret = ''
          for (let it in data) {
            // 防止数据为 null 时，转换成字符串 'null' 传给后端导致报错
            ret += encodeURIComponent(it) + '=' + (data[it] !== null ? encodeURIComponent(data[it]) : '') + '&'
          }
          ret = ret.substring(0, ret.lastIndexOf('&'))
          return ret
        }
      ]
    }).then((res)=>{
      console.log(res,'get');
      if (res.data.code == 200) {
        if (res.data.msg == '尚未登录，请先登录') {
          console.log(12312123123);
          Router.push({
            name: 'Login'
          })
        } else {
          resolve(res.data.data)
        }
      }else if(res.status == 200) {
        resolve(res)
      }else {
        console.log(res,'error')
        this.$message({
          message: res.data.msg,
          type: "error",
        });
        reject(res)
      }
    })
  })
}
export {post, get}
