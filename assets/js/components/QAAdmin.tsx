/**
 * posts からリストを取ってくる
 * 選択→返答の記入→状態の選択（public: boolean）→replys にアップロード
 * 訂正とfaqを管理する messages
 */

// 公開済みのリスト

// 未公開の質問一覧

/**
 * 元の質問 originalQuestion > posts.question
 * 返答 replyToOriginalQuestion > posts.reply
 * 編集した質問 editedQuestion < 初期値を originalQuestion からコピペ
 * 返答 replyToEditedQuestion < 初期値を replyToOriginalQuestion からコピペ
 */

import { MessageList, QuestionList } from "./QuestionList";
import React, { useEffect, useMemo, useState } from "react";
import QuestionForm from "./QuestionForm";
import { AuthProvider, useAuthContext } from './AuthProvider';
import { useList } from "react-firebase-hooks/database";
import { equalTo, orderByChild, push, query, ref, runTransaction, serverTimestamp } from "firebase/database";
import { db } from "@js/firebase-initialize";
import { Post, QuestionType } from "./Question";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale/ja";
import { Button, Card, Fade, Form } from "react-bootstrap";

function EditForm({ contId, site, dataKey, type, initialValue, setIsEditing }: { contId: string, site: string, dataKey: string | null, type: "reply" | "message", initialValue: string, setIsEditing: (arg0: boolean) => (void) }) {
    const [questionContent, setQuestionContent] = useState(initialValue);
    const user = useAuthContext();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (questionContent === "") {
            return;
        }
        if (!user) {
            return;
        }
        switch (type) {
            case "reply":
                await runTransaction(ref(db, `/contests/${contId}/qa/${site}/posts/${dataKey}/reply`), (post) => ({
                    content: questionContent,
                    likes: post ? post.likes : 0,
                    timestamp: serverTimestamp(),
                }));
                setIsEditing(false);
                break;
            case "message":
                await runTransaction(ref(db, `/contests/${contId}/qa/${site}/messages/${dataKey}`), (post) => ({
                    content: questionContent,
                    likes: post.likes,
                    timestamp: serverTimestamp(),
                }));
                setIsEditing(false);
                break;
        }
        setQuestionContent('');
    };

    const placeholder = type === "reply" && "返答を入力" || "message" && "連絡を編集" || ""
    return <Form onSubmit={handleSubmit} onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { handleSubmit(e) }
        if (e.key === "Enter") { e.preventDefault() }
    }}>
        <Form.Group controlId="formQuestion">
            <Form.Control
                as="textarea" rows={1}
                value={questionContent}
                placeholder={placeholder}
                onChange={(e) => setQuestionContent(e.target.value)}
                onInput={(e) => {
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = "0";
                    const scrollHeight = textarea.scrollHeight;
                    //textareaの高さに入力内容の高さを設定
                    textarea.style.height = scrollHeight + 'px';
                }}
                className="p-4"
                autoComplete='off'
                style={{
                    overflow: "hidden",
                    overflowWrap: "break-word",
                    textAlign: "start",
                    resize: "none",
                }}
            />
        </Form.Group>
        <Button type="submit">送信</Button>(Ctrl+Enter / ⌘ + Enter)
    </Form>
}

function MessagePost({ post, contId, site, dataKey }: { post: Post, contId: string, site: string, dataKey: string | null }) {
    const [postTime, setPostTime] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const postMemo = useMemo(() => (post), [post.timestamp, post.content, post.likes, post.cancel]);

    useEffect(() => {
        setPostTime(formatDistanceToNow(postMemo.timestamp, { locale: ja, includeSeconds: true, addSuffix: true }))
        const id = setInterval(() => {
            setPostTime(formatDistanceToNow(postMemo.timestamp, { locale: ja, includeSeconds: true, addSuffix: true }))
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [post.timestamp])

    const handleOnClick = () => {
        setIsEditing(!isEditing);
    }

    return <Card bg={"light"}>
        <Card.Body className="">
            <div className='d-flex'>
                <Card.Body className="p-0">
                    <p className="mb-2 text-muted small">{postTime}</p>
                    <div>
                        {isEditing ? <div>
                            <EditForm contId={contId} site={site} dataKey={dataKey} type="message" initialValue={postMemo.content} setIsEditing={setIsEditing}></EditForm>
                        </div> : postMemo.content}
                        {/* {postMemo.cancel ? <p className='mb-0 mt-2 text-muted small'>この質問を取り消しました</p> : <></>} */}
                    </div>
                </Card.Body>
                <Button
                    variant='secondary'
                    className='flex-shrink-0 ms-auto mb-auto mt-0 btn-small'
                    onClick={handleOnClick}
                >{isEditing ? <i className="fas fa-times"></i> : "編集"}</Button>
            </div>

        </Card.Body>
    </Card>
}

function MessageListAdmin({ contId, site }: { contId: string, site: string }) {
    const [messages, messagesloading, messageserror] = useList(query(ref(db, `/contests/${contId}/qa/${site}/messages/`), orderByChild("timestamp")))

    return (
        <div className="mb-3">
            {messages && messages.length ? messages.toReversed().map((post) => (
                <MessagePost key={post.key} post={{ ...post.val() }} contId={contId} site={site} dataKey={post.key}></MessagePost>
            )) : <div>訂正・よくある質問はありません</div>}
        </div>
    )
}

function PostCardAdmin({ post, type, poster }: { post: Post, type: "q" | "a", poster: string }) {
    const [postTime, setPostTime] = useState("");

    const postMemo = useMemo(() => (post), [post.timestamp, post.content, post.likes, post.cancel]);

    useEffect(() => {
        setPostTime(formatDistanceToNow(postMemo.timestamp, { locale: ja, includeSeconds: true, addSuffix: true }))
        const id = setInterval(() => {
            setPostTime(formatDistanceToNow(postMemo.timestamp, { locale: ja, includeSeconds: true, addSuffix: true }))
        }, 1000)
        return () => clearInterval(id)
    }, [post.timestamp])

    if (type === "q") {
        return <Card bg="light" className='m-0'>
            <div className='d-flex'>
                <Card.Body className="p-0">
                    <p className="mb-2 text-muted small">{postTime} 投稿者: <span className="user-select-all">{poster}</span></p>
                    <div>
                        {postMemo.content}
                        {/* {postMemo.cancel ? <p className='mb-0 mt-2 text-muted small'>この質問を取り消しました</p> : <></>} */}
                    </div>
                </Card.Body>
            </div>
            {/* <Button onClick={() => onLike(question.id)}>いいね ({question.likes})</Button> */}
        </Card>
    }
    else {
        return <Card bg="light" className='m-0'>
            <Card.Body className="">
                <p className="mb-2 text-muted small"><i className='fas fa-reply fa-fw fa-rotate-180'></i>{postTime}</p>
                <div>
                    {postMemo.content}
                </div>
            </Card.Body>
            {/* <Button onClick={() => onLike(question.id)}>いいね ({question.likes})</Button> */}
        </Card>
    }
}

export const QuestionAdmin = ({ dataKey, question, contId, site }: { dataKey: string | null, question: QuestionType, contId: string, site: string }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    return <Card body bg='light'>
        <div className='d-flex'>
            <PostCardAdmin post={question.question} type="q" poster={question.poster} />
            <Button variant="primary" className="flex-shrink-0 ms-auto mb-auto mt-0 btn-small" onClick={handleEdit}>{isEditing ? <i className="fas fa-times"></i> : "返答する"}</Button>
        </div>
        {isEditing ? <div>
            <EditForm contId={contId} site={site} dataKey={dataKey} type="reply" initialValue={question.reply && question.reply.content || ""} setIsEditing={setIsEditing}></EditForm>
        </div> : (question.reply && question.reply.content ? <PostCardAdmin post={question.reply} type="a" poster={question.poster} /> :
            <p className="mt-2 mb-0 small text-muted">未返答</p>)}
    </Card >
};

export function QuestionListAdmin({ contId, site }: { contId: string, site: string }) {
    // const user = useAuthContext();
    const [questions, loading, error] = useList(query(ref(db, `/contests/${contId}/qa/${site}/posts/`)))

    const [limitToBeReplyed, setLimitToBeReplyed] = useState(false);
    const [limitPoster, setLimitPoster] = useState("");

    const visibleQuestions = questions?.filter((v) => (v.val() &&
        (!limitToBeReplyed || !v.val().reply) &&
        (!limitPoster || v.val().poster === limitPoster) &&
        (!v.val().question.cancel)
    ))

    const clearLimitations = () => {
        setLimitToBeReplyed(false);
        setLimitPoster("");
    }

    return (
        <div className='mb-3'>
            <div className="d-flex">
                <Button variant="secondary" onClick={() => setLimitToBeReplyed(!limitToBeReplyed)}>{limitToBeReplyed ? "未返答に絞らない" : "未返答に絞る"}</Button>
                <Button variant="secondary" className="ms-auto" onClick={clearLimitations}>CLEAR</Button>
            </div>
            <div className="d-flex align-items-baseline">
                <p className="flex-shrink-0 me-2">投稿者</p>
                <Form.Control type="text" onChange={(e) => setLimitPoster(e.target.value)} />
            </div>
            <p>条件: {limitToBeReplyed && "未返答"} {limitPoster && `投稿者=${limitPoster}`}</p>
            {!loading ? visibleQuestions && visibleQuestions.length ? visibleQuestions.toReversed().map((questionSnapshot) => (
                <QuestionAdmin
                    key={questionSnapshot.key}
                    dataKey={questionSnapshot.key}
                    question={questionSnapshot.val()}
                    contId={contId} site={site}
                />)
            ) : <div>個別の質問はありません</div> : <>読み込み中</>}
        </div>
    );
};

function QAAdmin({ contId, site }: { contId: string, site: string }) {
    return <>
        <AuthProvider>
            <h3>訂正・よくある質問</h3>
            <MessageListAdmin contId={contId} site={site}></MessageListAdmin>
            <QuestionForm contId={contId} site={site} type="message"></QuestionForm>
            <h3>個別の質問</h3>
            <QuestionListAdmin contId={contId} site={site} />
        </AuthProvider>
    </>
}

export default QAAdmin