import { Spinner } from '~/components'
import { useRootRedirect } from './use-root-redirect'

export function RootRedirect() {
  useRootRedirect()

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner size={48} />
    </div>
  )
}
