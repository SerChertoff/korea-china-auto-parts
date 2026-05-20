import { Navigate, useSearchParams } from 'react-router-dom'

/** Страница результатов поиска перенаправляет в каталог с тем же query */
export default function SearchResultsPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  return <Navigate to={q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog'} replace />
}
