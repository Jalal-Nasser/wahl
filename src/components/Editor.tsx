import { useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function Editor({ value, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [html, setHtml] = useState(value || '')

  useEffect(() => { setHtml(value || '') }, [value])

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('bold')}>B</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('italic')}>I</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('underline')}>U</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertUnorderedList')}>•</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('insertOrderedList')}>1.</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('formatBlock','h2')}>H2</button>
        <button type="button" className="px-2 py-1 border rounded" onClick={() => exec('formatBlock','p')}>P</button>
      </div>
      <div
        ref={ref}
        contentEditable
        className="min-h-[180px] p-3 focus:outline-none"
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
      />
    </div>
  )
}
