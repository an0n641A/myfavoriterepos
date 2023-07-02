import React from 'react';
import {View, Text} from 'react-native';
import styles from './NotFound.styles';
import Icon from '../Icon/Icon';
import octocat from '../../assets/octostar.webp';

const NotFound = () => {
  return (
    <View style={styles.container}>
      <Icon
        source={octocat}
        height={250}
        width={250}
        styling={{marginTop: '-65%'}}
      />
      <Text style={styles.text}>No Favorite Repos Found</Text>
    </View>
  );
};

export default NotFound;
