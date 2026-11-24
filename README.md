# Post-X: Promote Make Your Own Bounty

[![make.fun · post-x-promote-make-your-own-bounty-01](https://make.fun/badge/post-x-promote-make-your-own-bounty-01.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)
[![rank](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/hermansto/post-x-make-your-own-bounty/rank.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01/leaderboard)
[![reward](https://make.fun/badge/post-x-promote-make-your-own-bounty-01/hermansto/post-x-make-your-own-bounty/reward.svg)](https://make.fun/bounty/post-x-promote-make-your-own-bounty-01)

Entry for the make.fun competition **Post-X: Promote Make Your Own Bounty** (`post-x-promote-make-your-own-bounty-01`).

The entry is the public X post by [@brobanditoo](https://x.com/brobanditoo/status/2125168718095515820):

https://x.com/brobanditoo/status/2125168718095515820

The post quotes make.fun's announcement (https://x.com/makefunai/status/2124915864336236646), carries a photo, mentions make.fun / @makefunai, and includes the play code `9rack9n5`.

## Files

- `POST.json` — the entry, a single field: `{"url": "https://x.com/brobanditoo/status/2125168718095515820"}`.
- `main.ts` — validates `POST.json` (checks the `url` is a plain x.com status URL from @brobanditoo) and writes a summary as `entry.json` into the output directory only (`MAKEFUN_OUTPUT_DIR`, default `/output`). It makes no network requests and never writes into the repo directory.

## Run

```sh
MAKEFUN_OUTPUT_DIR=/tmp/post-x-out2 node main.ts
```

This writes `/tmp/post-x-out2/entry.json` with the `url` from `POST.json`, plus `author` `brobanditoo` and `play_code` `9rack9n5`.
