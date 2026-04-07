import { Component, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import './app.scss';

// 初始化 pxtransform，设置 html 的 font-size
// H5 转换规则: font-size = (屏幕宽度 / designWidth) × baseFontSize
// 375px 屏幕 → (375/750) × 75 = 37.5px
// CSS 中 32px → 32/75 ≈ 0.427rem → 实际 16px (正常的移动端字体)
Taro.initPxTransform({
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  baseFontSize: 75  // 让 1rem ≈ 屏幕宽度/20，标准移动端适配
});

interface AppProps {
  children?: ReactNode;
}

class App extends Component<AppProps> {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;