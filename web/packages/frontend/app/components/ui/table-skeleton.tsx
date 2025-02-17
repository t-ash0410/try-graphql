import { Skeleton } from './skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

interface Props {
  rows?: number
  columns?: number
}

export function TableSkeleton({ rows = 5, columns = 4 }: Props) {
  return (
    <div aria-label="Loading table data" className="animate-pulse">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map(() => (
              <TableHead key={Math.random()}>
                <Skeleton className="h-4 w-[80%]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map(() => (
            <TableRow key={Math.random()}>
              {Array.from({ length: columns }).map(() => (
                <TableCell key={Math.random()}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
