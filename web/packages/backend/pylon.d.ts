import '@getcronit/pylon'

type SignInContext = {
  userId: number
}

declare module '@getcronit/pylon' {
  interface Bindings {}

  interface Variables {
    activeUser: SignInContext
  }
}
