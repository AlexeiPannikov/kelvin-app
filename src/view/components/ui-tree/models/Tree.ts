import {ITree} from "./Interfaces";
import {v4} from "uuid"
import {TreeItem} from "./TreeItem";

export class Tree implements ITree {
    id: string | number = v4();
    items: TreeItem[] = [];

    closeAll(): void {
        this.items.forEach(item => item.isExpanded = false)
    }

    leaveOneSelected(id: number | string): void {
        const resetSelect = (id: string | number, list: TreeItem[]) => {
            for (const item of list) {
                if (item.id !== id)
                    item.isSelected = false
                if (item.children.length)
                    resetSelect(id, item.children)
            }
        }
        resetSelect(id, this.items)
    }

    expandToSelected() {
        let selectedItem: TreeItem = null
        const findSelected = (list: TreeItem[]) => {
            for (const item of list) {
                if (item.isSelected) {
                    selectedItem = item
                    return
                }
                findSelected(item.children)
            }
        }
        findSelected(this.items)
        const itemsArr = (selectedItem.value as string).split('\\')
        const rootItem = (this.items[0].value as string).split("\\").at(-1)
        const rootItemIndex = itemsArr.indexOf(rootItem)
        itemsArr.splice(0, rootItemIndex)
        const expand = (list: TreeItem[]) => {
            for (const item of list) {
                if (itemsArr.find(name => item.name === name)) {
                    if (item.isSelected) return
                    item.isExpanded = true
                }
                if (item.children.length) {
                    expand(item.children)
                }
            }
        }
        expand(this.items)
    }

    constructor(obj?: Partial<Tree>) {
        Object.assign(this, obj)
    }
}