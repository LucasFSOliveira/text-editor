import { createContext, ReactNode, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { LinesPrefixe, LinesSufixe } from "../constants/lines";

import { BlockTypes, Line } from "../types/line";

type EditorContextType = {
  addHeading1(): void
  addHeading2(): void
  addHeading3(): void
  addText(): void
  addBold(): void
  addItalic(): void
  addCode(): void
  addListEnum(): void
  addListBullet(): void
  addCheckbox(): void
  addLink(): void
  handlePreview(): void
  exportFile(): void
  content: Line[]
  setContent(value: Line[]): void
  updateLineBlockValue(oldLine: Line, newValue: string): void
  isPreviewMode: boolean
  updateIsEditingByUUID(uuid: string): void
}

interface Props {
  children: ReactNode
}

export const EditorContext = createContext({} as EditorContextType)

export function EditorContextProvider({ children }: Props){
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [content, setContent] = useState<Line[]>([
    { isEditing: true, content: 'Type your text here', type: "h1", uuid: uuidv4() }
  ])

  const updateLineBlockValue = (currentLine: Line, newValue: string) => {
    const newContent = content.map(line => {
      if(line.uuid !== currentLine.uuid) return line
      return { ...line, content: newValue }
    })

    setContent(newContent)
  }

  const addLineBlock = (type: BlockTypes, lineContent: string) => {
    const allDisabled = content.map(line => ({ ...line, isEditing: false }))
    const newLineContent = LinesPrefixe[type] + lineContent + LinesSufixe[type]
    const newLine = { type, content: newLineContent, isEditing: true, uuid: uuidv4() }

    setContent([...allDisabled, newLine])
  }

  const updateIsEditingByUUID = (uuid: string) => {
    const newContent = content.map(line => {
      if(line.uuid === uuid) return {...line, isEditing: true }
      return {...line, isEditing: false }
    })

    setContent(newContent)
  }

  const addHeading1 = () => {
    addLineBlock('h1', '')
  }

  const addHeading2 = () => {
    addLineBlock('h2', '')
  }

  const addHeading3 = () => {
    addLineBlock('h3', '')
  }

  const addText = () => {
    addLineBlock('t', '')
  }

  const addBold = () => {
    addLineBlock('b', 'bold')
  }

  const addItalic = () => {
    addLineBlock('i', 'italic')
  }

  const addCode = () => {
    addLineBlock('code', 'write your code here')
  }

  const addListEnum = () => {
    addLineBlock('list-enum', '')
  }

  const addListBullet = () => {
    addLineBlock('list-bullet', '')
  }

  const addLink = () => {
    addLineBlock('link', '[Link Name](url)')
  }

  const addCheckbox = () => {
    addLineBlock('checkbox', '')
  }
  
  const exportFile = () => {}

  return(
    <EditorContext.Provider value={{
      addBold, 
      addCode, 
      addHeading1, 
      addHeading2, 
      addHeading3, 
      addItalic, 
      addText,
      addCheckbox,
      addLink,
      addListBullet,
      addListEnum,
      exportFile, 
      handlePreview: () => setIsPreviewMode(!isPreviewMode),
      content,
      setContent,
      updateLineBlockValue: updateLineBlockValue,
      isPreviewMode,
      updateIsEditingByUUID}}
    >
      {children}
    </EditorContext.Provider>
  )
}