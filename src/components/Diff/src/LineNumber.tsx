import { Box, Text } from '@radix-ui/themes'

interface LNProps {
  no: number
}

export function LineNumber({ no }: LNProps) {
  return (
    <Box flexShrink="0" className="mr-2">
      <Text
        as="p"
        color="gray"
        size="2"
        truncate
        className="w-5 select-none p-1 tracking-tight"
      >
        {no}
      </Text>
    </Box>
  )
}
