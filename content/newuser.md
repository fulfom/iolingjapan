+++
title = "新規登録"
description = ""
import = ["js/appsys.js", "js/newuser.js"]
importCSS = ["scss/loaded.scss"]
+++

<a id="proceed" href="/entry/jol2022/" role="button" class="btn btn-template-primary text-decoration-none">JOL2022応募に進む</a>

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
