import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import MainStackNavigation from './navigation/MainStackNavigation';

import {store} from './store/config';
import Toast from 'react-native-toast-message';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle={'dark-content'} />
          <MainStackNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
      <Toast />
    </Provider>
  );
}

export default App;
