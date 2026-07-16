# 1. Prepare GitHub

1. Fork [Novae](https://github.com/tavricccc/novae) into an account or organization where you can manage Settings.
2. Open `Actions` and enable the forked workflows after reviewing the code.
3. Open `Settings → Environments` and create an Environment named exactly `production`.
4. Add branch protection and required reviewers if multiple people manage releases.

`main` uses `production`. Do not create `dev` and `development` unless you truly plan to maintain a separate test deployment and a separate set of vendor resources.

When upstream changes, open your fork, choose `Sync fork → Update branch`, confirm the latest commit is on the fork's `main`, then run Actions from that fork. Do not rerun an old failed run that still points to an old commit. Production secrets must exist in the fork that actually runs Actions.

GitHub Environments scope secrets and can protect deployments; see the [official GitHub documentation](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments).

Ready when the fork, Actions, and `production` Environment exist. Next: [create Firebase](firebase.md).
