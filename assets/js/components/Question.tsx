import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { toHms } from '@js/utility/toHms';
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { ref, update } from 'firebase/database';
import { db } from '@js/firebase-initialize';

export type Post = {
    content: string;
    likes: number;
    timestamp: Date;
    cancel?: boolean;
}
export type QuestionType = {
    poster: string;
    question: Post;
    reply?: Post;
};


export const PostCard = ({ post, type, editable = false, cancel }: { post: Post, type: "q" | "a", editable?: boolean, cancel?: () => (void) }) => {
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
                    <p className="mb-2 text-muted small">{postTime}</p>
                    <div>
                        {postMemo.content}
                        {postMemo.cancel ? <p className='mb-0 mt-2 text-muted small'>この質問を取り消しました</p> : <></>}
                    </div>
                </Card.Body>
                {editable ?
                    <Button
                        variant='secondary'
                        className='flex-shrink-0 ms-auto mb-auto mt-0 btn-small'
                        onClick={cancel}
                    >{!postMemo.cancel ? "取消" : "再投稿"}</Button> : <></>}
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

export const Question = ({ question, contId, cancel }: { question: QuestionType, contId: string, cancel: () => {} }) => {
    return <Card body bg='light' border={question.reply && "success"} style={{ borderWidth: "4px" }}>
        <PostCard post={question.question} type="q" editable={!question.reply} cancel={cancel}></PostCard>
        {question.reply ? <PostCard post={question.reply} type="a"></PostCard> : <></>}
    </Card >
};

export const Message = ({ message, contId }: { message: Post, contId: string }) => {
    return <Card body bg='light'>
        <PostCard post={message} type="q"></PostCard>
    </Card>
}
