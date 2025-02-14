import { Button } from '~/components'
import { useSlackSSOButton } from './use-slack-sso-button'

export function SlackSSOButton() {
  const { onClick, isPending } = useSlackSSOButton()
  return (
    <Button
      disabled={isPending}
      style={{
        alignItems: 'center',
        color: '#000',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        display: 'inline-flex',
        fontFamily: 'Lato, sans-serif',
        fontSize: '18px',
        fontWeight: '600',
        justifyContent: 'center',
        textDecoration: 'none',
        height: '56px',
        width: '296px',
      }}
      onClick={onClick}
    >
      <img
        src="/images/slack-logo.svg"
        alt="Slack"
        style={{ height: '24px', width: '24px', marginRight: '12px' }}
      />
      Sign in with Slack
    </Button>
  )
}
