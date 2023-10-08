import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store'
import router from './index'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  next()

  // 解决 iphone 跳转后页面不能到顶部的问题
  window.scrollTo(0, 0)

  /* 暂时直接跳转到home页，需要登录再放开*/
  // const store = useUserStore()
  // if (!store.isLogin && to.path !== '/login') {
  //   await store.logout()
  //   next({ path: '/login', replace: true })
  // } else {
  //   next()
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
