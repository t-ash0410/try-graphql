import { Spinner } from '~/components'
import { useSlackSSORedirect } from './use-slack-sso-redirect'

export function SlackSSORedirect() {
  useSlackSSORedirect()

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner size={48} />
    </div>
  )
}
