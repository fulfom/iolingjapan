import { Accordion } from "react-bootstrap";
import React from "react";

export const emails = <div className="simple-box">
    <span className="box-title">応募者向けメール履歴</span>
    <Accordion flush>
        {/* <Accordion.Item eventKey="3">
            <Accordion.Header as="p">2024/01/22 17:30: JOL2024結果発表</Accordion.Header>
            <Accordion.Body>
                <p className="mb-3">JOL2024応募者のみなさま，</p>
                <p className="mb-3">JOL2024の結果を公開いたしました．</p>
                <p>個人成績: <a href="https://iolingjapan.org/result/jol2024/">https://iolingjapan.org/result/jol2024/</a></p>
                <p className="mb-3">全体結果: <a href="https://iolingjapan.org/record-jol/">https://iolingjapan.org/record-jol/</a></p>
                <p className="mb-3">採点結果の最終調整のため，結果発表が遅れましたことをお詫び申し上げます．</p>
                <p className="mb-3">問題は楽しんでいただけたでしょうか？</p>
                <p className="mb-3">再ダウンロードできるリンクをお送りします．諸事情のため，問題はまだ公式サイトに公開できませんが，参加者同士であれば中身について話し合っても構いません（SNS等での共有はまだできません）．競技中時間がなくて解けなかった問題など，じっくり解きなおしてみると楽しいと思います．</p>
                <p className="mb-3">問題: <a href="https://drive.google.com/file/d/1RbPcK0RFvl56PbhXNXzNSEzBgT8vlo90/view">https://drive.google.com/file/d/1RbPcK0RFvl56PbhXNXzNSEzBgT8vlo90/view</a></p>
                <p className="mb-3">※なお，第5問について，誤植がありました．心よりお詫び申し上げます．この点について採点基準の調整は済んでいます．</p>
                <p className="mb-3">11. 誤: atupa sia re woban; 正: atupa sia ye woban;</p>
                <p className="mb-3">これからもより良い問題を作成し，言語学の世界や世界の言語への間口が広がるかもしれない機会を提供できるよう取り組み続けていきたいと思います．</p>
                <p className="mb-3">今後とも言語学オリンピックをよろしくお願いいたします．</p>
                <p>国際言語学オリンピック日本委員会</p>

            </Accordion.Body>
        </Accordion.Item>*/}
        {/* <Accordion.Item eventKey="2">
            <Accordion.Header as="p">2024/12/29 8:00頃: JOL2025競技会場ページ公開</Accordion.Header>
            <Accordion.Body>
                <p className="mb-3">JOL2025応募者のみなさま，</p>
                <p className="mb-3">JOL2025本番で使う競技会場ページを公開いたしました．</p>
                <p>競技会場ページで待機の上，問題pdfが閲覧できるようになったら各自解き始めてください．</p>
                <p className="mb-3">配信にタイムラグがあることを踏まえて，12:59～13:00の間に配信します．</p>
                <p className="mb-3"><a href="https://iolingjapan.org/contest/jol2025/contest/">https://iolingjapan.org/contest/jol2025/contest/</a></p>
                <p className="mb-3">※ログインが必要です．ログインしてもアクセスできない場合，メールアドレスを間違えている可能性があります．その場合は，このメールを受け取ったメールアドレスでログインしなおしてみてください．</p>
                <p className="mb-3">2点重要な注意事項をお知らせします．</p>
                <p><strong>不正行為について</strong></p>
                <p>不正行為は偽計業務妨害にあたり，違法行為です．</p>
                <p>ここ数年間のオンライン競技で，不正行為によって失格した者はゼロではありません．</p>
                <p>競技者本人が，他者の助けを得たり，外部資料を参照したりすることなく参加してください．</p>
                <p>不正行為が疑われる場合，所属校にその旨を通知するなどの処置を取ります．</p>
                <p>不正行為が疑われる場合には追加調査を行う可能性がありますが，追加調査に協力しなかった場合は失格とします．</p>
                <p className="mb-3"></p>
                <p><strong>問題pdfと解答用ページ閲覧のトラブルについて</strong></p>
                <p>事前準備ページで問題pdfと解答用ページが閲覧・操作できている方は問題ありません．</p>
                <p>事前準備ページで動作確認を行っていない場合，競技時間中にトラブルが生じても対応しきれない可能性があります．</p>
                <p className="mb-3">そのほか，動作確認期間中にいただいたよくある質問の解答を掲載いたします．</p>
                <ul>
                    <li>紙の受験票は送付していません．</li>
                    <li>スマホアプリでスプレッドシートを編集する際はGoogleアカウントへのログインが必要なようです．なんらかのアカウントでログインの上お使いください（アカウントはJOL応募アカウントと無関係なものでも，新しく作ったものでも構いません）．</li>
                    <li>解答用ページ（グーグルスプレッドシート）は提出操作不要です．競技時間が終了したら解答用ページと競技会場を閉じて解散して構いません．</li>
                    <li>↑が使えず，代わりに解答用エクセルをダウンロードして記入した場合に限り，競技時間内に解答用エクセルのメール提出が必要です．詳しくは競技会場ページの「（予備）解答用ページが使えない場合」を押して案内をお読みください．</li>
                    <li>問題pdfの印刷の際に，プリンターのトラブルが生じたなどの理由で，問題を解く以外の範囲で他者の助けを借りるのは構いません．</li>
                </ul>
                <p>なにかトラブルが生じた場合は委員会にお問い合わせください．</p>
                <p className="mb-3"><a href="mailto:jol@iolingjapan.org">jol@iolingjapan.org</a></p>
                <p className="mb-3">それでは，本番お楽しみください．よろしくお願いいたします．</p>
                <p>国際言語学オリンピック日本委員会</p>

            </Accordion.Body>
        </Accordion.Item> */}
        {/* <Accordion.Item eventKey="0">
            <Accordion.Header as="p">2024/12/20 09:00頃: 日本言語学オリンピック JOL2025事前準備ページ公開 & 今後のスケジュール</Accordion.Header>
            <Accordion.Body>
                <p className="mb-3">JOL2025応募者のみなさま，</p>
                <p className="mb-3">このたびは日本言語学オリンピックにご応募いただきありがとうございます．</p>
                <p className="mb-3">今後のスケジュールについてご連絡いたします．</p>
                <ul className="mb-3">
                    <li>12月20日「JOL2025事前準備」ページ公開</li>
                    <li>12月20日～28日 動作確認期間</li>
                    <li>12月29日 「JOL2025競技会場」ページ公開</li>
                </ul>
                <p className="mb-3">まず，本日公開の「JOL2025事前準備」ページでは，当日とほとんど同じ環境で競技の体験ができるようになっています．具体的には1. 問題（体験版）pdfの閲覧，2. 解答の入力（スプレッドシートまたはエクセル），3. 競技中の質問投稿・訂正の確認，4. 当日の流れと注意事項の説明，以上4点が可能です．</p>
                <p>ごくまれに問題が閲覧できないなどのトラブルがありますので，あらかじめ事前準備ページにアクセスしていただき，動作確認と練習を行っていただくようお願いいたします．</p>
                <p className="mb-3">事前準備ページ: <a href="https://iolingjapan.org/contest/jol2025/demo/">https://iolingjapan.org/contest/jol2025/demo/</a></p>
                <p className="mb-3">※ログインが必要です．ログインしてもアクセスできない場合，メールアドレスを間違えている可能性があります．その場合は，このメールを受け取ったメールアドレスでログインしなおしてみてください．</p>
                <p className="mb-3">29日になりましたら，「JOL2025競技会場」ページが公開されます．12時30分～競技開始までの間にこちらのページにアクセスしてください．13:00になりましたら競技がスタートし，問題pdfの閲覧と解答入力が可能になります．2時間楽しんでいただければ幸いです．</p>
                <p className="mb-3">15:00になりましたら，競技終了・解散となります．結果は競技3週間後をめどに発表する予定です．</p>
                <p className="mb-3">解答入力の方法など，細かい点は事前練習ページに記載の案内をご確認ください．</p>
                <p className="mb-3">それでは，よろしくお願いいたします．</p>
                <p>国際言語学オリンピック日本委員会</p>
            </Accordion.Body>
        </Accordion.Item> */}
    </Accordion>
</div>