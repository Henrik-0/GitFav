export class GithubApi {
  static search(username) {
    const url = `https://api.github.com/users/${username}`;
    return fetch(url)
    .then(dataJson => dataJson.json())
    .then(( {login, name, public_repos, followers} ) => ({
      login,
      name,
      public_repos,
      followers
    }));
  };
};