<template>
  <div id="userLayout">
    <div class="loginform">
      <h2 class="topTitle">易竞运营管理平台</h2>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="rules"
        @keyup.enter.native="submitForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-user"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="lock === 'lock' ? 'password' : 'text'"
            placeholder="请输入密码"
          >
            <i
              slot="suffix"
              :class="'el-input__icon el-icon-' + lock"
              @click="changeLock"
            />
          </el-input>
        </el-form-item>
        <el-form-item style="position: relative" prop="captcha">
         <div style="display:flex;justifyContent: space-between;">
          <el-input
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            style="width: 70%"
          />
          <div class="vPic">
            <img
              v-if="picPath"
              :src="picPath"
              height="30px"
              alt="请输入验证码"
              @click="loginVerify"
            >
          </div>
         </div>
        </el-form-item>
        <div style="textAlign:center;width:100%;marginTop:30px  ">
          <el-button
            type="primary"
            style="width:50%"
            @click="submitForm"
          >登 录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import store from '@/store'
export default {
  name: 'login',
  data () {
    const checkUsername = (rule, value, callback) => {
      if (value.length < 5) {
        return callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value.length < 6) {
        return callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    const checkCaptcha = (rule, value, callback) => {
      if (value.length < 5) {
        return callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      lock: 'lock',
      picPath: '',
      store,
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        captchaId: ''
      },
      rules: {
        username: [{ validator: checkUsername, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }],
        captcha: [{ validator: checkCaptcha, trigger: 'blur' }]
      },
    }
  },
  async created () {
    this.loginVerify()
  },
  methods: {
    ...mapActions('user', ['LoginIn']),
    changeLock () {
      this.lock = this.lock === 'lock' ? 'unlock' : 'lock'
    },
    async loginVerify () {
      this.picPath = ''
      const res = await this.$get('/captcha', {}, { responseType: 'blob' }).then( res => {
        return res.data
      }).catch( err => {
        console.error(err)
      })
      this.picPath = 'http://localhost:8081/apis/captcha'
    },
    async login () {
      return await this.LoginIn(this.loginForm)
    },
    async submitForm () {
      this.$refs.loginForm.validate(async (v) => {
        if (v) {
          var params = new FormData()
          params.append('username',this.loginForm.username)
          params.append('password',this.loginForm.password)

          const res = await this.$post('/login',this.loginForm,
             {
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
              })
          // console.log(res);          // if (res.code == 200) {
          //   this.$message.success('登陆成功')
          //   this.$store.commit('setToken',res.data)
          //   // localStorage.setItem('userName',this.loginForm.username)
          //   this.$router.push({ name: 'workState' })
          // }
          if(res.msg === '登录成功'){
            localStorage.setItem('userName',this.loginForm.username)
            this.$router.push({ name: 'workState' })
          }else {
            this.$message({
              type: 'error',
              message: '请输入正确的验证码',
              showClose: true
            })
            return false
          }
        } else {
          this.$message({
            type: 'error',
            message: '请正确填写登录信息',
            showClose: true
          })
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
#userLayout {
  width: 100%;
  height: 100vh;
  background: url(./img/login2.jpg);
  background-size: cover;
  position: relative;
  .topTitle {
    text-align: center;
    line-height: 60px;
  }
  .loginform {
    position: absolute;
    top: 30vh;
    right: 16vw;
    width: 300px;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 40px 40px 40px 40px;
    border-radius: 10px;
    box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.2);
  }
}
@media (max-width: 750px) {
  #userLayout {
    width: 100%;
    height: 100vh;
    background: url(../../assets/login_background.svg);
    background-size: cover;
    position: relative;
    .topTitle {
      text-align: center;
      line-height: 60px;
    }
    .loginform {
      position: absolute;
      top: 30vh;
      right: 16vw;
      width: 30vw;
      background-color: #fff;
      padding: 40px 40px 40px 40px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>