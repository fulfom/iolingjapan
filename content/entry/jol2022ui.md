+++
title = "JOL2022応募情報確認"
type = "page"
import = ["js/appsys.js", "js/entry/common.js", "js/entry/jol2022ui.js"]
importCSS = ["scss/loaded.scss"]
draft = true
+++

### 参加枠

{{< wrap tag=div class="row" id="app-selecct-spot" >}}
{{< wrap tag=div class="card col-6" >}}
<!-- <button id="select-spot-flag" onclick="updateSpot('flag')" class="btn btn-template-main w-100"><i class="fas fa-flag fa-fw"></i>選抜</button> -->
<button id="select-spot-flag" class="btn btn-template-main w-100"><i class="fas fa-flag fa-fw"></i>選抜</button>

- 参加資格: 20歳未満かつ大学未入学
- 日本代表選抜の対象
{{< /wrap >}}
{{< wrap tag=div class="card col-6" >}}
<!-- <button id="select-spot-award" onclick="updateSpot('award')" class="btn btn-template-main w-100"><i class="fas fa-circle-notch fa-fw"></i>オープン</button> -->

<button id="select-spot-award" class="btn btn-template-main w-100"><i class="fas fa-circle-notch fa-fw"></i>オープン</button>

- 参加資格: 不問
- 日本代表選抜の対象ではない
{{< /wrap >}}

### {{< icon user-edit 個人情報 >}} {#h-cont-info}

<div id="app-cont-info" class="mb-4">
    <form onsubmit="infoSubmit(); return false;" class="needs-validation">
    <!-- <form onsubmit="proceed(1,2); return false;" class="needs-validation"> -->
        <input disabled id="input-spot" hidden>
        <div class="form-group">
          <label for="input-email">メールアドレス</label>
          <input readonly type="email" class="form-control user-email" id="input-email" aria-describedby="input-emailHelp">
          <small id="input-emailHelp" class="form-text text-muted">変更不可</small>
        </div>
        <div class="form-group was-validated">
          <label for="input-name">氏名(フルネーム)</label>
          <input disabled required class="form-control" id="input-name">
          <small id="input-name-roman-help" class="form-text text-muted">郵送時の宛名・賞状への記名に用います．</small>
        </div>
        <div class="form-group was-validated">
            <label for="input-name-roman">氏名(ローマ字)</label>
            <input disabled required pattern="^[0-9A-Za-z\s]+$" class="form-control" id="input-name-roman" aria-describedby="input-name-roman-help">
            <small id="input-name-roman-help" class="form-text text-muted">半角英数．例) Namae Myouji / MYOUJI Namae<br>こちらで大文字小文字・スペースなどを調整した後，賞状への記名に用います．名字名前の順番やスペルが希望通りか確認してください．</small>
        </div>
        <div id="form-birthdate" class="form-group was-validated">
            <label for="input-birthdate">生年月日</label>
            <input disabled required min="2002-07-27" type="date" class="form-control" id="input-birthdate">
            <div class="invalid-feedback">2002年7月27日以降の生まれである必要があります．</div>
        </div>
        <div class="form-group was-validated spot-award-delete">
            <div class="form-check">
                <input disabled required type="checkbox" class="form-check-input" id="input-pre-university" aria-describedby="input-pre-university-help">
                <label class="form-check-label" for="input-pre-university">現在私は大学教育を受けたことがありません</label>
                <small id="input-pre-university-help" class="form-text text-muted">参加資格確認</small>
            </div>
        </div>
        <div class="form-group was-validated spot-award-delete">
            <label for="input-school-name">現在の所属学校名</label>
            <input disabled required type="text" class="form-control" id="input-school-name" aria-describedby="input-school-name-help">
            <small id="input-school-name-help" class="form-text text-muted">正式名称を略さずに記入．所属していなければ「なし」</small>
        </div>
        <div class="form-group was-validated spot-award-delete">
            <label for="input-grade">現在の学年</label>
            <input disabled required type="number" class="form-control" id="input-grade" aria-describedby="input-grade-help">
            <small id="input-grade-help" class="form-text text-muted">数字．所属していなければ-1</small>
        </div>
        <div class="form-group was-validated">
            <label for="input-zipcode">郵便番号</label>
            <input disabled required pattern="^[0-9]+$" class="form-control" id="input-zipcode" aria-describedby="input-zipcode-help">
            <small id="input-zipcode-help" class="form-text text-muted"></small>
        </div>
        <div class="form-group was-validated">
            <label for="input-address">住所</label>
            <input disabled required class="form-control" id="input-address" aria-describedby="input-address-help">
            <small id="input-address-help" class="form-text text-muted">賞状の送付に使用します．</small>
        </div>
        <div class="form-group was-validated spot-award-delete">
            <div class="form-check">
                <input required disabled type="checkbox" class="form-check-input" id="input-pa" aria-describedby="input-pa-help">
                <label class="form-check-label" for="input-pa">JOL2022への参加にあたって私は保護者に有効な同意を得ています</label>
            </div>
        </div>
        <!-- <button id="update-info" type="submit" disabled class="btn btn-template-primary w-100">更新する</button> -->
      </form>
</div>
{{< /wrap >}}
