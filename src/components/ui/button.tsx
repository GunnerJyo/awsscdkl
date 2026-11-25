// Adapted from the shadcn/ui new-york button. See public/licenses/component-sources.txt.
import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-none text-base font-medium disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
  {
    variants: {
      variant: {
        default: 'border border-solid border-primary bg-primary px-3 py-1 text-primary-foreground hover:bg-[#1a1a1a]',
        outline: 'border border-solid border-current bg-transparent px-4 text-primary hover:bg-secondary',
        link: 'border-0 bg-transparent px-0 text-primary underline underline-offset-4 hover:no-underline',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ asChild = false, variant, className, ...props }: ButtonProps) {
  const Component = asChild ? Slot : 'button'
  return <Component data-slot="button" className={cn(buttonVariants({ variant }), className)} {...props}/>
}
