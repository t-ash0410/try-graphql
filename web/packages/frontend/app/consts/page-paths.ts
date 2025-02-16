export const pagePaths = {
  public: {
    root: {
      path: '/',
      file: 'routes/public/root.tsx',
    },
    signin: {
      path: '/signin',
      file: 'routes/public/signin.tsx',
    },
    ssoSlack: {
      path: '/sso/slack',
      file: 'routes/public/sso/slack.tsx',
    },
  },
  authorized: {
    tickets: {
      path: '/tickets',
      file: 'routes/authorized/tickets/list.tsx',
    },
  },
} as const
