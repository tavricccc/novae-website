# 1. Prepare GitHub

1. Fork [Novae](https://github.com/tavricccc/novae) into an account or organization where you can manage Settings.
2. Open `Actions` and enable the forked workflows after reviewing the code.
3. Open `Settings → Environments` and create an Environment named exactly `production`.
4. Add branch protection and required reviewers if multiple people manage releases.

`main` uses `production`. Do not create `dev` and `development` unless you truly plan to maintain a separate test deployment and a separate set of vendor resources.

GitHub Environments scope secrets and can protect deployments; see the [official GitHub documentation](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments).

Ready when the fork, Actions, and `production` Environment exist. Next: [create Firebase](firebase.md).
