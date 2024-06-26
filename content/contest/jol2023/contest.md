+++
title = "JOL2023競技会場"
importTSX = "js/contest/jol2023/contest.tsx"
draft = true
type="page"
isFBInit = false
+++

{{< simplebox "競技終了" "d-none" "notice-contest-participation" >}}

お疲れさまでした．

<p id="notice-contest-participation-message"></p>

{{< /simplebox >}}

{{< simplebox "競技終了" "d-none" "notice-notselected" >}}

あなたは面接対象者には選ばれませんでした．これで競技は終了となります．2023年1月10日の結果発表をお待ちください．本ページは閉じても構いません．

{{< /simplebox >}}

{{< simplebox "面接のお知らせ" "d-none" "notice-meeting" >}}

- あなたは面接対象者です．

- **<span id="meeting-open"></span>** 頃になったら，Zoom ミーティングのリンクが以下に表示されます．リンクが表示されたら早めに入室し，**<span id="meeting-gather"></span>** には面接会場の Zoom ミーティングで待機していてください．この時間に遅れた場合，あなたの面接時間が再調整され大幅に遅れるか，場合によっては失格となります．遅れる場合は，委員会アドレス {{< email >}} に連絡をしてください．

- あなたの面接は **<span id="meeting-start"></span>** から行われます．Zoom ミーティングに参加したまま，待機してください．

- Zoom ミーティングに入ったら，名前を次の通りにしてください．照合のために，ここでは間違っていても訂正せず，漢字・カタカナ・ひらがな・ローマ字まで，一字一句同一にしてください:  
**<span id="meeting-name"></span>**

- 身分証と筆記用具・メモ用紙を用意してください．カメラ・マイクのついた機器から参加してください．
- 面接の際にはこちらで録画を撮ることがあります．不正確認終了後，録画データは破棄されます．

{{< wrap tag=div class="meetinglink d-none">}}

面接会場には<a id="meetinglinkHref">こちらからアクセスしてください</a>．

または下のQRコードからアクセスできます．

{{< wrap tag=div style="max-width: 200px" >}}
<figure>
  <img id="meetinglink-qrcode">
</figure>
{{< / wrap >}}

{{< / wrap >}}
{{< /simplebox >}}

##### 流れ

{{< table class="list-like ms-3">}}

|||
|---|---|
|13:00~15:00|本競技|
|17:30頃|本ページで面接対象者・集合時間発表（{{<icon flag 選抜枠>}}のみ）|
|18:00~|面接（対象者のみ）|

{{</table>}}

##### {{< icon user "競技者情報" >}}

{{% table class="list-like ms-3" %}}

|||
| --------------- | ----------------------------------- |
| メールアドレス: | <span id="contestant-email">読み込み中</span> |
| 競技者氏名:     | <span id="contestant-name"></span>  |
| 参加枠:         | <span id="contestant-spot"></span>  |

{{% /table %}}

<div id="timer" class="fa-2x position-sticky pt-1" style="top: 62px; background-color: white; z-index: 10;">競技開始まで</div>

{{< card-header >}}
{{< list class="list-group list-fill-link" liclass="list-group-item" id="links">}}

<ul>
<li><a target="_blank">{{< icon file-download 問題pdf>}}</a></li>
<li><a target="_blank">{{< icon table 解答用ページ >}}</a></li>
<li><a href="https://drive.google.com/file/d/1J5uXaabLxM4lfL5hCiwZuek-QslyVPhH/view?usp=sharing" target="_blank">{{< icon lock パスワード付き問題pdf >}}</a></li>
</ul>

{{< /list >}}
{{< /card-header >}}

パスワード付き問題pdf のパスワードはこちらに表示されます: <span id="pwd"></span>

<span id="rugtime"></span>

---

**上記のリンクから問題の閲覧・解答の入力が出来なかった場合**は以下のリンクから問題や解答用エクセルファイルを入手してください．解答用エクセルファイルは**競技時間内にメールで** {{< email >}} に提出してください．提出の際には，競技者情報（メールアドレス，競技者氏名，参加枠）を付してください（本ページの上の方に記載のものをコピー&ペーストすると確実です．その他の情報や文面は不要です）．

※解答用ページ（スプレッドシート）で適切に解答が入力できた方は，解答用エクセルファイルの提出はしないでください．

{{< card-header >}}
{{< list class="list-group list-fill-link" liclass="list-group-item" id="links2">}}

<ul>
<li><a target="_blank">{{< icon file-download 問題pdf2>}}</a></li>
<li><a target="_blank">{{< icon table 解答用エクセルファイル >}}</a></li>
</ul>

{{< /list >}}
{{< /card-header >}}

### 質疑応答

質問は以下の Slido から受け付けます．

<iframe src="https://app.sli.do/event/hSaeuX4DhifjhHNiEDiRvY" height="100%" width="100%" frameBorder="0" style="min-height: 560px;" title="Slido"></iframe>

<a href="https://app.sli.do/event/hSaeuX4DhifjhHNiEDiRvY" target="_blank">以上から上手く閲覧できない場合はこちら（同じものが別のウィンドウで開かれます）</a>．

### 競技開始の前に

- 競技開始に際して問題配信側に遅延があった場合，その分の競技時間は延長されます．
- 表示されているタイマーは目安です．正確に測るためには端末の時間が正確である必要があります．
- お使いの端末の充電が十分にあることを確認してください．
- お使いの端末がインターネットに接続されていることを確認してください．
- お使いの端末で解答用ページ（グーグルスプレッドシート）が編集可能であるか確認してください．
- 必ず，用意された解答用ページ（グーグルスプレッドシート）のリンクを開いて解答を入力してください．それが不可能な場合は，用意された解答用エクセルファイルに入力し，メールで提出してください．手書きの解答の提出など，他の方法での解答は原則認められません．
- 解答用ページを複製したり，同様のページを作成したりしないでください．受験者自身が作成または複製したページに解答を入力しても，その解答は採点されません．
- 問題pdf と解答用ページのリンクは流出させないでください．
- 解答用ページ（グーグルスプレッドシート）をお使いの場合，解答は提出操作の必要はありません．インターネットに接続していれば自動的に保存され，自動保存が提出の代わりになります．そのため，競技中は常にインターネットに接続していてください．接続が切れても構わず解答を続けて構いませんが，競技終了時点までに再接続しなかった場合，最後に接続した時点での解答が採点される可能性があります．

---

- 問題は印刷して閲覧しても，端末上で pdf を閲覧する形でも構いません．両方の方法を併用しても構いません．
- 競技開始後に印刷のためにコンビニなどへ行ったり，プリンターを使用したり，pdf や解答用ページの操作のためにツールをダウンロード・使用したりすることは不正行為ではありません．ただし，その移動・操作に時間がかかっても，競技時間は延長されません．
- 手書き・電子を問わず，メモを取って構いません．pdf内検索をしても構いません．
- 複数の端末を使っても構いません．たとえば問題は pc で閲覧して，解答はスマホ，でも構いません．ただし，問題pdf と解答用ページのリンクの扱いに注意してください．
- 解答用ページはグーグルのサービスであるグーグルスプレッドシートを用いますが，Google アカウントにログインしていなくても解答が可能なように設定してあります．したがって Google アカウントにログインする必要はありません．逆に何らかの Google アカウントにログインしていても構いません（応募に使用した Google アカウントとは別のアカウントにログインしていても構いません）．
- 競技中は飲食自由です．

### 競技中の注意事項

- 問題冊子は10ページまであります．
- 競技時間は120分です．問題は5問あります．どの問題から解いても構いません．
- 競技終了時刻になったら，速やかに解答を終了してください．競技終了時刻以降に入力された解答は採点されません．
- 競技中は**資料や外部の情報源を使用してはいけません**．不正行為が発覚した場合は失格となります．
- 問題について質問がある場合は，質問用 slido にアクセスし，質問を記入してください．

### 解答の注意

- 解答はすべて解答用ページの指定の解答欄に入力してください．
- 小問は全部で54問あります．各小問には問題番号が1から54まで振られており，小問51にはA, Bの2つの解答項目があります．問題番号に対応する解答欄に入力してください．
- 解答欄以外には何も入力しないでください．
- 誤字・脱字がないよう注意深く入力してください．
- 問題文の表記通りに記入してください．

{{< simplebox よくある間違いの例 "ml-4" >}}

「あなたは言語学オリンピックを受験する」と解答すべき部分で，以下のように解答しないでください:

- 「あなたは**げんごがく**オリンピックを受験する」←漢字で書いてください
- 「あなたは言語学**おりんぴっく**を受験する」←カタカナで書いてください
- 「**貴方**は言語学オリンピックを受験する」 ←ひらがなで書いてください

{{< /simplebox >}}

- アラビア数字・アルファベット・スペースは半角で解答してください．

{{< simplebox よくある間違いの例 "ml-4" >}}

「2」と解答すべき部分で，「２」「二」「II」のように解答しないでください．

{{< /simplebox >}}

- 入力がしにくい文字は，代わりの入力法が指示されています．問題中の指示に従ってください．
- 句読点やピリオドは入れても入れなくてもかまいません．
- 大文字と小文字の区別はしなくてかまいません．

### 採点基準について

- 部分点を重視するので，**分かったことがあれば部分的にでも書いてください**．複数の解答が考えられる場合は，最も適切だと予想する解答を書いてください．

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
| --------------------------------------------- | ----------------- |
| 1. alijenga                                   | ←正解 (3 点)     |
| 1. anlijenga / anajenga / nilijenga / lijenga | ←部分点 (2 点)   |
| 1. ninajenga / jenga                          | ←部分点 (1 点)   |
| 1. ninapika                                   | ←得点なし (0 点) |
{{< /table >}}
{{< list class="d-md-none" style="list-style-type: none" >}}

- 1\. alijenga                                    ←正解 (3 点)
- 1\. anlijenga / anajenga / nilijenga / lijenga  ←部分点 (2 点)
- 1\. ninajenga / jenga                           ←部分点 (1 点)
- 1\. ninapika                                    ←得点なし (0 点)
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
| 1. resensei | 2. mlai   | 3. rebuik | ←正解 (3 点)     |
| 1. resensei | 2. remlai | 3. rebuik | ←得点なし (0 点) |
| 1. sensei   | 2. mlai   | 3. buik   | ←得点なし (0 点) |
{{< /table >}}
{{< list class="d-sm-none" style="list-style-type: none" >}}

- 1\. resensei 2. mlai   3. rebuik ←正解 (3 点)
- 1\. resensei 2. remlai 3. rebuik ←得点なし (0 点)
- 1\. sensei   2. mlai   3. buik   ←得点なし (0 点)
{{< /list >}}
{{< /simplebox >}}
