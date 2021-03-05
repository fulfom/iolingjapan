+++
title = "新規登録"
description = ""
import = ["js/appsys.js", "js/newuser.js"]
importCSS = ["scss/loaded.scss"]
+++

<div class="simple-box" id="switchaccount">
    <span class="box-title"><a data-toggle="collapse" href data-target="#collapse-switchaccount" role="button" aria-expanded="true" aria-controls="collapse-switchaccount"><i class="fas fa-angle-right fa-fw"></i>Q. 登録済なのになぜ新規登録？</a></span>
    <div class="collapse show" id="collapse-switchaccount">
        <p>別のアカウントやメールアドレスでログインしているかもしれません．</p>
        <p>使用中のメールアドレス: <span class="user-email"></span></p>
        <button id="logout" onclick="logout()" class="btn btn-danger">ログアウト</button>
    </div>
</div>

現在新規登録は受け付けておりません．

<style>
    #heading-breadcrumbs{
        background-image: url("../img/texture-green.png");
    }
</style>
