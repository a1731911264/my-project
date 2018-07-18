<template>
  <div id="allmap" v-bind:style="mapStyle">
  </div>
</template>

<script>

export default {
  name: 'baidu-map',
  data () {
    return {
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px'
      },
      cityName: '',
      map: {},
      gpsPoint: {},
      baiduPoint: {},
      gpsAddress: ''
    }
  },
  props: {
    // 地图在该视图上的高度
    mapHeight: {
      type: Number,
      default: 450
    },
    // 经度
    longitude: {
      type: String
    },
    // 纬度
    latitude: {
      type: String
    },
    description: {
      type: String,
      default: '天安门'
    }
  },
  mounted () {
    this.initMap()
    // this.initLocation()
  },
  methods: {
    initMap () {
      let map = new BMap.Map('allmap')
      let point = new BMap.Point(this.longitude, this.latitude)
      let marker = new BMap.Marker(point)
      map.addOverlay(marker)
      map.centerAndZoom(point, 15)
      // 信息窗的配置信息
      let opts = {
        width: 250,
        height: 75,
        title: '地址：'
      }
      let infoWindow = new BMap.InfoWindow(this.description, opts)// 创建信息窗口对象
      marker.addEventListener('click', function () {
        map.openInfoWindow(infoWindow, point)
      })
      map.enableScrollWheelZoom(true)
      map.openInfoWindow(infoWindow, point)// 开启信息窗口
    },
    initLocation () {
      // 获取城市名称
      let myCity = new BMap.LocalCity()
      myCity.get(this.getCityByIP)
      // 获取gps坐标
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showMap, this.handleError, { enableHighAccuracy: true, maximumAge: 1000 })
      } else {
        this.$Notice.warning({
          duration: 30,
          title: '地图服务提醒',
          desc: '您的浏览器不支持HTML5获取地理位置服务，推荐适应最新版的获取或者'
        })
      }
    },
    getCityByIP (rs) {
      this.cityName = rs.name
      this.$Message.info(this.cityName)
    },
    showMap (value) {
      // 获取经纬度
      // 创建地图
      this.map = new BMap.Map('allmap')
      // 绘制坐标点
      this.gpsPoint = new BMap.Point(value.coords.longitude, value.coords.longitude)
      // 根据坐标逆解析地址
      // let geoc = new BMap.Geocoder()
      // geoc.getLocation(this.gpsPoint, this.getCityByCoordinate)
      // let s = new BMap.Convertor.translate(this.gpsPoint, 0, this.translateCallback)
      BMap.Convertor.translate(this.gpsPoint, 0, this.translateCallback2)
      let marker = new BMap.Marker(this.gpsPoint)
      this.map.addOverlay(marker)
      this.map.centerAndZoom(this.gpsPoint, 15)
      this.map.enableScrollWheelZoom(true)
    },
    translateCallback2 (point) {
      alert(1)
    },
    translateCallback (point) {
      alert(1)
      this.baiduPoint = point
      this.map.centerAndZoom(this.baiduPoint, 18)
      var geoc = new BMap.Geocoder()
      geoc.getLocation(this.baiduPoint, this.getCityByBaiduCoordinate)
    },
    getCityByCoordinate (rs) {
      this.gpsAddress = rs.addressComponents
      let address = 'GPS标注：' + this.gpsAddress.province + ',' + this.gpsAddress.city + ',' + this.gpsAddress.district + ',' + this.gpsAddress.street + ',' + this.gpsAddress.streetNumber
      let marker = new BMap.Marker(this.gpsPoint)// 创建标注
      this.map.addOverlay(marker)// 将标注添加到地图中
      let labelgps = new BMap.Label(address, { offset: new BMap.Size(20, -10) })
      marker.setLabel(labelgps) // 添加GPS标注
    },
    getCityByBaiduCoordinate (rs) {
      this.baiduAddress = rs.addressComponents
      let address = '百度标注：' + this.baiduAddress.province + ',' + this.baiduAddress.city + ',' + this.baiduAddress.district + ',' + this.baiduAddress.street + ',' + this.baiduAddress.streetNumber
      alert(address)
      let marker = new BMap.Marker(this.baiduPoint)// 创建标注
      this.map.addOverlay(marker) // 将标注添加到地图中
      let labelbaidu = new BMap.Label(address, { offset: new BMap.Size(20, -10) })
      marker.setLabel(labelbaidu)// 添加百度标注
    },
    handleError (value) {
      switch (value.code) {
        case 1:
          this.$Message.error('位置服务被拒绝')
          break
        case 2:
          this.$Message.error('暂时获取不到位置信息')
          break
        case 3:
          this.$Message.error('获取位置信息超时')
          break
        case 4:
          this.$Message.error('位置错误')
          break
        default:
          this.$Message.error('其它未知错误')
      }
    }
  },
  watch: {
    // vue 父组建更改子组件的props时不会使自组建重新走mounted 这个方法，只是改变属性的值， 需要做监听来走某个方法。
    longitude: function (newQuestion, oldQuestion) {
      this.initMap()
    }
  }
}
</script>

<style scoped>

</style>
