"use client";

import { useFormStatus } from "react-dom";
import { addProject } from "../actions/projects";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="tf-btn-primary" type="submit" disabled={pending}>
      {pending ? "Création..." : "+ Nouveau projet"}
    </button>
  );
}

export default function AddProjectForm() {
  return (
    <form className="tf-form-row" action={addProject}>
      <input
        className="tf-input"
        name="name"
        placeholder="Nom du projet"
        required
        style={{ minWidth: "min(100%, 220px)", flex: "1 1 200px" }}
      />
      <input
        className="tf-color-input"
        name="color"
        type="color"
        defaultValue="#3498db"
        aria-label="Couleur du projet"
      />
      <SubmitButton />
    </form>
  );
}
