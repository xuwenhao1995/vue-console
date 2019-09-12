//插件模块
import axios from 'axios'

const MyhttpServer = {}

MyhttpServer.install = (Vue) => {

  axios.defaults.baseURL = 'http://192.168.43.186'
  // axios.defaults.baseURL = 'http://192.168.43.103:8080/probe_console'
  axios.defaults.headers.post['Content-Type'] = 'multipart/form-data;application/json;charset=utf-8'
  axios.defaults.withCredentials = true

  axios.interceptors.response.use((response) =>{
    console.log(response)
  })

  // 4. 添加实例方法
  Vue.prototype.$http = function (reurl, data) {
    // baseUrl就是服务器地址
    // const baseUrl = 'http://192.168.43.103:8080/probe_console';
    const baseUrl = this.$store.state.baseUrl;
    let url = baseUrl + reurl;

    // jsonp请求参数和get方法类似，都是params的方式拼接
    for (let item in data) {
      url += `&${item}=${data[item]}`;
    }
    return axios(url);
  };
}

export default MyhttpServer