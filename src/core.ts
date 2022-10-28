import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";
import {getOctokit} from "@actions/github";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

export function run(input: Inputs): Outputs {
    let page = 2;
    if (input.limit_tags > 0) {
        let result = [];
        do {
            octokit.repos.listTags({owner, repo, page: page++, per_page: input.limit_tags}).then(({data}) => {
                result = data;
                debugPrintf('github.context', data);
                for (let tag of data) {
                    octokit.git.deleteRef({owner, repo, ref: `refs/tags/${tag.name}`});
                }

            });
        } while (result.length >= input.limit_tags)
    }

    return {};
}
