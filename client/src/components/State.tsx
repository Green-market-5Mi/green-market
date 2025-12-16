export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="state state--loading">
      <div className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state state--error" role="alert">
      <strong>Erreur</strong>
      <div>{message}</div>
    </div>
  )
}

export function Empty({ label = 'Aucun résultat.' }: { label?: string }) {
  return <div className="state state--empty">{label}</div>
}
