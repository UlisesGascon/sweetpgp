workflow "Build, Test, Lint & Release" {
  on = "push"
  resolves = ["Publish Release"]
}

action "Build" {
  uses = "actions/npm@master"
  args = "install"
}

action "Lint" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Test" {
  needs = "Lint"
  uses = "actions/npm@master"
  args = "test"
}

# Filter for a new tag
action "Filters for Master branch" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish Release" {
  uses = "frankjuniorr/github-create-release-action@master"
  needs = ["Filters for Master branch"]
  secrets = ["GITHUB_TOKEN"]
}
