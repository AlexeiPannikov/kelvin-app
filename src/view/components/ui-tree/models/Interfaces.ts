export type TreeItemType = "folder" | "file"

export interface ITreeItem {
    id: number | string
    name: string
    value: any
    type: TreeItemType
    children: ITreeItem[]
    isExpanded: boolean
    isSelected: boolean

    toggleExpand: () => void
    clickItemHandler: () => ITreeItem
}

export interface ITree {
    id: number | string
    items: ITreeItem[]

    closeAll: () => void
    leaveOneSelected: (id: string | number) => void
}