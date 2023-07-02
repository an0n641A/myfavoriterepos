import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '../../store/config';
import {setRepos, removeFavoriteRepoById} from '../../store/favoriteRepoSlice';
import Search from '../../components/Search/Search';
import NotFound from '../../components/NotFound/NotFound';
import useAxios from '../../hooks/useAxios';
import {RepoSpec} from '../../interfaces/repoSpec.interface';
import Repo from '../../components/Repo/Repo';
import styles from './Home.styles';
import {HomeProps} from '../../interfaces/navigation.interface';

export const SERVER_URL =
  Platform.OS === 'ios'
    ? 'http://localhost:8080/repo/'
    : 'http://192.168.0.4:8080/repo/';

const Home = ({navigation}: HomeProps) => {
  const insets = useSafeAreaInsets();

  const repos = useSelector((state: RootState) => state.favorite.repos);
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [refresh, setRefresh] = useState(false);
  const {loading, request} = useAxios();

  useEffect(() => {
    retrieveFavoriteRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveFavoriteRepos = () => {
    request({
      method: 'get',
      baseURL: SERVER_URL,
    })
      .then(response => {
        const processedRepos: RepoSpec[] = processForMissingStargazers(
          response?.repos,
        );
        dispatch(setRepos(processedRepos || []));
        setRefresh(false);
      })
      .catch(e => {
        setRefresh(false);
        dispatch(setRepos([]));
        console.log(e);
      });
  };

  const sortDescending = (a: RepoSpec, b: RepoSpec) => {
    return b.stargazersCount - a.stargazersCount;
  };

  const processForMissingStargazers = (
    processingRepos: RepoSpec[],
  ): RepoSpec[] => {
    return processingRepos.map(repo => {
      if (!repo.stargazersCount) {
        return {
          ...repo,
          stargazersCount: 0,
        };
      }
      return repo;
    });
  };

  const handleRemoveFromFavorites = (repoId: string) => {
    request({
      method: 'delete',
      baseURL: `${SERVER_URL}${repoId}`,
    })
      .then(() => {
        dispatch(removeFavoriteRepoById(repoId));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleOnRefresh = () => {
    setRefresh(true);
    retrieveFavoriteRepos();
  };

  const renderItem = ({
    item: {id, fullName, createdAt, stargazersCount, language, url},
  }: {
    item: RepoSpec;
  }) => {
    return (
      <Repo
        id={id}
        fullName={fullName}
        createdAt={createdAt}
        stargazersCount={stargazersCount}
        language={language}
        url={url}
        handleOnPress={() => handleRemoveFromFavorites(id)}
        isFavorite={true}
      />
    );
  };

  const renderHomeContent = () => {
    if (repos.length > 0) {
      // can't directly mutate the state in redux, thus need copy
      const copyOfRepos = [...repos];
      const sortedRepos = copyOfRepos.sort(sortDescending);

      return (
        <FlatList
          data={sortedRepos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          bounces
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={handleOnRefresh}
              progressBackgroundColor="white" // android
              colors={['black']} // android
              tintColor={'black'} // ios
            />
          }
        />
      );
    } else if (!loading && repos.length <= 0) {
      return <NotFound />;
    }
  };

  const handleOnFocus = async () => {
    navigation.navigate('SearchModal');
  };

  const handleSearch = async () => {
    navigation.navigate('SearchModal');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}>
      <TouchableOpacity activeOpacity={0.8} onPress={handleSearch}>
        <View pointerEvents="none">
          <Search
            handleOnFocus={handleOnFocus}
            handleOnChangeText={setText}
            value={text}
          />
        </View>
      </TouchableOpacity>
      {renderHomeContent()}
    </View>
  );
};

export default Home;
