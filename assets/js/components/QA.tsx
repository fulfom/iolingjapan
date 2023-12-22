import { MessageList, QuestionList } from "./QuestionList";
import React, { createContext, useContext, useEffect, useState } from "react";
import QuestionForm from "./QuestionForm";
import { AuthProvider } from './AuthProvider';

function QA({ contId, site }: { contId: string, site: string }) {
    return <>
        <AuthProvider>
            <h3>訂正・よくある質問</h3>
            <MessageList contId={contId} site={site}></MessageList>
            <h3>自分の質問</h3>
            <QuestionForm contId={contId} site={site} type="question"></QuestionForm>
            <QuestionList contId={contId} site={site} ></QuestionList>
        </AuthProvider>
    </>
}

export default QA
