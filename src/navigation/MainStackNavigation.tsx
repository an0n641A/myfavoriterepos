import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../interfaces/navigation.interface';
import Home from '../screens/Home/Home';
import Results from '../screens/Results/Results';
import SearchModal from '../screens/SearchModal/SearchModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Group screenOptions={{headerBackTitleVisible: false}}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{title: 'My Favorite Repos'}}
        />
        <Stack.Screen
          name="Results"
          component={Results}
          options={{title: 'Search Results'}}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal', headerShown: false}}>
        <Stack.Screen name="SearchModal" component={SearchModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainStackNavigation;
