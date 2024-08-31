import { Text } from '@radix-ui/themes'

interface LNProps {
  no: number
}

export function LineNumber({ no }: LNProps) {
  return (
    <Text color="gray" truncate className="mr-1 w-5 select-none tracking-tight">
      {no}
    </Text>
  )
}
