<template>
  <div>
    <el-scrollbar style="height:calc(100vh - 64px)">
      <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
        <el-menu :collapse="isCollapse"
                 :collapse-transition="true"
                 :default-active="active"
                 :background-color="'#191a23'"
                 :active-text-color="'#1888f1'"
                 :text-color="'#fff'"
                 class="el-menu-vertical"
                 unique-opened
                 @select="selectMenuItem">
          <template v-for="item in asyncRouters[0].children">
            <aside-component v-if="!item.hidden"
                             :key="item.name"
                             :router-info="item" />
          </template>
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AsideComponent from '@/view/layout/aside/asideComponent'
export default {
  name: 'Aside',
  components: {
    AsideComponent
  },
  data () {
    return {
      active: '',
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters(['asyncRouters']),
  },
  watch: {
    $route () {
      this.active = this.$route.name
    }
  },
  created () {
    this.active = this.$route.name
    const screenWidth = document.body.clientWidth
    if (screenWidth < 1000) {
      this.isCollapse = !this.isCollapse
    }
    this.bus.$on('collapse', item => {
      this.isCollapse = item
    })
  },
  beforeDestroy () {
    this.bus.$off('collapse')
  },
  methods: {
    selectMenuItem (index, _, ele) {
      console.log(index, _, ele, 123);
      const query = {}
      const params = {}
      ele.route.parameters &&
        ele.route.parameters.map(item => {
          if (item.type === 'query') {
            query[item.key] = item.value
          } else {
            params[item.key] = item.value
          }
        })
      if (index === this.$route.name) return
      if (index.indexOf('http://') > -1 || index.indexOf('https://') > -1) {
        window.open(index)
      } else {
        this.$router.push({ name: index, query, params })
      }
    }
  },
}
</script>

<style lang="less">
// .el-menu {
//   border-right: 0;
// }
// .el-menu-vertical:not(.el-menu--collapse) {
//   width: 220px;
// }
.el-scrollbar {
  .el-scrollbar__view {
    height: 100%;
  }
}
</style>