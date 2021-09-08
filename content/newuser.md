+++
title = "新規登録"
description = ""
import = ["js/appsys.js", "js/newuser.js"]
importCSS = ["scss/loaded.scss"]
+++

## JOL2022応募

日本言語学オリンピック（JOL）へご興味を持ってくださり，ありがとうございます．

[最新の{{< icon file-alt " " >}}受験案内をお読みの上，ご応募ください](/application/)．

<a id="proceed" href="/entry/jol2022/" role="button" class="btn btn-template-primary text-decoration-none">JOL2022応募に進む</a>

<a id="mainmenu" href="/account/" role="button" class="btn btn-primary text-decoration-none" style="display: none;">成績参照</a>

{{< simplebox "Q. 登録済なのになぜ新規登録？" >}}
別のアカウントやメールアドレスでログインしているかもしれません．  
使用中のメールアドレス: <span class="user-email"></span>  
<button id="logout" onclick="logout()" class="btn btn-danger">ログアウト</button>
{{< /simplebox >}}

<style>
    #heading-breadcrumbs{
        background-image: url("../img/texture-green.png");
    }
</style>
