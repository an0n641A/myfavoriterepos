import React from 'react';
import {
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  View,
  TextInputSubmitEditingEventData,
} from 'react-native';
import styles from './Search.styles';
import Icon from '../../components/Icon/Icon';
import glass from '../../assets/search.png';

interface Props {
  handleOnChangeText: (val: string) => void;
  value: string;
  handleOnFocus?: (val: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  autoFocus?: boolean;
  handleOnSubmit?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
}

const Search = ({
  handleOnChangeText,
  value,
  handleOnFocus,
  autoFocus = false,
  handleOnSubmit,
}: Props) => {
  return (
    <View style={styles.box}>
      <Icon source={glass} height={20} width={20} styling={styles.icon} />
      <TextInput
        style={styles.input}
        onChangeText={handleOnChangeText}
        value={value}
        placeholder="Search For Repos On Github..."
        onFocus={handleOnFocus}
        autoFocus={autoFocus}
        enablesReturnKeyAutomatically
        blurOnSubmit
        onSubmitEditing={handleOnSubmit}
        returnKeyType={'search'}
      />
    </View>
  );
};

export default Search;
