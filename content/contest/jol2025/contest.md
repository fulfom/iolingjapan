+++
title = "JOL2025競技会場"
importTSX = "js/contest/jol2025/contest.tsx"
draft = false
type="page"
isFBInit = false
+++

##### {{< icon user "競技者情報" >}}

{{< wrap tag=div id="contestant-info-table" >}}
{{% table class="list-like ms-3 placeholder-glow" %}}

|||
| --------------- | ----------------------------------- |
| メールアドレス: | <p class="placeholder" style="width: max(24vw, 8rem)"></p> |
| 競技者氏名:     | <p class="placeholder" style="width: max(18vw, 6rem)"></p>  |
| 参加枠:         |  <p class="placeholder" style="width: max(6vw, 2rem)"></p> |

{{% /table %}}
{{< /wrap >}}

<div id="timer" class="fa-2x position-sticky pt-1" style="top: 62px; background-color: white; z-index: 10;">競技開始まで</div>

{{< wrap tag=div id="links" >}}

{{< card-header >}}
<ul class="list-group list-fill-link list-group-horizontal-sm">
  <li class="list-group-item flex-fill">
      <a target="_blank">
          <i class="fas fa-file-download fa-fw"></i>問題pdf1
      </a>
  </li>
  <li class="list-group-item">
      <a target="_blank">
          <i class="fas fa-file-download fa-fw"></i>（予備）問題pdf2
      </a>
  </li>
  <li class="list-group-item">
      <a target="_blank">
          <i class="fas fa-file-download fa-fw"></i>（予備）問題pdf3
      </a>
  </li>
</ul>
<ul class="list-group list-fill-link list-group-horizontal-sm">
  <li class="list-group-item flex-fill">
      <a target="_blank">
          <span class="unmot"><i class="fas fa-table fa-fw"></i>解答用ページ</span>
      </a></li>
  <li class="list-group-item">
      <a role="button">
          <span class="unmot"><i class="fas fa-table fa-fw"></i>（予備）解答用ページが使えない場合</span>
      </a></li>
</ul>
{{< /card-header >}}

{{< /wrap >}}

※問題pdf1が読み込めなかった人は問題pdf2, 問題pdf3を開いてください（中身は同じものです）．  
※解答用ページ（スプレッドシート）で適切に解答が入力できた方は，解答用エクセルファイルの提出はしないでください．  

<div id="qa" ></div>

---

<!-- TODO: 以下要更新 -->

### 競技中の注意事項

- 問題冊子は7ページまであります．
- 競技時間は120分です．問題は3問あります．どの問題から解いても構いません．
- 競技開始時刻になったら，解答用ページのリンクを開いて解答を入力してください．
- 競技終了時刻になったら，速やかに解答を終了してください．競技終了時刻以降に入力された解答は採点されません．
- 競技中は**資料や外部の情報源を使用してはいけません**．不正行為が発覚した場合は失格となります．
- 問題は日本言語学オリンピック公式サイト (`https://iolingjapan.org/`) で公開されるまで外部に漏らさないでください．問題公開日より前に問題をオンライン上で流出させたり議論したりしないでください．

### 解答の注意

- 解答はすべて解答用ページの指定の解答欄に入力してください．
- 小問は全部で42問あります．各小問には問題番号が1から42まで振られています．問題番号に対応する解答欄に入力してください．
- 解答欄以外には何も入力しないでください．
- 誤字・脱字がないよう注意深く入力してください．
- 問題文の表記通りに記入してください．

{{< simplebox よくある間違いの例 "ms-4" >}}

「あなたは言語学オリンピックを受験する」と解答すべき部分で，以下のように解答しないでください:

- 「あなたは**げんごがく**オリンピックを受験する」←漢字で書いてください
- 「あなたは言語学**おりんぴっく**を受験する」←カタカナで書いてください
- 「**貴方**は言語学オリンピックを受験する」 ←ひらがなで書いてください

{{< /simplebox >}}

- アラビア数字・アルファベット・スペースは半角で解答してください．

{{< simplebox よくある間違いの例 "ms-4" >}}

「2」と解答すべき部分で，「２」「二」「II」のように解答しないでください．

{{< /simplebox >}}

- 入力がしにくい文字は，代わりの入力法が指示されています．問題中の指示に従ってください．
- 句読点やピリオドは入れても入れなくてもかまいません．
- 大文字と小文字の区別はしなくてかまいません．

### 解答の制約と採点基準について

- 断りのない限り，解答は1つに定まります．複数の解答が考えられる場合は，最も適切な解答を**1つだけ**書いてください．
- 部分点を重視するので，**分かったことがあれば部分的にでも書いてください**．

{{< simplebox "例題1（3点）" "ms-4" >}}

以下に言語Xの動詞とその日本語訳が4つある．

{{< table class="list-like ms-2" >}}

||||
| --- | --------- | ---------------- |
| ア) | nilipika  | 私は料理した     |
| イ) | anapika   | 彼は料理している |
| ウ) | ninajenga | 私は建てている   |
| エ) | [ 1 ]     | 彼は建てた       |

{{< /table >}}

空欄[ 1 ]を埋めなさい．[3点，部分点あり]

{{< table class="list-like ms-2 d-none d-md-table" >}}

|||
| ------------------------------------------------------ |
| 1. alijenga (3点)                                           |
| 1. anlijenga (2点), 1\. anajenga (2点), 1\. nilijenga (2点), 1\. lijenga (2点) |
| 1. ninajenga (1点), 1\. jenga (1点)                                |
| 1. ninapika (0点)                                           |
{{< /table >}}
{{< list class="d-md-none" style="list-style-type: none" >}}

- 1\. alijenga (3点)
- 1\. anlijenga (2点), 1\. anajenga (2点), 1\. nilijenga (2点), 1\. lijenga (2点)
- 1\. ninajenga (1点), 1\. jenga (1点)
- 1\. ninapika (0点)
{{< /list >}}
{{< /simplebox >}}

- **設問と配点は必ずしも対応しません**．複数の設問に正解して初めて点が与えられる場合もあります．

{{< simplebox "例題2（3点）" "ms-4" >}}

以下に言語Yの名詞の単数形と複数形が7つある．

{{< table class="list-like ms-2" >}}

|||||
| --- | -------- | ------- | --------- |
|     | 日本語訳 | 単数形  | 複数形    |
| ア) | 薬       | karu    | karu      |
| イ) | 子ども   | ngaleke | rengaleke |
| ウ) | 犬       | bilis   | bilis     |
| エ) | 友人     | secheli | resecheli |
| オ) | 教師     | sensei  | [ 1 ]     |
| カ) | 車       | mlai    | [ 2 ]     |
| キ) | 少年     | buik    | [ 3 ]     |
{{< /table >}}

空欄[ 1 ]～[ 3 ]を埋めなさい． [3点, 完答]

{{< table class="list-like ms-2 d-none d-sm-table" >}}

|||||
| ------------ | --------- | --------- | ----------------- |
| 1. resensei | 2. mlai   | 3. rebuik | ←正解 (3点)     |
| 1. resensei | 2. remlai | 3. rebuik | ←得点なし (0点) |
| 1. sensei   | 2. mlai   | 3. buik   | ←得点なし (0点) |
{{< /table >}}
{{< list class="d-sm-none" style="list-style-type: none" >}}

- 1\. resensei 2. mlai   3. rebuik ←正解 (3点)
- 1\. resensei 2. remlai 3. rebuik ←得点なし (0点)
- 1\. sensei   2. mlai   3. buik   ←得点なし (0点)
{{< /list >}}
{{< /simplebox >}}

## 事前準備事項

競技の事前準備として以下の3点を確認してください．

- 充電・ネット環境がある
- 問題pdf が閲覧できる
- 解答用ページ（グーグルスプレッドシート）に記入できる

本ページを活用し，きちんと問題pdfが閲覧できるか，解答用ページに記入できるか，確認してください．

### 充電・ネット環境の確認

充電・ネット環境の準備ができているか確認してください．競技中は常にインターネットに接続していてください．接続が切れても構わず解答を続けて構いませんが，競技終了時点までに再接続しなかった場合，最後に接続した時点での解答が採点される可能性があります．

### 問題閲覧の注意事項

問題は pdf で公開します．

- パソコンやタブレットなどで閲覧しながら解いても，プリンターで印刷しても構いません．両方の方法を併用しても構いません．印刷しないで解く場合は書き込んだりテキストを挿入したりできる pdf 編集ツールがあると便利です．
- 競技開始後に印刷のためにコンビニなどへ行ったり，pdf 閲覧や解答用ページの操作のためにツールをダウンロードしたりして構いません．ただし，その移動・操作に時間がかかっても，競技時間は延長されません．
- 手書き・電子を問わず，メモを取って構いません．pdf内検索をしても構いません．
- 問題pdf のリンクは流出させないでください．
  
### 解答用ページの確認

#### 方法1（推奨）

{{< icon table 解答用ページ >}}（グーグルスプレッドシート）を開いて解答を入力します．

解答は自動で保存されます．時間になったら自動で提出もされます．

- タブレットやスマホで解答を入力する場合はグーグルスプレッドシートのアプリをダウンロードしておいてください．pcで解く場合はアプリなどのダウンロードは必要ありません．
- 必ず，用意された解答用ページ（グーグルスプレッドシート）を開いて解答を入力してください．**解答用ページを複製したり，同様のページを作成したりしないでください**．受験者自身が作成または複製したページに解答を入力しても，その解答は採点されません．
- 解答用ページのリンクは流出させないでください．
- 競技中は常にインターネットに接続していてください．接続が切れても構わず解答を続けて構いませんが，競技終了時点までに再接続しなかった場合，最後に接続した時点での解答が採点される可能性があります．
- **競技時間が終了したら必ず入力を終えてください**．競技時間が終了してからも何分も入力を続けた場合には競技終了前後の一連の入力を無視して採点をします．
- 解答用ページはグーグルのサービスであるグーグルスプレッドシートを用いますが，Google アカウントにログインしていなくても解答が可能なように設定してあります．したがって Google アカウントにログインする必要はありません．逆に何らかの Google アカウントにログインしていても構いません（応募に使用した Google アカウントとは別のアカウントにログインしていても構いません）．

#### 方法2（方法1が不可能な場合）

解答用エクセルファイルをダウンロードして，そこに解答を入力し，時間内に委員会のメール宛てに提出してください．手書きの解答の提出など，他の方法での解答は原則認められません．

### その他

- 競技開始に際して問題配信側に遅延があった場合，その分の競技時間は延長されます．
- 表示されているタイマーは目安です．正確に測るためには端末の時間が正確である必要があります．
- 複数の端末を使っても構いません．たとえば問題は pc で閲覧して，解答はスマホ，でも構いません．ただし，問題pdf と解答用ページのリンクの扱いに注意してください．
- 競技が終わったら競技会場ページや解答用ページを閉じて構いません．
- 競技中は飲食自由です．

当日の流れ

{{< table class="list-like">}}

|||
|---|---|
|12:30~|各自動作確認|
|13:00~15:00|本競技|
|15:00|競技終了・解散|

{{</table>}}

## 問題閲覧・解答提出手順

↓競技開始時間になると，{{< icon "file-download" 問題pdf >}} が緑になり，押すと問題pdf がダウンロードできるようになります．同様に，解答用ページにもアクセスできるようになります．

{{< figure src="/img/demo/jol2024_links_displayed_demo.png">}}

※問題を閉じてしまった場合や何らかの理由で開けなかった場合は改めて「{{< icon "file-download" 問題pdf >}}」をクリックしてください．

{{< wrap tag=div class="container-fluid" >}}
{{< wrap tag=div class="row" >}}

{{< wrap tag=div class="col-lg-6" >}}
問題pdfのイメージ
{{< figure src="/img/jol2022/problem_demo.png">}}
{{< /wrap >}}

{{< wrap tag=div class="col-lg-6" >}}
解答用ページのイメージ
{{< figure src="/img/jol2022/answer_demo.png">}}
{{< /wrap >}}

{{< /wrap >}}
{{< /wrap >}}

### 競技中の質問方法

まず訂正・よくある質問の中に知りたいことがないか確認してください．

{{< figure src="/img/demo/jol2024_faq.png">}}

解決しなければ，「質問を入力」から質問を記入してください．随時，競技監督者が質問に答えます．質問への回答には多少時間がかかる可能性がありますので，質問への回答を待つ間も，問題を解き進めていてください．

{{< figure src="/img/demo/jol2024_question.png">}}

{{< simplebox "任意" >}}

競技開始から問題pdf ・解答ページへのアクセスをより短縮したい方のために，競技開始した時点でその2つが自動で開かれるような設定も用意しています（任意）．本ページで練習用タイマーを起動して何も操作せずに待つと「ポップアップをブロックしました」といったメッセージが表示されると思います．そのメッセージをクリックし，iolingjapan.org からのポップアップを許可する設定に変えてください．すると，競技開始時刻になったら自動で問題pdf ・解答ページが開かれるようになります．設定ができているか確認するためには，ためしにページを開きなおし，再度練習用タイマーを起動して何も操作せずに待ってください．競技開始時刻に自動で問題pdf ・解答ページが開かれたら設定できています．

{{< /simplebox >}}

以上問題閲覧・解答提出方法の説明でした．