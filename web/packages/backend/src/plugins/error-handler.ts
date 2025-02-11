import { useErrorHandler } from '@envelop/core'

const errorHandler = useErrorHandler(({ errors }) => {
  console.error(errors)
})

export { errorHandler }
