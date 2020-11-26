+++
title = "タイトル"
+++

↑ ファイルごとにオプションの指定が一番上で行われる．タイトルなど．

## マークダウンで

{{< figure src="" title="画像は普通の md 風ではなく Hugo のショートコードを使う(class とか指定できるので)" >}}

画像の置き場所は /static/img/(好きなフォルダ/)something.png で，参照するときは /static を取って /img/(好きなフォルダ/)something.png とする．

{{< figure src="/img/logo.png" title="ロゴ" class="" >}}

表もクラス指定したいとかあると思うのですが，そういう場合もショートコードを用いる．こっちは挟むタイプなので挟む．

{{< table class="table" >}}

|     |     |
| --- | --- |
|     |     |
|     |     |
<!-- 中身はマークダウン風にする -->

{{< /table >}}

リストのクラス指定はこう

{{< card-header >}}
{{< list class="list-group list-group-flush list-fill-link" liclass="list-group-item" >}}

- [大会一覧 - ことはじ](https://kotohazi.netlify.app/problems/contests)
- [問題集 - ことはじ](https://kotohazi.netlify.app/problems/)
- [日本語で解ける問題 - ことはじ](https://kotohazi.netlify.app/problems/?v=1&t=SU9MMjAoMVs1LTldfFteMDFdXGQpfEpPTHxBUExPfOaXpeacrOiqnuiosw&s=5pel5pys6Kqe44Gn6Kej44GR44KL5ZWP6aGM)

{{< /list >}}
{{< /card-header >}}

css は assets/scss/_variables-project.scss に scss で書く．(static/css 以下にも css が存在するし， bootstrap も入っているのでよくわからない css がきいていることもあるが，今まではChrome で確認しながら都度都度で変更していた……)
