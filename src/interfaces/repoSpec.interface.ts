export interface RepoSpec {
  id: string;
  fullName: string;
  createdAt: string;
  stargazersCount: number;
  language: string;
  url: string;
  description?: string;
  handleOnPress?: () => void;
}

export interface RepoItem extends Omit<RepoSpec, 'url'> {
  url?: string;
  isFavorite?: boolean;
  handleOnPress: () => void;
}
