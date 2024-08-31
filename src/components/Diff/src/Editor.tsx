import { TextArea } from '@radix-ui/themes'
import { type ChangeEventHandler, forwardRef } from 'react'

interface EProps {
  onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export const Editor = forwardRef<HTMLTextAreaElement, EProps>(function Editor(
  { onChange },
  ref,
) {
  return (
    <TextArea
      size="2"
      ref={ref}
      placeholder="Type content which needs linting here."
      rows={12}
      {...{ onChange }}
    />
  )
})
