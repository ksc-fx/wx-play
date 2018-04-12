import getList from '../../server/getList';
// import getList from '../../server/getListLocal';
const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.src = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    currentTab: 'recommend',
    // 当前播放的tab
    currentTabPlay: 'recommend',
    // 当前播放tab的item
    currentKey: 0,
    tabData: {
      recommend: {
        // 请求数据使用
        rating: '',
        page: 1,
        limit: 20,
        value: '推荐',
        // 当前是否loading
        loading: true,
        // 能否上拉加载
        canGetMore: true,
        getMoveText: '努力加载中...',
        // 滚动到相关位置
        toView: '0',
        // 数据
        data: []
      },
      children: {
        rating: 1,
        value: '儿童',
        loading: true,
        page: 1,
        limit: 20,
        canGetMore: true,
        getMoveText: '努力加载中...',
        toView: '0',
        data: []
      },
      adult: {
        rating: 3,
        value: '成人',
        loading: true,
        page: 1,
        limit: 20,
        canGetMore: true,
        getMoveText: '努力加载中...',
        toView: '0',
        data: []
      },
      all: {
        rating: 2,
        value: '大众',
        loading: true,
        page: 1,
        limit: 20,
        canGetMore: true,
        getMoveText: '努力加载中...',
        toView: '0',
        data: []
      }
    }
  },
  //事件处理函数
  // 下面列表切换时触发
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.currentItemId });
    this.initData();
    this.initToview();
  },
  // tab切换
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      });
    }
  },
  /**
* 初始化scroll中item位置
*/
  initData: function () {
    const data = this.data;
    const tabData = data.tabData;
    let currentTab = data.currentTab;
    let currentKey = data.currentKey;
    if (tabData[currentTab].data.length <= 0) {
      this.getListData();
    }
  },
  /**
  * 初始化scroll中item位置
  */
  initToview: function () {
    const data = this.data;
    const tabData = data.tabData;
    let currentTab = data.currentTab;
    let currentKey = data.currentKey;
    tabData[currentTab].toView = 0;
    this.setData({ tabData });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getListData();
    innerAudioContext.onPlay(() => {
      this.setData({ isPlay: true });
      console.log('开始播放');
    });
    innerAudioContext.onPause(() => {
      this.setData({ isPlay: false });
      console.log('播放onPause');
    });
    innerAudioContext.onStop(() => {
      this.setData({ isPlay: false });
      console.log('播放onStop');
    });
    innerAudioContext.onEnded(() => {
      console.log('自然播放完成onEnded');
      const currentKey = this.data.currentKey + 1;
      this.setData({ currentKey: currentKey });
      this.playAudio();
    });
    innerAudioContext.onError((res) => {
      console.log(res)
    })
  },
  /**
   * 请求数据
   */
  playAudio: function (event) {
    const data = this.data;
    const tabData = data.tabData;
    let currentTabPlay = data.currentTabPlay;
    let currentKey = data.currentKey;
    console.log(event);
    let isButton = '';
    // 点击事件执行
    if (event) {
      if (event.currentTarget.dataset.key || event.currentTarget.dataset.key === 0) {
        currentKey = event.currentTarget.dataset.key
      }

      isButton = event.currentTarget.dataset.but;
      // 点击播放获取当前选中的currentTab,&& 不是点击播放标志
      if (!isButton) {
        currentTabPlay = data.currentTab;
        this.setData({ currentTabPlay });
      }
    }
    else {
      let isButton = false;
    }

    // 设置当前播放的currentKey
    // 设置试图滚动的位置
    // 播放按钮不改变滚动位置
    this.setData({ currentKey });
    if (!isButton) {
      tabData[currentTabPlay].toView = currentKey;
      this.setData({ tabData });
    }


    let isPaused = innerAudioContext.paused;
    let src = innerAudioContext.src;
    let url = '';
    // 是否有有效地址
    if (tabData[currentTabPlay].data[currentKey]) {
      url = tabData[currentTabPlay].data[currentKey].url;
    }
    else {
      this.lower();
      console.log('没有要播放的音频源');
    }

    // 没有有效url，或者点击其他播放新的。赋值新的
    if ((!src || !isButton) && url) {
      innerAudioContext.src = url;
    }
    // 点击按钮就暂停播放
    if (url) {
      if (isButton && !isPaused) {
        innerAudioContext.pause();
      }
      else {
        innerAudioContext.play();
      }
    }

  },

  /**
   * 请求数据
   */
  getListData: function () {
    const data = this.data;
    const tabData = data.tabData;
    const currentTab = data.currentTab;
    const options = {
      data: {
        appid: 'wxgzh',
        accesstoken: '2539157989BA06A56A6CD309E6EAB69D9BC6BC91',
        rating: tabData[currentTab].rating,
        page: tabData[currentTab].page,
        limit: tabData[currentTab].limit,
      }
    }
    getList(options).then(data => {
      tabData[currentTab].loading = false;
      tabData[currentTab].data = tabData[currentTab].data.concat(data.data.joke);
      tabData[currentTab].canGetMore = true;
      if (data.data.joke.length <= 0) {
        tabData[currentTab].canGetMore = false;
        tabData[currentTab].getMoveText = '已经加载完了';
      }
      this.setData({ tabData: tabData });
    }).catch(error => {
      console.log('error', data);
    });
  },

  /**
 * 滚动
 */
  scroll: function (e) {
  },
  /**
   * 下拉刷新
   */
  upper: function () {
  },
  /**
   * 上拉加载
   */
  lower: function () {
    const data = this.data;
    const tabData = data.tabData;
    const currentTab = data.currentTab;

    if (tabData[currentTab].canGetMore) {
      tabData[currentTab].page++;
      tabData[currentTab].canGetMore = false;
      this.setData({ tabData: tabData });
      this.getListData();
    }
    else {
      console.log('不能加载更多');
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})