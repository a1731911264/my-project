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
              <Icon type="ios-navigate"></Icon>
              个人主页
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              我的相册
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              朋友圈
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

export default {
  name: 'index',
  data () {
    return {
      rules: []
    }
  },
  mounted () {
    this.rules = JSON.parse(window.sessionStorage.getItem('rules'))
  },
  methods: {
    master () {
      this.$router.push({
        name: 'main'
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
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-menu {
    color: #495060;
  }
</style>
