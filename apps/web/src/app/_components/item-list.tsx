import * as React from "react"

import { ScrollArea } from "@duck/ui/scroll-area"
import { Separator } from "@duck/ui/separator"
import Link from "next/link"

const tags = Array.from({ length: 20 }).map(
  (_, i) => `company ${i + 1}`
)

export function ItemList() {
  return (
    <ScrollArea className="h-96 w-full rounded-xl bg-muted/50">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Info on all companies</h4>
        {tags.map((tag) => (
          <>
            <Link href="/companies" key={tag} className="text-sm">
              {tag}
            </Link>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
