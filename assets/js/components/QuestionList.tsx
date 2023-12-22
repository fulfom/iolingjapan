import React, { useContext, useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react';
import { Question, PostCard, QuestionType, Message } from './Question';
import { useAuthContext } from './AuthProvider';
import { equalTo, orderByChild, query, ref, runTransaction, update } from 'firebase/database';
import { useList, useListVals, useObjectVal } from 'react-firebase-hooks/database'
import { db } from '@js/firebase-initialize';

export function MessageList({ contId, site }: { contId: string, site: string }) {
    const [messages, messagesloading, messageserror] = useList(query(ref(db, `/contests/${contId}/qa/${site}/messages/`), orderByChild("timestamp")))

    return (
        <div className='mb-3'>
            {!messagesloading ? messages && messages.length ? messages.toReversed().map((question) => (
                <Message key={question.key} message={question.val()} contId={contId} />
            )) : <div>訂正・よくある質問はありません</div> : <>読み込み中</>}
        </div>
    )
}

export function QuestionList({ contId, site }: { contId: string, site: string }) {
    const user = useAuthContext();
    const [questions, loading, error] = useList(query(ref(db, `/contests/${contId}/qa/${site}/posts/`), orderByChild("poster"), equalTo(user!.uid)))

    const cancel = async (key: string) => {
        if (!key) return;
        await runTransaction(ref(db, `/contests/${contId}/qa/${site}/posts/${key}/question/cancel`), (cancel: boolean) => {
            return !cancel
        })
        return;
    }

    return (
        <div className='mb-3'>
            {!loading ? questions && questions.length ? questions.toReversed().map((questionSnapshot) => (
                <Question key={questionSnapshot.key} question={questionSnapshot.val()} contId={contId} cancel={() => cancel(questionSnapshot.key || "")} />)
            ) : <div>自分の質問はありません</div> : <>読み込み中</>}
        </div>
    );
};