import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/shadcn'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type Props = {
  date: Date
  setDate: (date: Date) => void
}

export function DateTimePicker({ date, setDate }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'PPP HH:mm', { locale: ja })
          ) : (
            <span>日時を選択</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <input
            type="time"
            value={format(date, 'HH:mm')}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number)
              const newDate = new Date(date)
              newDate.setHours(hours)
              newDate.setMinutes(minutes)
              setDate(newDate)
            }}
            className="w-full p-2 border rounded"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
