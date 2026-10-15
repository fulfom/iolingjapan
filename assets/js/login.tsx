import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { isSignInWithEmailLink, onAuthStateChanged } from "firebase/auth";
import { FirebaseUIError, initializeUI, providerPopupStrategy, signInWithEmailLink } from "@firebase-oss/ui-core";
import { Button, Card, CardContent, CardHeader, CardSubtitle, CardTitle, Divider, EmailLinkAuthForm, FirebaseUIProvider, GoogleSignInButton, Policies } from "@firebase-oss/ui-react";
import { jaJp } from "@firebase-oss/ui-translations";
import { app, auth } from "./firebase-initialize";

const ui = initializeUI({ app, auth, locale: jaJp, behaviors: [providerPopupStrategy()] });
const emailLink = isSignInWithEmailLink(auth, location.href);
const emailStorageKey = "emailForSignIn";
const goToAccount = () => location.replace("/account/");

// The packaged email form only completes links when the email is in localStorage.
// Keep a confirmation form for links opened on another device or browser, too.
function CompleteEmailSignIn() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const started = useRef(false);

    async function complete(address: string) {
        setBusy(true);
        setError("");
        try {
            await signInWithEmailLink(ui.get(), address.trim(), location.href);
            try { localStorage.removeItem(emailStorageKey); } catch { /* Storage is optional. */ }
            goToAccount();
        } catch (error) {
            setError(error instanceof FirebaseUIError ? error.message : "ログインに失敗しました．メールアドレスとリンクを確認してください．");
        } finally {
            setBusy(false);
        }
    }

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        let savedEmail: string | null = null;
        try { savedEmail = localStorage.getItem(emailStorageKey); } catch { /* Ask for email instead. */ }
        if (savedEmail) {
            setEmail(savedEmail);
            void complete(savedEmail);
        }
    }, []);

    return <div className="fui-screen">
        <Card>
            <CardHeader>
                <CardTitle>メールでログイン</CardTitle>
                <CardSubtitle>メールを受信したアドレスを確認してください．</CardSubtitle>
            </CardHeader>
            <CardContent>
                <form className="fui-form" aria-busy={busy} onSubmit={(event) => {
                    event.preventDefault();
                    void complete(email);
                }}>
                    <label className="login-email-label" htmlFor="login-email">メールアドレス</label>
                    <input id="login-email" className="form-control" type="email" autoComplete="email" required
                        value={email} onChange={(event) => setEmail(event.target.value)} disabled={busy} />
                    <Policies />
                    <Button type="submit" disabled={busy}>{busy ? "ログイン中…" : "ログイン"}</Button>
                    {error && <p className="fui-error" role="alert">{error}</p>}
                    <a href="/login/">ログイン用メールを再送する</a>
                </form>
            </CardContent>
        </Card>
    </div>;
}

function Login() {
    const [authError, setAuthError] = useState(false);
    useEffect(() => onAuthStateChanged(auth, (user) => {
        if (user) goToAccount();
        else document.body.style.opacity = "1";
    }, () => {
        document.body.style.opacity = "1";
        setAuthError(true);
    }), []);

    return <FirebaseUIProvider ui={ui} policies={{
        termsOfServiceUrl: "/term-of-service/",
        privacyPolicyUrl: "/privacy-policy/",
    }}>
        <Card>
            {authError && <p className="fui-error" role="alert">認証状態を確認できませんでした．ページを再読み込みしてください．</p>}
            <GoogleSignInButton onSignIn={goToAccount} />
            <Divider></Divider>
            {emailLink ? <CompleteEmailSignIn /> :
                <EmailLinkAuthForm onSignIn={goToAccount} />
            }
        </Card>
    </FirebaseUIProvider>;
}

createRoot(document.getElementById("login-app")!).render(<Login />);
