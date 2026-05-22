"use client";

import { logoutAction } from "../actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction} style={{ margin: 0 }}>
      <button className="tf-btn-outline-light" type="submit">
        Déconnexion
      </button>
    </form>
  );
}
