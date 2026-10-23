import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase-initialize";

const goToAccount = () => location.replace("/account/");

function loginError(error: unknown): string {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case "auth/invalid-email":
                return "メールアドレスの形式を確認してください．";
            case "auth/invalid-credential":
            case "auth/invalid-login-credentials":
            case "auth/user-not-found":
            case "auth/wrong-password":
            case "auth/user-disabled":
                return "ログインできませんでした．ID（メールアドレス）とパスワードを確認してください．";
            case "auth/too-many-requests":
                return "試行回数が多すぎます．しばらく時間をおいてから再度お試しください．";
            case "auth/network-request-failed":
                return "通信に失敗しました．インターネット接続を確認して再度お試しください．";
            case "auth/operation-not-allowed":
                return "パスワードでのログインを利用できません．管理者にお問い合わせください．";
        }
    }
    return "ログインに失敗しました．時間をおいてから再度お試しください．";
}

function PasswordLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const submitting = useRef(false);

    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) goToAccount();
        else {
            document.body.style.opacity = "1";
            setReady(true);
        }
    }, () => {
        document.body.style.opacity = "1";
        setError("認証状態を確認できませんでした．ページを再読み込みしてください．");
    }), []);

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!ready || submitting.current) return;
        submitting.current = true;
        setBusy(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            goToAccount();
        } catch (error) {
            setError(loginError(error));
        } finally {
            submitting.current = false;
            setBusy(false);
        }
    }

    return <form onSubmit={login} aria-busy={!ready || busy}>
        <fieldset disabled={!ready || busy}>
            <legend>ID とパスワードでログイン</legend>
            <div className="form-group">
                <label htmlFor="login-email">ID（メールアドレス）</label>
                <input id="login-email" name="email" className="form-control" type="email"
                    autoComplete="username" autoCapitalize="none" spellCheck={false} required
                    value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="login-password">パスワード</label>
                <input id="login-password" name="password" className="form-control" type="password"
                    autoComplete="current-password" required
                    value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <p><button className="btn btn-primary" type="submit">
                {busy ? "ログイン中…" : "ログイン"}
            </button></p>
        </fieldset>
        {error && <p className="text-danger" role="alert">{error}</p>}
        <p><a href="/login/">Google アカウント・メールリンクでログインする</a></p>
    </form>;
}

createRoot(document.getElementById("login-app")!).render(<PasswordLogin />);
