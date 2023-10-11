<template>
  <div class="illustrate">
    <div class="img-box"><img src="@/assets/bg-2.png" /></div>
    <div class="word-box">
      <div class="til">产品介绍及说明：</div>
      <div class="text">
        广场舞定向广播音响是一款高科技产品，可以让声音像光一样定向投放，声音只集中在投射区，有效降低声音对周边影响，让使用者轻松尽情的享受舞蹈。<br />
      </div>
      <div class="text">
        使用者只需要提前准备好存有MP3内容的U盘，插入机器下方的USB接口，勾选内容列表的音乐，点击下方播放按钮即可播放。
      </div>
    </div>
  </div>
  <div class="Upan">
    <div class="line">
      <div class="name">U盘内容列表</div>
      <div class="id">设备ID号：{{ SNcode }}</div>
    </div>
  </div>
  <div class="home">
    <van-list v-if="asUpan" :finished="finished" :finished-text="finishedText" class="list">
      <van-checkbox-group v-model="play.musicIndex">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in list"
            :key="index"
            class="cell"
            clickable
            :style="{ color: cellColors[index] }"
            @click="toggle(index)"
          >
            <template #title>
              <span class="spanC" :style="{ color: cellColors[index] }">
                {{ index + 1 < 10 ? '0' : '' }}{{ index + 1 }}
              </span>
              &nbsp;&nbsp;&nbsp;{{ item }}
            </template>
            <template #right-icon>
              <van-checkbox
                ref="checkboxes"
                checked-color="rgb(245,182,25)"
                :name="index"
                @click.stop="toggle(index)"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-list>
    <div v-else class="upan">请插入U盘</div>
    <div class="foot">
      <div class="box">
        <div @click="preList()"><img src="@/assets/previous.png" class="small" /></div>
        <div v-if="show === 'play'" @click="palyList()">
          <img src="@/assets/playicon.png" />
        </div>
        <div v-if="show === 'pause'" @click="pauseList()">
          <img src="@/assets/pauseicon.png" />
        </div>
        <div @click="nextList()"><img src="@/assets/next.png" class="small" /></div>
        <div @click="stopList()"><img src="@/assets/stopicon-2.png" class="mcode" /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
// import { showToast } from 'vant'
import HomeServe from '@/api/list'
const from = reactive({
  page: 1,
  pageSize: 50,
  result: []
})
const show = ref('play')
const route = useRoute()
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

const SNcode = ref('')
onMounted(() => {
  console.log(route.query.id)
  SNcode.value = route.query.id // sn码,暂时写死  // route.query.id  '845DD7E33D4E'
  isUstatus()
})

// 获取音乐
const list = ref([])
const get = reactive({
  val: { msgType: 'getfiles' }
})
function getList() {
  const getData = btoa(JSON.stringify(get.val))
  HomeServe.getMusicList({ cmd: getData, sn: SNcode.value, auth: 'abc' }).then(res => {
    if (res.code === 200) {
      // list.value = res.data.map(item => {
      //   // 替换数字开头的部分为空字符串
      //   return item.replace(/^\d+\s+/, '')
      // })
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
const checkboxes = ref(null)
const cellColors = ref(new Array(list.value.length).fill(''))

// 点击checkbox筛选出歌曲
function toggle(index) {
  checkboxes.value[index].toggle()
  play.val.playlist = play.musicIndex.map(index => list.value[index])
  console.log(play.val.playlist)
}

watch(
  // 修改选中文字
  () => play.musicIndex,
  newIndexes => {
    cellColors.value = list.value.map((_, i) => (newIndexes.includes(i) ? 'rgb(244,179,30)' : ''))
  }
)

function palyList() {
  if (play.val.playlist.length < 1) {
    showToast('请选择需要播放的音乐')
    return
  }
  show.value = 'pause'
  const playData = btoa(unescape(encodeURIComponent(JSON.stringify(play.val))))
  HomeServe.playMusicList({ cmd: playData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  HomeServe.pauseMusicList({ cmd: pauseData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  play.musicIndex = [] // 取消全部的选择
  play.val.playlist = []
  show.value = 'play'
  const stopData = btoa(unescape(encodeURIComponent(JSON.stringify(stop.val))))
  HomeServe.stopMusicList({ cmd: stopData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  HomeServe.preMusicList({ cmd: preData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  HomeServe.nextMusicList({ cmd: nextData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  console.log(SNcode.value)
  const ustatusData = btoa(unescape(encodeURIComponent(JSON.stringify(ustatus.val))))
  HomeServe.isUstatus({ cmd: ustatusData, sn: SNcode.value, auth: 'abc' }).then(res => {
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
  width: 100vw;
  height: 57vh;
  background-color: #fff;
  box-sizing: border-box;
  overflow: auto;
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
  .spanC {
    color: rgb(137, 149, 164);
  }
}
.illustrate {
  width: 100vw;
  height: 28vh;
  background-image: url('@/assets/bg.png');
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-bottom: -15px;
  padding-bottom: 15px;
  .img-box {
    flex: 1;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }
  }
  .word-box {
    text-align: left;
    flex: 2;
    .til {
      padding-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    .text {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      opacity: 0.4;
    }
  }
}
.Upan {
  z-index: 10000;
  height: 7vh;
  background-color: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;

  .line {
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 15px;

    .name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
    .id {
      font-size: 11px;
      font-weight: 400;
      color: #666;
    }
  }
}

.foot {
  width: 100vw;
  height: 8vh;
  position: fixed;
  background-color: #fff;
  bottom: 0;
  left: 0;
  border-top: 1px solid rgb(238, 238, 238);
  z-index: 999;
  .box {
    padding: 0 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    div {
      flex: 1;
      height: 15vw;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 10vw;
        height: 10vw;
      }
      .small {
        width: 5vw;
        height: 5vw;
      }
      .mcode {
        width: 6vw;
        height: 6vw;
      }
    }
  }
}
</style>
