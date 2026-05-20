import { SeoHead } from '../components/common/SeoHead'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuth } from '../hooks/useAuth'

/** Личный кабинет (демо) */
export default function AccountPage() {
  const { user, loginDemo, logout, isAuth } = useAuth()
  return (
    <>
      <SeoHead title="Личный кабинет — KR‑CN Parts" />
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Личный кабинет</h1>
      <Card className="mt-6 max-w-xl p-6">
        {isAuth ? (
          <div className="space-y-2">
            <div className="text-sm text-slate-600 dark:text-slate-300">Вы вошли как</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">{user?.name}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{user?.email}</div>
            <Button type="button" variant="outline" className="mt-4" onClick={() => logout()}>
              Выйти
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-700 dark:text-slate-200">Демо-вход без пароля для просмотра сценариев.</p>
            <Button type="button" variant="primary" onClick={() => loginDemo()}>
              Войти демо-пользователем
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}
