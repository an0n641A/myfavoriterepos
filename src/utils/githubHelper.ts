export const getGithubOptions = (
  term: string,
  perPage: number = 10,
  pageNumber: number = 1,
) => {
  return {
    method: 'get',
    baseURL: `https://api.github.com/search/repositories?q=${term}+in:name&per_page=${perPage}&page=${pageNumber}`,
    headers: JSON.stringify({
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      Authorization:
        'Bearer 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',
    }),
  };
};
