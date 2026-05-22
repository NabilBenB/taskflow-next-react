"use client";

import { useActionState } from "react";
import { login } from "../actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="tf-main-inner">
      <div className="tf-card tf-card--narrow" style={{ marginTop: "1.5rem" }}>
        <h1 className="tf-page-title tf-accent-title" style={{ marginBottom: "0.25rem" }}>
          TaskFlow
        </h1>
        <p className="tf-page-sub" style={{ marginBottom: "1.25rem" }}>
          Connectez-vous pour continuer
        </p>

        {state?.error && <p className="tf-error">{state.error}</p>}

        <form action={formAction} className="tf-form-stack">
          <input
            className="tf-input"
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
          <input
            className="tf-input"
            name="password"
            type="password"
            placeholder="Mot de passe"
            required
            autoComplete="current-password"
          />
          <button className="tf-btn-primary" type="submit" disabled={pending}>
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
