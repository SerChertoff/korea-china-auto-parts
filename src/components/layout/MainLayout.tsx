import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'
import { Loader } from '../common/Loader'

/** Общий каркас: шапка, контент страницы, подвал */
export function MainLayout() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-6">
        <Suspense
          fallback={
            <div className="flex min-h-[40vh] items-center justify-center">
              <Loader label="Загрузка страницы…" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
