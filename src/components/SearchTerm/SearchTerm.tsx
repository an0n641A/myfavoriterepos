import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from '../../components/Icon/Icon';
import repoIcon from '../../assets/repo.png';
import styles from './SearchTerm.styles';

const SearchTerm = ({
  term,
  handleOnPress,
}: {
  term: string;
  handleOnPress: (name: string) => void;
}) => {
  return (
    <TouchableOpacity onPress={() => handleOnPress(term)}>
      <View style={styles.container}>
        <Icon
          source={repoIcon}
          height={25}
          width={25}
          tint="black"
          styling={styles.icon}
        />
        <Text style={styles.text}>{term}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchTerm;
