import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import moment from 'moment';
import styles from './Repo.styles';
import {RepoItem} from '../../interfaces/repoSpec.interface';
import Icon from '../Icon/Icon';
import star from '../../assets/octiconStar.png';

const Repo = ({
  fullName,
  createdAt,
  stargazersCount = 0,
  language,
  isFavorite = false,
  handleOnPress,
  description,
}: RepoItem) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text
          style={[styles.text, styles.header]}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {fullName}
        </Text>
        <View style={styles.description}>
          <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.text}>{language}</Text>
          <View style={styles.stargazers}>
            <Icon
              source={star}
              height={20}
              width={20}
              tint="white"
              styling={styles.icon}
            />
            <Text style={styles.text}>{stargazersCount?.toLocaleString()}</Text>
          </View>
          <Text style={styles.text}>
            Created: {moment(createdAt).format('MM/DD/YY')}
          </Text>
        </View>
      </View>
      <View style={styles.rightColumn}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleOnPress}>
          <Icon
            source={star}
            height={40}
            width={40}
            tint={isFavorite ? 'yellow' : 'white'}
            styling={styles.largeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Repo;
