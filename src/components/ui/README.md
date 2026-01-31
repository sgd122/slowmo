# UI Components

Modern, clean UI components built with React, TypeScript, and Tailwind CSS.

## Components

### Button

Versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui'

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Loading...</Button>
```

### Input

Input field with label, error messages, and icon support.

```tsx
import { Input } from '@/components/ui'
import { Search } from 'lucide-react'

<Input
  label="Email"
  placeholder="Enter your email"
  type="email"
/>

<Input
  label="Search"
  icon={<Search className="h-4 w-4" />}
  iconPosition="left"
/>

<Input
  label="Username"
  error="Username is required"
/>
```

### Textarea

Textarea with character count and validation.

```tsx
import { Textarea } from '@/components/ui'

<Textarea
  label="Description"
  placeholder="Enter description"
  maxLength={500}
  showCount
/>

<Textarea
  error="Description is required"
/>
```

### Card

Flexible card component with header, content, and footer sections.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Modal

Accessible modal with overlay and animations.

```tsx
import { Modal } from '@/components/ui'
import { useState } from 'react'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Modal Title"
  description="Modal description"
>
  <p>Modal content goes here</p>
</Modal>
```

### Badge

Status badges with semantic color variants.

```tsx
import { Badge } from '@/components/ui'

<Badge variant="default">Default</Badge>
<Badge variant="active">Active</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
```

### Skeleton

Loading skeleton for content placeholders.

```tsx
import { Skeleton } from '@/components/ui'

<Skeleton variant="text" className="w-full" />
<Skeleton variant="rectangular" className="w-full h-24" />
<Skeleton variant="circular" className="w-12 h-12" />
```

## Features

- **TypeScript Support**: Full type safety with exported prop types
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Accessibility**: ARIA attributes and keyboard navigation
- **Animations**: Smooth transitions and micro-interactions
- **Customization**: Easy to extend with className prop
- **Icons**: Integrated with lucide-react
- **Focus States**: Beautiful focus rings for keyboard navigation

## Design Philosophy

These components follow a refined, editorial aesthetic with:
- Clean, modern typography
- Subtle shadows and borders
- Smooth transitions
- Generous spacing
- Precise color palette
- Thoughtful hover and focus states
