import { SlackSSOButton } from '../slack-sso-button'

export function SigninForm() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center gap-16">
        <img
          src="/images/logo.jpg"
          alt="Try GraphQL"
          width={120}
          height={120}
        />
        <SlackSSOButton />
      </div>
    </div>
  )
}
