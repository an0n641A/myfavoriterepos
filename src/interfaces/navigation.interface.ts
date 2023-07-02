import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RepoSpec} from './repoSpec.interface';

export type RootStackParamList = {
  Home: undefined;
  Results: {
    sanitizedRepos: RepoSpec[];
    repoNameSearch: string;
  };
  SearchModal: undefined;
};

export interface HomeProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
}

export interface ResultsProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: {
    params: {
      sanitizedRepos: RepoSpec[];
      repoNameSearch: string;
    };
  };
}

export interface SearchModalProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SearchModal'>;
}
