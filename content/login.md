+++
title = "ログイン"
description = ""
importTSX = "js/login.ts"
importCSS = ["scss/loaded.scss"]
cdn = [
    "https://www.gstatic.com/firebasejs/9.13.0/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth-compat.js",
    "https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth__ja.js"
    ]
+++

使用するアカウントやメールアドレスは個人識別に使われます．他の人と同じものを共有しないでください．

<script src="https://accounts.google.com/gsi/client" async defer></script>
<div id="firebaseui-auth-container"></div>
<div id="loader"></div>

{{< simplebox "ログインに失敗する場合" >}}
新しい OS の iPhone，iPad をお使いの場合，または Mac で新しい Safari をお使いの場合，ログインに失敗する不具合が確認されています．修正に時間がかかるので，その間，以下の解決策をとっていただくようお願いいたします．

- パソコンで Chrome からログインする
- 下記からログインする（ポップアップを許可する必要があるかもしれません）

<div class="d-flex justify-content-center">
<div id="google-auth2" class="firebaseui-idp-button"></div>
</div>

※iOS16.1以上，iPadOS 16.1以上，Mac Safari 16.1以上
{{< /simplebox >}}

{{< simplebox "Tips" >}}

どの Google アカウント/メールアドレスでログインしていたか忘れた，そんな場合は当委員会（ jolinguistics@gmail.com ）からのメールを検索し，メールを受け取ったことのあるメールアドレス（またはそのメールアドレスに紐づいている Google アカウント）でログインしてみてください．

{{< /simplebox >}}
