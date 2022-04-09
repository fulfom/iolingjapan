+++
title = "APLO2022監督者"
type = "page"
import = ["js/heic2any.min.js", "js/appsys.js", "js/contest/adminAplo2022.js"]
cdn = ["https://unpkg.com/dexie@latest/dist/dexie.js", "https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/js/lightbox.min.js"]
cdnCSS = ["https://cdnjs.cloudflare.com/ajax/libs/lightbox2/2.11.3/css/lightbox.css"]
+++

<script src="https://unpkg.com/vue@3"></script>

{{< wrap tag=div id="app" >}}
<div class="card">
    <div class="card-header">
        <h5 class="mb-0">リスト</h5>
    </div>
    <ul id="namelist" class="list-group list-group-flush list-fill-link"></ul>
</div>

<div id="portal"></div>

{{< /wrap >}}
