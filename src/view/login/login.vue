<template>
  <div class="login-container">
    <div class="login-background-color">
      <div class="login-form">
        <Form ref="loginForm" :model="loginForm" :rules="formRules">
          <div>
            <div>
              <img src="../../assets/image/logo.png" style="width: 136px"/>
            </div>
            <div>
              <strong>
                <h2 class="login-title">
                  图像搜索后台管理系统
                </h2>
              </strong>
            </div>
          </div>
          <FormItem prop="username">
            <Input type="text" v-model="loginForm.username" placeholder="请输入用户名......"><Icon type="person" slot="prepend"></Icon></Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="loginForm.password" placeholder="请输入密码......"><Icon type="locked" slot="prepend"></Icon></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="login('loginForm')" @keyup.native="handlerLogin" long :loading="loading">
              <span v-show="loading2">登陆</span>
              <span v-show="loading">正在登陆</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        uername: '',
        password: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名...', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码...', trigger: 'blur' },
          { type: 'string', min: 5, message: '密码最少为6位数字、英文字母和特殊符号的组合', trigger: 'blur' }
        ]
      },
      loading: false,
      loading2: true
    }
  },
  mounted () {
    let other = this
    document.onkeydown = function (event) {
      if (event.keyCode === 13) other.login('loginForm')
    }
  },
  destroyed () {
    document.onkeydown = function () {
    }
  },
  methods: {
    login (name) {
      this.$Notice.error({
        title: '账号或密码错误'
      })
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          this.loading2 = false
          setTimeout(() => {
            const rules = [
              {id: 1, name: '图搜管理', icon: 'ios-home', childPaths: [{id: 11, name: '全量分类管理', path: '/picture-search/full-classification-list'}, {id: 12, name: '相似分类管理', path: '/picture-search/similar-classification-list'}, {id: 13, name: '搜图结果管理', path: '/picture-search/picture-search-list'}, {id: 14, name: '反馈意见管理', path: '/picture-search/feedback-list'}], path: ''},
              {id: 2, name: '统计分析', icon: 'ios-pricetag', childPaths: [{id: 21, name: '交易记录', path: '/balance/trade'}, {id: 22, name: '花销分析', path: '/cost-analysis'}], path: ''},
              {id: 3, name: '权限管理', icon: 'ios-paw', childPaths: [], path: '/gift'}
            ]
            sessionStorage.setItem('token', this.loginForm.suername + this.loginForm.password)
            if (this.loginForm.username === 'admin') {
              sessionStorage.setItem('rules', JSON.stringify(rules))
            } else {
              rules[1] = {}
              rules[2] = {}
              sessionStorage.setItem('rules', JSON.stringify(rules))
            }
            this.$router.push({
              name: 'index'
            })
          }, 1000)
        }
      })
    },
    handlerLogin (event) {
      if (event.keyCode === 13) {
        this.login('loginForm')
      }
    }
  }
}
</script>

<style scoped>
  .login-container {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url("../../assets/image/login/login.jpg");
    background-size: cover;
  }
  .login-background-color {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    position: relative;
  }
  .login-form {
    padding: 30px 40px 25px 40px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 1px 1px 2px #eee;
    width: 350px;
    height: 350px;
    position: absolute;
    right: 100px;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
  }
  .login-title {
    margin: 0 0 20px;
    text-align: center;
    color: #409eff;
    letter-spacing: 3px;
    font-family: 'Hiragino Sans GB';
    display: inline-block;
  }
</style>
