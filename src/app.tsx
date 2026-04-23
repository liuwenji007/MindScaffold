import { Component, ReactNode } from 'react';
import Taro from '@tarojs/taro';
import { migrateBrandStorageKeys, migrateLegacyCardsToV2 } from '@/services/storage';
import './app.scss';

Taro.initPxTransform({
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  baseFontSize: 75
});

interface AppProps {
  children?: ReactNode;
}

class App extends Component<AppProps> {
  componentDidMount() {
    migrateBrandStorageKeys().catch(error => {
      console.error('Failed to migrate storage keys:', error);
    });
    migrateLegacyCardsToV2().catch(error => {
      console.error('Failed to migrate cards to v2:', error);
    });
  }

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return this.props.children;
  }
}

export default App;