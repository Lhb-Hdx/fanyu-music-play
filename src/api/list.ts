import type { AxiosResponse } from 'axios'
import request from '@/utils/request'

/**
 * 首页接口
 */
class HomeServe {
  /**
   * 获取列表
   */
  getList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/list`,
      method: 'get',
      params
    })
  }
  // 获取音乐列表
  getMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/getfiles`,
      method: 'get',
      params
    })
  }
  // 播放音乐
  playMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/play`,
      method: 'get',
      params
    })
  }
  // 暂停
  pauseMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/CommCmd11`,
      method: 'get',
      params
    })
  }
  // 停止
  stopMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/CommCmd11`,
      method: 'get',
      params
    })
  }
  // 上一首
  preMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/CommCmd11`,
      method: 'get',
      params
    })
  }
  // 下一首
  nextMusicList<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/CommCmd11`,
      method: 'get',
      params
    })
  }
  // 是否插入U盘
  isUstatus<T = any>(params = {}): Promise<AxiosResponse<T>> {
    return request({
      url: `/deviceControlapi/CommCmd11`,
      method: 'get',
      params
    })
  }
}

export default new HomeServe()
