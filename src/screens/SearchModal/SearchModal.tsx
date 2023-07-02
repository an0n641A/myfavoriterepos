import React, {useState, useCallback} from 'react';
import {
  FlatList,
  View,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  ActivityIndicator,
} from 'react-native';
import useAxios from '../../hooks/useAxios';
import {getGithubOptions} from '../../utils/githubHelper';
import Search from '../../components/Search/Search';
import SearchTerm from '../../components/SearchTerm/SearchTerm';
import {debounce} from 'lodash';
import styles from './SearchModal.styles';
import SearchTermSpec from '../../interfaces/searchTermSpec.interface';
import {RepoSpec} from '../../interfaces/repoSpec.interface';
import {SearchModalProps} from '../../interfaces/navigation.interface';

const SearchModal = ({navigation}: SearchModalProps) => {
  const [text, setText] = useState('');
  const [suggested, setSuggested] = useState<SearchTermSpec[]>([]);
  const {loading, request} = useAxios();

  const handleAutocomplete = async (term: string) => {
    const githubOptions = getGithubOptions(term);
    let result = await request(githubOptions);
    let sanitizedRepoNameSuggestions: SearchTermSpec[] = result?.items.map(
      (item: any): SearchTermSpec => {
        return {
          name: item.name,
          fullName: item.full_name,
        };
      },
    );

    setSuggested(sanitizedRepoNameSuggestions);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRequest = useCallback(debounce(handleAutocomplete, 1000), []);

  const handleOnChange = (term: string) => {
    setText(term);
    if (term !== '') {
      debounceRequest(term);
    } else {
      setSuggested([]);
    }
  };

  const handleOnSubmitSearchRequest = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    const term = e.nativeEvent.text;
    handleSearchRequest(term);
  };

  const handleSearchRequest = async (term: string) => {
    setText(term);
    try {
      const githubOptions = getGithubOptions(term, 30);
      const result = await request(githubOptions);
      const sanitizedRepos: RepoSpec[] = result?.items.map(
        (item: any): RepoSpec => {
          return {
            id: item.id,
            fullName: item.full_name,
            createdAt: item.created_at,
            stargazersCount: item.stargazers_count,
            language: item.language,
            url: item.url,
            description: item.description ?? '',
          };
        },
      );

      navigation.goBack();
      navigation.navigate('Results', {sanitizedRepos, repoNameSearch: term});
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({
    item: {name, fullName},
  }: {
    item: {name: string; fullName: string};
  }) => {
    return (
      <SearchTerm
        term={fullName}
        handleOnPress={() => handleSearchRequest(name)}
      />
    );
  };

  const renderSuggestions = () => {
    if (loading) {
      return (
        <ActivityIndicator
          style={styles.indicator}
          size="large"
          color="black"
        />
      );
    }
    return (
      <FlatList
        data={suggested}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
        keyboardShouldPersistTaps={'always'}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Search
        autoFocus
        handleOnChangeText={handleOnChange}
        value={text}
        handleOnSubmit={handleOnSubmitSearchRequest}
      />
      {renderSuggestions()}
    </View>
  );
};

export default SearchModal;
