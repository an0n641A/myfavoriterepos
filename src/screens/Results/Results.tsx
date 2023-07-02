import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import Toast from 'react-native-toast-message';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '../../store/config';
import {
  addToFavoriteRepos,
  removeFavoriteRepoById,
} from '../../store/favoriteRepoSlice';
import useAxios from '../../hooks/useAxios';
import {getGithubOptions} from '../../utils/githubHelper';
import Repo from '../../components/Repo/Repo';
import {RepoItem, RepoSpec} from '../../interfaces/repoSpec.interface';
import {RootStackParamList} from '../../interfaces/navigation.interface';
import styles from './Results.styles';

import {SERVER_URL} from '../Home/Home';
const MAX_FAVORITES = 10;

const Results = ({
  route: {
    params: {sanitizedRepos, repoNameSearch},
  },
}: NativeStackScreenProps<RootStackParamList, 'Results'>) => {
  const insets = useSafeAreaInsets();

  const repos = useSelector((state: RootState) => state.favorite.repos);
  const dispatch = useDispatch();

  const [repoSearchResults, setRepoSearchResults] = useState<RepoItem[]>([]);
  const [page, setPage] = useState<number>(2);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [text, setText] = useState('');

  const {request} = useAxios();

  useEffect(() => {
    setText(repoNameSearch);
    const favoritesSanitizedRepos = isCurrentFavoriteRepo(
      sanitizedRepos as RepoItem[],
    );
    setRepoSearchResults(favoritesSanitizedRepos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const postOptions = (repo: RepoItem) => {
    return {
      method: 'post',
      baseURL: `${SERVER_URL}`,
      body: JSON.stringify({
        id: repo.id.toString(),
        fullName: repo.fullName,
        createdAt: repo.createdAt,
        stargazersCount: repo.stargazersCount ?? 0,
        language: repo.language,
        url: repo.url,
      }),
    };
  };

  const handleOnFavorite = async (repo: RepoItem) => {
    const favoriteRepoIds = repos.map(item => item.id.toString());
    const isFavorite = favoriteRepoIds.includes(repo.id.toString());

    if (isFavorite || repos.length < MAX_FAVORITES) {
      // update the UI right away (visually responsive to user)
      const newRepo = {
        ...repo,
        isFavorite: !repo.isFavorite,
      };
      const index = repoSearchResults.findIndex(item => item.id === newRepo.id);
      repoSearchResults[index] = newRepo;
      setRepoSearchResults([...repoSearchResults]);
    }

    if (isFavorite) {
      try {
        await request({
          method: 'delete',
          baseURL: `${SERVER_URL}${repo.id}`,
        });
        dispatch(removeFavoriteRepoById(repo.id.toString()));
      } catch (e) {
        console.log(e);
      }
    } else {
      if (repos.length < MAX_FAVORITES) {
        try {
          const serverOptions = postOptions(repo);
          await request(serverOptions);
          dispatch(addToFavoriteRepos(repo as RepoSpec));

          const filteredRepoSearchResults =
            modifyFavoriteRepoByIdInSearchResults(repo.id.toString(), true);
          setRepoSearchResults(filteredRepoSearchResults);
        } catch (e) {
          const index = repoSearchResults.findIndex(
            item => item.id === repo.id,
          );
          repoSearchResults[index] = repo;
          setRepoSearchResults([...repoSearchResults]);
          console.log(e);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Not Allowed',
          text2: `The maximum allowed of favorite repos is ${MAX_FAVORITES}`,
        });
      }
    }
  };

  const renderItem = ({item}: {item: RepoItem}) => {
    return (
      <Repo
        id={item.id}
        fullName={item.fullName}
        createdAt={item.createdAt}
        stargazersCount={item.stargazersCount}
        language={item.language}
        url={item.url}
        handleOnPress={() => handleOnFavorite(item)}
        isFavorite={item.isFavorite}
        description={item.description}
      />
    );
  };

  const loadMoreResults = async () => {
    if (loadingMore || allLoaded) {
      return;
    }
    setLoadingMore(true);

    const githubOptions = getGithubOptions(text, 30, page);
    const result = await request(githubOptions);
    if (result.length === 0) {
      // prevent further requests, as there is nothing more to request
      setAllLoaded(true);
    } else {
      setPage(page + 1);

      const sanitizedAdditionalRepos: RepoItem[] = result?.items.map(
        (item: any): RepoItem => {
          return {
            id: item.id,
            fullName: item.full_name,
            createdAt: item.created_at,
            stargazersCount: item.stargazers_count,
            language: item.language,
            url: item.url,
            isFavorite: false,
            handleOnPress: () => {},
            description: item.description,
          };
        },
      );

      const favoritesSanitizedAdditionalRepos = isCurrentFavoriteRepo([
        ...sanitizedAdditionalRepos,
      ]);
      setRepoSearchResults([
        ...repoSearchResults,
        ...favoritesSanitizedAdditionalRepos,
      ]);
    }

    setLoadingMore(false);
  };

  const modifyFavoriteRepoByIdInSearchResults = (
    id: string,
    bool: boolean,
  ): RepoItem[] => {
    return repoSearchResults.map(repo => {
      if (repo.id.toString() === id) {
        return {
          ...repo,
          isFavorite: bool,
        };
      }
      return repo;
    });
  };

  const isCurrentFavoriteRepo = (additionalRepos: RepoItem[]): RepoItem[] => {
    const favoriteRepoIds = repos.map(repo => repo.id.toString());
    return additionalRepos.map(repo => {
      if (favoriteRepoIds.includes(repo.id.toString())) {
        return {
          ...repo,
          isFavorite: true,
        };
      }
      return repo;
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
        },
      ]}>
      <FlatList
        data={repoSearchResults}
        extraData={repoSearchResults}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        keyboardShouldPersistTaps={'always'}
        onEndReachedThreshold={0.8}
        onEndReached={loadMoreResults}
        bounces
        ListFooterComponent={
          !loadingMore ? null : (
            <ActivityIndicator
              style={styles.activityIndicator}
              size="large"
              color="black"
            />
          )
        }
      />
    </View>
  );
};

export default Results;
