+++
title = "応募者ページ"
description = ""
importTSX = "js/account.ts"
importCSS = ["scss/loaded.scss"]
isFBInit = false
+++

{{< appSys/features >}}

{{< wrap tag=div class="alert alert-warning" role="alert" id="alert" style="display: none;">}}
{{< icon exclamation-triangle あなたは >}}JOL2023の応募が完了していません．

- そもそもJOL2023に応募していない．
- 受験料の支払いが済んでいない．
- ログインするアカウントを間違えている．

もしも，ログインするアカウントを間違えた場合は，正しいアカウントでログインしなおしてください．

今お使いのメールアドレス: <span class=user-email></span>

<button id="logout1" class="btn btn-danger btn-small">ログアウト</button>

{{< /wrap >}}

{{< simplebox お知らせ "" "info" >}}

2022/12/22: [JOL2023事前練習ページを公開しました](/contest/jol2023/demo/)．

{{< /simplebox >}}

{{< /appSys/features >}}

{{< appSys/contests >}}

<button id="logout2" class="btn btn-danger btn-small mt-5">ログアウト</button>
