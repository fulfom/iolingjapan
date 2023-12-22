import { push, ref, serverTimestamp } from 'firebase/database';
import React, { ComponentProps, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAuthContext } from './AuthProvider';
import { db } from '@js/firebase-initialize';
import { QuestionType } from './Question';

function QuestionForm({ contId, site, type }: { contId: string, site: string, type: "question" | "message" }) {
    const [questionContent, setQuestionContent] = useState('');
    const user = useAuthContext();

    // useEffect(() => {
    //     console.log("qf", user)
    // }, [user])

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (questionContent === "") {
            return;
        }
        if (!user) {
            return;
        }
        switch (type) {
            case "question":
                await push(ref(db, `/contests/${contId}/qa/${site}/posts/`), {
                    poster: user.uid,
                    question: {
                        content: questionContent,
                        likes: 0,
                        timestamp: serverTimestamp(),
                    }
                });
                break;
            case "message":
                await push(ref(db, `/contests/${contId}/qa/${site}/messages/`), {
                    content: questionContent,
                    likes: 0,
                    timestamp: serverTimestamp(),
                });
                break;
        }
        setQuestionContent('');
    };

    const placeholder = type === "question" && "質問を入力" || "message" && "連絡を入力" || ""

    return (
        <Form onSubmit={handleSubmit} onKeyDown={(e) => {
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
            <Button type="submit">送信</Button> (Ctrl+Enter / ⌘ + Enter)
        </Form>
    );
};

export default QuestionForm;
