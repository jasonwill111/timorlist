# Tabs Component

## Exports

```ts
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/fulldev/tabs'
```

## Usage

```astro
---
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/fulldev/tabs'
---

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab One</TabsTrigger>
    <TabsTrigger value="tab2">Tab Two</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content one</TabsContent>
  <TabsContent value="tab2">Content two</TabsContent>
</Tabs>
```

## Variants

TabsList supports `variant` prop (`default` | `pills` | `underline`).

```astro
<TabsList variant="pills">
  <TabsTrigger value="tab1">Tab</TabsTrigger>
</TabsList>
```