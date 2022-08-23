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
        const findSelectedAndExpand = (list: TreeItem[]) => {
            for (const item of list) {
                if (item.isSelected) return
                item.isExpanded = true
                findSelectedAndExpand(item.children)
            }
        }
        findSelectedAndExpand(this.items)
    }

    constructor(obj?: Partial<Tree>) {
        Object.assign(this, obj)
    }
}