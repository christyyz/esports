<template>
  <div>
    <el-tabs type="border-card"
             :closable="!(historys.length===1&&this.$route.name==='workState')"
             v-model="activeValue"
             @tab-click="handleClick"
             @tab-remove="removeTab">
      <el-tab-pane v-for="item in historys"
                   :key="name(item)"
                   :label="item.meta.title"
                   :name="name(item)"
                   :tab="item"
                   class="gva-tab">
        <span slot="label"
              :style="{color: activeValue===name(item)?activeColor:'#333'}"><i class="el-icon-reading"
             :style="{color:activeValue===name(item)?activeColor:'#ddd'}" /> {{ item.meta.title }}</span>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-tabs v-model="activeValue"
             type="card"
             :closable="!(historys.length===1&&this.$route.name===defaultRouter)"
             @tab-click="changeTab"
             @tab-remove="removeTab">
      <el-tab-pane v-for="item in historys"
                   :key="item.meta.title"
                   :label="item.meta.title"
                   :name="item.meta.title"
                   :tab="item.meta.title"
                   class="gva-tab">
        <span slot="label">
          {{item.meta.title}}
        </span>
        <span slot="label"
              :style="{color: activeValue===name(item)?activeColor:'#333'}"><i class="dot"
             :style="{backgroundColor:activeValue===name(item)?activeColor:'#ddd'}" /> {{ item.meta.title }}</span>
      </el-tab-pane>
    </el-tabs> -->
    <!--自定义右键菜单html代码-->
    <!-- <ul v-show="contextMenuVisible"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu">
      <li @click="closeAll">关闭所有</li>
      <li @click="closeLeft">关闭左侧</li>
      <li @click="closeRight">关闭右侧</li>
      <li @click="closeOther">关闭其他</li>
    </ul> -->
  </div>
</template>

<script>
const getFmtString = (item) => {
  return item.name +
    JSON.stringify(item.query) +
    JSON.stringify(item.params)
}
export default {
  name: 'history',
  data () {
    return {
      historys: [],
      activeValue: 'workState',
      contextMenuVisible: false,
      left: '',
      top: '',
      activeColor: '#1890ff',
      defaultRouter: 'workState'
    }
  },
  created () {
    const initHistorys = [
      {
        name: this.defaultRouter,
        meta: {
          title: '工作台'
        },
        query: {},
        params: {}
      }
    ]
    this.historys = JSON.parse(sessionStorage.getItem('historys')) || initHistorys
    console.log();
    if (!window.sessionStorage.getItem('activeValue')) {
      this.activeValue = this.defaultRouter
    } else {
      this.activeValue = window.sessionStorage.getItem('activeValue')
    }
    this.setTab(this.$route)

  },
  watch: {
    $route (to, now) {
      this.setTab(to)
      sessionStorage.setItem('historys', JSON.stringify(this.historys))
      this.activeValue = window.sessionStorage.getItem('activeValue')
      if (now && to && now.name === to.name) {
        this.bus.$emit('reload')
      }
    }
  },
  methods: {
    name (item) {
      return item.name + JSON.stringify(item.query) + JSON.stringify(item.params)
    },
    setTab (route) {
      if (route.name === 'layout') {
        return false
      }
      if (!this.historys.some(item => this.isSame(item, route))) {
        const obj = {}
        obj.name = route.name
        obj.meta = route.meta
        obj.query = route.query
        obj.params = route.params
        this.historys.push(obj)
      }
      window.sessionStorage.setItem(
        'activeValue',
        getFmtString(this.$route)
      )
    },
    isSame (route1, route2) {
      if (route1.name !== route2.name) {
        return false
      }
      for (const key in route1.query) {
        if (route1.query[key] !== route2.query[key]) {
          return false
        }
      }
      for (const key in route1.params) {
        if (route1.params[key] !== route2.params[key]) {
          return false
        }
      }
      return true
    },
    openContextMenu () { },
    handleClick (component) {
      const tab = component.$attrs.tab
      this.$router.push({
        name: tab.name,
        query: tab.query,
        params: tab.params
      })
    },
    removeTab (tab) {
      const index = this.historys.findIndex(
        item => getFmtString(item) === tab
      )
      if (
        getFmtString(this.$route) === tab
      ) {
        if (this.historys.length === 1) {
          this.$router.push({ name: this.defaultRouter })
        } else {
          if (index < this.historys.length - 1) {
            this.$router.push({
              name: this.historys[index + 1].name,
              query: this.historys[index + 1].query,
              params: this.historys[index + 1].params
            })
          } else {
            this.$router.push({
              name: this.historys[index - 1].name,
              query: this.historys[index - 1].query,
              params: this.historys[index - 1].params
            })
          }
        }
      }
      this.historys.splice(index, 1)
    }
  },
}
</script>
<style lang="less">
.el-tabs__header {
  background-color: #fff !important;
}
.el-tabs__content {
  padding: 0 !important;
}
</style>
