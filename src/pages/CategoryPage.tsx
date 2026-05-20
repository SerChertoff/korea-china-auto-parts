import { Navigate, useParams } from 'react-router-dom'
import { PART_CATEGORIES } from '../data/categories'

/** Редирект в каталог по slug категории */
export default function CategoryPage() {
  const { slug } = useParams()
  const cat = PART_CATEGORIES.find((c) => c.slug === slug || c.id === slug)
  if (!cat) return <Navigate to="/catalog" replace />
  return <Navigate to={`/catalog?category=${encodeURIComponent(cat.id)}`} replace />
}
