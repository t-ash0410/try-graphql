import { toast } from 'sonner'

export function handleError(err: unknown) {
  toast.error('システムエラーが発生しました')
  console.error(err)
}
