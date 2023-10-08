<template>
  <div class="illustrate">
    <div class="til">产品介绍及说明：</div>
    <div class="text">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      广场舞定向降噪广播是一款高科技新型产品,可以有效降低使用音响对周边噪音影响，让大家在轻松尽情的舞蹈。<br />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用者只需要提前准备好MP3内容的U盘，插上二维码下方的USB接口,选择内容列表的音乐内容，点击播放按钮即可播放。
    </div>
  </div>
  <div class="home">
    <van-nav-bar title="音乐列表" />

    <div class="Upan">
      <div class="name">U盘内容列表</div>
      <div class="id">设备ID号：{{ currentRoute }}</div>
    </div>
    <van-list
      v-if="asUpan"
      :finished="finished"
      :finished-text="finishedText"
      class="list"
      @load="onLoad"
    >
      <van-checkbox-group v-model="play.musicIndex">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in list"
            :key="index"
            class="cell"
            clickable
            :title="item"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox ref="checkboxes" :name="index" @click.stop="toggle(index)" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-list>
    <div v-else class="upan">请插入U盘</div>
    <div class="foot">
      <div class="box">
        <div v-if="show === 'play'" @click="palyList()">
          <img src="@/assets/playicon.png" />
        </div>
        <div v-if="show === 'pause'" @click="pauseList()">
          <img src="@/assets/pauseicon.png" />
        </div>
        <div @click="preList()"><img src="@/assets/previous.png" /></div>
        <div @click="nextList()"><img src="@/assets/next.png" /></div>
        <div @click="stopList()"><img src="@/assets/stopicon.png" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
// import { useRoute } from 'vue-router'
import HomeServe from '@/api/list'
const checkboxes = ref(null)

const from = reactive({
  page: 1,
  pageSize: 50,
  result: []
})
const show = ref('play')
// const route = useRoute()

// const currentRoute = route.params.id
const currentRoute = '845DD7E33D4E' // sn码,暂时写死
console.log(currentRoute)
const state = reactive({
  // list: [],
  // 下拉刷新
  result: [],
  pullRefreshLoading: false,
  // 上滑加载
  loading: false,
  finishedText: '加载中...',
  finished: false,
  params: { ...from }
})
onMounted(() => {
  isUstatus()
})

function utf8ToBase64(str) {
  const encoder = new TextEncoder('utf-8')
  const data = encoder.encode(str)
  const base64 = btoa(String.fromCharCode.apply(null, data))
  return base64
}

// 获取音乐
const list = ref([])
const get = reactive({
  val: { msgType: 'getfiles' }
})
function getList() {
  const getData = btoa(JSON.stringify(get.val))
  HomeServe.getMusicList({ cmd: getData, sn: '845DD7E33D4E', auth: 'qweqwe' }).then(res => {
    if (res.code === 200) {
      list.value = res.data
    }
  })
}

// 播放音乐
// 参数
const play = reactive({
  val: { msgType: 'play', playlist: [] },
  musicIndex: []
})
// 点击checkbox筛选出歌曲
function toggle(index) {
  checkboxes.value[index].toggle()
  play.val.playlist = play.musicIndex.map(index => list.value[index])
  console.log(play.musicIndex.map(index => list.value[index]))
}

function palyList() {
  show.value = 'pause'
  const playData = btoa(unescape(encodeURIComponent(JSON.stringify(play.val))))
  HomeServe.playMusicList({ cmd: playData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200) {
      console.log('播放成功')
    }
  })
}

// 暂停音乐
const pause = reactive({
  val: { msgType: 'pause' }
})
function pauseList() {
  show.value = 'play'
  const pauseData = btoa(unescape(encodeURIComponent(JSON.stringify(pause.val))))
  HomeServe.pauseMusicList({ cmd: pauseData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200) {
      console.log('暂停成功')
    }
  })
}

// 停止播放
const stop = reactive({
  val: { msgType: 'stop' }
})
function stopList() {
  show.value = 'play'
  const stopData = btoa(unescape(encodeURIComponent(JSON.stringify(stop.val))))
  HomeServe.stopMusicList({ cmd: stopData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200) {
      console.log('停止成功')
    }
  })
}

// 上一首音乐
const pre = reactive({
  val: { msgType: 'pre' }
})
function preList() {
  const preData = btoa(unescape(encodeURIComponent(JSON.stringify(pre.val))))
  HomeServe.preMusicList({ cmd: preData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200) {
      console.log('上一首')
    }
  })
}

// 下一首音乐
const next = reactive({
  val: { msgType: 'next' }
})
function nextList() {
  const nextData = btoa(unescape(encodeURIComponent(JSON.stringify(next.val))))
  HomeServe.nextMusicList({ cmd: nextData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200) {
      console.log('下一首')
    }
  })
}

// 查是否插入U盘
const asUpan = ref(false)
const ustatus = reactive({
  val: { msgType: 'ustatus' }
})
function isUstatus() {
  const ustatusData = btoa(unescape(encodeURIComponent(JSON.stringify(ustatus.val))))
  HomeServe.isUstatus({ cmd: ustatusData, sn: '845DD7E33D4E', auth: 'abc' }).then(res => {
    if (res.code === 200 && res.data === 'EXISITS') {
      asUpan.value = true
      getList()
    }
  })
}

const { finishedText, finished } = toRefs(state)
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
}

.list {
  // height: 67.5vh;
}
.upan {
  margin: 50px auto 0;
  font-size: 20px;
  font-weight: 500;
}
.van-nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.cell {
  text-align: left;
}

.illustrate {
  background-color: #fff;
  padding: 5px;
  border-bottom: 1px solid rgb(231, 228, 228);

  .til {
    font-size: 17px;
    font-weight: 500;
    margin: 46px 0 10px 0;
    text-align: left;
  }

  .text {
    line-height: 23px;
    text-align: left;
  }
}
.Upan {
  // width: (100vw-20px);
  height: 50px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    padding: 0 10px;
  }
  .id {
    padding: 0 10px;
  }
}

.foot {
  width: 100vw;
  height: 20vw;
  position: fixed;
  background-color: #fff;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;

  .box {
    display: flex;
    justify-content: center;
    align-items: center;

    div {
      flex: 1;
      height: 20vw;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 13vw;
        height: 13vw;
      }
    }
  }
}
</style>
