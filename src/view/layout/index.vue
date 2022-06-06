<template>
  <el-container class="layout">
    <el-container :class="[isSider?'openside':'hideside',isMobile ? 'mobile': '']">
      <el-row :class="[isShadowBg?'shadowBg':'']" @click.native="changeShadow()" />
      <el-aside
        class="main-cont main-left"
        :width="isCollapse?'auto':'240px'"
      >
        <div class="tilte">
          <img
            class="logoimg"
            :src="imgSrc"
            alt=""
          >
          <p
            v-if="isSider"
            class="tit-text"
          >许可管理系统</p>
        </div>
        <Aside class="aside" />
      </el-aside>
      <el-main class="main-cont main-right">
        <transition
          :duration="{ enter: 800, leave: 100 }"
          mode="out-in"
          name="el-fade-in-linear"
        >
          <div
            :style="{width: `calc(100% - ${isMobile?'0px':isCollapse?'70px':'240px'})`}"
            class="topfix"
          >

            <el-row>
              <el-header
                class="header-cont"
                style="background: #fff;height:65px"
              >
                <el-col :span="2">
                  <div
                    class="menu-total"
                    style="fontSize:25px"
                    @click="totalCollapse"
                  >
                    <i
                      v-if="isCollapse"
                      class="el-icon-s-unfold"
                    />
                    <i
                      v-else
                      class="el-icon-s-fold"
                    />
                  </div>
                </el-col>
                <el-col :span="10">
                  <el-breadcrumb
                    class="breadcrumb"
                    v-if="!isMobile"
                    separator-class="el-icon-arrow-right"
                  >
                    <el-breadcrumb-item
                      v-for="item in matched.slice(1,matched.length)"
                      :key="item.path"
                    >{{ item.meta.title }}</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
                <el-col
                  :span="12"
                  style="text-align:right;height:65px"
                >
                  <el-dropdown>
                    <span
                      class="header-avatar"
                      style="cursor: pointer"
                    >
                      <!-- <CustomPic /> -->
                      <span style="margin-left: 5px">{{ userInfo.nickName }}</span>
                      <i class="el-icon-arrow-down" />
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      class="dropdown-group"
                    >
                      <!-- <el-dropdown-item
                        icon="el-icon-s-custom"
                        @click.native="toPerson"
                      >个人信息</el-dropdown-item> -->
                      <el-dropdown-item
                        icon="el-icon-table-lamp"
                        @click.native="LoginOut"
                      >登 出</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-header>
            </el-row>
            <HistoryComponent />
          </div>
        </transition>
        <!-- <router-view class="viewShow"></router-view>  -->
        <transition
          mode="out-in"
          name="el-fade-in-linear"
        >
          <keep-alive>
            <router-view
              element-loading-text="正在加载中"
              class="admin-box"
            />
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/view/layout/aside'
import HistoryComponent from '@/view/layout/aside/historyComponent/history'
import logoImg from "@/assets/logo.png";
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Aside,
    HistoryComponent
  },
  data () {
    return {
      isCollapse: false,
      isSider: true,
      isMobile: false,
      isShadowBg: false,
      reloadFlag: true,
      loadingFlag: true,
      imgSrc: logoImg
    }
  },
  computed: {
    // title() {
    //   return this.$route.meta.title || '当前页面'
    // },
    ...mapGetters(['userInfo']),
    matched () {
      return this.$route.matched
    }
  },
  mounted () {
    const screenWidth = document.body.clientWidth
    if (screenWidth < 1000) {
      this.isMobile = true
      this.isSider = false
      this.isCollapse = true
    } else if (screenWidth >= 1000 && screenWidth < 1200) {
      this.isMobile = false
      this.isSider = false
      this.isCollapse = true
    } else {
      this.isMobile = false
      this.isSider = true
      this.isCollapse = false
    }
    this.bus.$emit('collapse', this.isCollapse)
    this.bus.$emit('mobile', this.isMobile)
    this.bus.$on('reload', this.reload)
    this.bus.$on('showLoading', () => {
      this.loadingFlag = true
    })
    this.bus.$on('closeLoading', () => {
      this.loadingFlag = false
    })
    window.onresize = () => {
      return (() => {
        const screenWidth = document.body.clientWidth
        if (screenWidth < 1000) {
          this.isMobile = true
          this.isSider = false
          this.isCollapse = true
        } else if (screenWidth >= 1000 && screenWidth < 1200) {
          this.isMobile = false
          this.isSider = false
          this.isCollapse = true
        } else {
          this.isMobile = false
          this.isSider = true
          this.isCollapse = false
        }
        this.bus.$emit('collapse', this.isCollapse)
        this.bus.$emit('mobile', this.isMobile)
      })()
    }
  },
  methods: {
    totalCollapse () {                  
      this.isCollapse = !this.isCollapse
      this.isSider = !this.isCollapse
      this.isShadowBg = !this.isCollapse
      this.bus.$emit('collapse', this.isCollapse)
    },
    LoginOut () {
      // window.sessionStorage.clear()
      // this.$router.push({
      //   name: 'Login'
      // })
    },
    toPerson () {
      this.$router.push({
        name: 'person'
      })
    },
    changeShadow() {
      this.isShadowBg = !this.isShadowBg
      this.isSider = !!this.isCollapse
      this.totalCollapse()
    }
  },
}
</script>

<style lang="less">
.menu-total,
.breadcrumb,
.el-dropdown {
  height: 65px !important;
  line-height: 65px !important;
}
</style>
