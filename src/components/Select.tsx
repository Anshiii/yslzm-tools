import { useEffect, useRef, useState } from "react"

type SelectProps = {
    sourceData: { value: string, label: string }[],
    id: string
    name?: string
    placeholder?: string
    onChange: (newValue) => void
    value?: string
}

export default function List({ sourceData, name, id, placeholder, value, onChange }: SelectProps) {

    return <select name={name} id={id} value={value} onChange={(e) => {
        onChange(e.currentTarget.value)
    }}>
        <option value="">-----{placeholder}-----</option>
        {sourceData.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
    </select>
}
