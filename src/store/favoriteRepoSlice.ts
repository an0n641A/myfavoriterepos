import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {RepoSpec} from '../interfaces/repoSpec.interface';

export interface FavoriteRepoState {
  repos: RepoSpec[];
}

const initialState: FavoriteRepoState = {
  repos: [],
};

export const favoriteRepoSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    setRepos: (state, action: PayloadAction<RepoSpec[]>) => {
      state.repos = action.payload;
    },
    addToFavoriteRepos: (state, action: PayloadAction<RepoSpec>) => {
      state.repos.push(action.payload);
    },
    removeFavoriteRepoById: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        repos: state.repos.filter(
          repo => repo.id.toString() !== action.payload,
        ),
      };
    },
  },
});

export const {setRepos, addToFavoriteRepos, removeFavoriteRepoById} =
  favoriteRepoSlice.actions;

export default favoriteRepoSlice.reducer;
