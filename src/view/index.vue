<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">
            <a href="javascript:void(0)" v-on:click="master()">
              <img src="../assets/image/logo.png" height="64px"/>
            </a>
          </div>
          <div style="line-height: 64px;float: left;margin-left: 10px">
            <strong style="font-family: PingFang SC;color: white;line-height: 64px;font-size: 24px">图像搜索后台管理系统</strong>
          </div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon :title="title" :type="icon" size="19"></Icon>{{ username }} &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ios-clock-outline"></Icon>{{ currentTime }}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown>
                <a href="javascript:void(0)">
                  <Avatar shape="square" icon="person"/>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>个人中心</DropdownItem>
                  <DropdownItem>我的订单</DropdownItem>
                  <DropdownItem>修改密码</DropdownItem>
                  <DropdownItem>帮助中心</DropdownItem>
                  <DropdownItem divided v-on:click.native="logout()">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
            <Submenu v-if="rule.path === '' || !rule === {}" v-for="rule in rules" :name="rule.id" v-bind:key="rule.id">
              <template slot="title">
                <Icon :type="rule.icon"></Icon>
                {{ rule.name }}
              </template>
              <router-link v-for="childPath in rule.childPaths" :to="childPath.path" :key="childPath.id">
                <MenuItem class="layout-menu" :name="childPath.id" :key="childPath.id"> {{ childPath.name }}</MenuItem>
              </router-link>
            </Submenu>
            <router-link v-if="rule.path" v-for="rule in rules" :key="rule.id" :to="rule.path">
              <MenuItem class="layout-menu" :name="rule.id" :key="rule.id">
                <Icon :type="rule.icon"></Icon>
                {{ rule.name }}
              </MenuItem>
            </router-link>
          </Menu>
        </Sider>
        <router-view></router-view>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { formatDate } from '../utils/dateUtil.js'
import axios from 'axios'

export default {
  name: 'index',
  data () {
    return {
      rules: [],
      currentTime: '',
      icon: 'ios-sunny-outline',
      title: ''
    }
  },
  watch: {
  },
  computed: {
    username () {
      const user = window.sessionStorage.getItem('token')
      if (!user) return ''
      let hours = new Date().getHours()
      if (hours > 6 && hours <= 9) {
        hours = '早上好'
      } else if (hours >= 9 && hours < 12) {
        hours = '上午好'
      } else if (hours >= 12 && hours < 14) {
        hours = '中午好'
      } else if (hours >= 14 && hours < 18) {
        hours = '下午好'
      } else if (hours >= 18 && hours < 24) {
        hours = '晚上好'
      } else {
        hours = '凌晨好'
      }
      return hours + '，' + user.split('_')[0]
    }
  },
  mounted () {
    this.rules = JSON.parse(window.sessionStorage.getItem('rules'))
    this.refreshTime()
    let weather = window.localStorage.getItem('weather')
    if (weather == null || weather === 'null' || weather.split('_')[0] !== formatDate(new Date(), 'yy-MM-dd')) {
      axios.get('/weather2/open/api/weather/json.shtml?city=北京')
        .then(response => {
          window.localStorage.setItem('weather', formatDate(new Date(), 'yy-MM-dd') + '_' + JSON.stringify(response.data))
          this.showWeather(response.data)
        })
        .catch(reason => {
          this.$Notice.error({
            duration: 15,
            title: '错误提示',
            desc: '请求天气服务异常，原因：没有后台，浏览器阻止跨域请求。'
          })
        })
    } else {
      const data = JSON.parse(weather.split('_')[1])
      this.showWeather(data)
    }
  },
  methods: {
    showWeather (data) {
      this.title = data.data.forecast[0].notice
      let icon = data.data.forecast[0].type
      if (icon === '雷阵雨') {
        this.icon = 'ios-thunderstorm-outline'
      } else if (icon === '阴') {
        this.icon = 'ios-cloudy-outline'
      } else if (icon === '小雨' || icon === '大雨' || icon === '中雨') {
        this.icon = 'ios-rainy-outline'
      } else if (icon === '多云') {
        this.icon = 'ios-partlysunny-outline'
      }
      let showWeather = window.sessionStorage.getItem('showWeather')
      if (showWeather === 'null' || showWeather == null) {
        const todayWeather = data.data.forecast[0]
        this.$Notice.open({
          duration: 30,
          title: '天气提醒',
          desc: '今天是' + formatDate(new Date(), 'yyyy年MM月') + todayWeather.date + '，北京今日' +
          todayWeather.type + '，今日温度' + todayWeather.high + todayWeather.low + '，今日' + todayWeather.fx + todayWeather.fl + '，' + todayWeather.notice + '。'
        })
        window.sessionStorage.setItem('showWeather', false)
      }
    },
    master () {
      this.$router.push({
        name: 'main'
      })
    },
    refreshTime () {
      this.currentTime = formatDate(new Date(), 'yy-MM-dd hh:mm:ss')
      setInterval(() => {
        this.currentTime = formatDate(new Date(), 'yy-MM-dd hh:mm:ss')
      }, 990)
    },
    logout () {
      window.sessionStorage.setItem('token', null)
      window.sessionStorage.setItem('rules', null)
      window.sessionStorage.setItem('showWeather', null)
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background:#FFFFFF;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    height: 100%;
    float: left;
    position: relative;
    line-height: 64px;
  }
  .layout-nav{
    width: 480px;
    margin: auto;
    margin-right: -150px;
  }
  .layout-menu {
    color: #495060;
  }
</style>
