const core = require("@actions/core");
const github = require("@actions/github");

module.exports = {
  getPullRequest: async (token, owner, repo, pr) => {
    const octokit = github.getOctokit(token);

    try {
      const { data: pullRequest } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pr
      });

      return pullRequest;
    } catch (error) {
      core.setFailed(`Get pull request call failed: ${error}`);
      return null;
    }
  },
  getOpenPullRequests: async (token, owner, repo) => {
    const octokit = github.getOctokit(token);

    let pullRequests = [];
    let page = 0;
    let hasNextPage = true;

    while (hasNextPage) {
      try {
        const { data: prs } = await octokit.pulls.list({
          owner,
          repo,
          state: "open",
          per_page: 100,
          page
        });

        prs.forEach((pr) => pullRequests.push(pr));

        page += 1;
        hasNextPage = prs.length === 100;
      } catch (error) {
        hasNextPage = false;
        core.setFailed(`Get open pull request call failed: ${error}`);
      }
    }

    core.info(`Number of Open PRs: ${pullRequests.length}`);

    return pullRequests;
  },
};
