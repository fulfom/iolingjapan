+++
title = "APLO2022監督者"
type = "page"
import = ["js/heic2any.min.js", "js/appsys.js", "js/contest/adminAplo2022.js"]
cdn = ["https://unpkg.com/vue-easy-lightbox@next/dist/vue-easy-lightbox.umd.min.js"]
+++

<script src="https://unpkg.com/vue@3"></script>

<div id="loading">読み込み中</div>

{{< wrap tag=div id="app" >}}
<h2>参加者リスト</h2>

{{< table class="mb-1 simple-table" >}}
| 確認切替             ||                      |
| -------- | ---------- | -------------------- |
| PRE      | 競技開始時 | 身分証・シール・合言葉               |
| POST     | 競技終了時 | 問題1～5とアンケート |
{{< /table >}}

<div class="btn-group" role="group" aria-label="Confirmation Target">
  <template v-for="(item, i) in CONFIRMATION_TARGETS">
    <input type="radio" class="btn-check" name="btnradio" :id="`btnradio${item}`" autocomplete="off" v-model="confirmationTarget" :value="item">
    <label class="btn btn-outline-primary btn-small" :for="`btnradio${item}`">{{item + " " + confirmNum[i]}}</label>
  </template>
</div>

<table class="table">
  <thead>
    <tr>
      <th scope="col">確認</th>
      <th scope="col">担当</th>
      <th scope="col">画像</th>
      <th scope="col">名前</th>
      <th scope="col">補足</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in studentlist" :key="item.key">
      <td nowrap>
        <div class="form-check">
            <input class="form-check-input" type="checkbox"
                :checked="item.confirm?.[confirmationTarget]"
                @change="confirmFormAnswers($event, item.key)"
                :id="`confirm${item.key}`"
            >
            <label class="form-check-label" :for="`confirm${item.key}`">
                確認
            </label>
        </div>
      </td>
      <td>{{item.default}}</td>
      <td>
        <button class="btn btn-small btn-secondary m-0" @click="uidToFilterImages = item.key; showImg(0)">画像</button>
        <button class="btn btn-small btn-outline-secondary m-0" data-bs-toggle="modal" data-bs-target="#editFormAnswersModal" @click="uidToFilterImages = item.key;">url</button>
        <p class="mb-0">{{imageItems.filter(e => e.uid == item.key).length}}</p>
      </td>
      <td>{{(item.num || "000") + " " + item.name}}<br>{{item.nameRoman}}</td>
      <td>
        <textarea class="form-control" :value="item.memo" @change="memo($event, item.key)" ></textarea>
      </td>
    </tr>
  </tbody>
</table>
<!-- Modal -->
<div class="modal fade" id="editFormAnswersModal" tabindex="-1" aria-labelledby="editFormAnswers" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editFormAnswers">画像URL</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">問題</th>
                        <th scope="col">URL</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in imageItemsLimited">
                        <td nowrap>{{item.title}}</td>
                        <td><button class="btn btn-small btn-secondary" @click="copyToClipboard(item.src)">Copy</button><p class="mb-0" style="word-break: break-all">{{item.src}}</p></td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  </div>
</div>
<vue-easy-lightbox
    :visible="visible"
    :imgs="imageItemsLimited"
    :index="index"
    @hide="handleHide"
></vue-easy-lightbox>

{{< /wrap >}}

<style lang='scss'>
    .vel-img-title{
        font-size: x-large;
        color: white;
        opacity: 1;
    }

</style>
