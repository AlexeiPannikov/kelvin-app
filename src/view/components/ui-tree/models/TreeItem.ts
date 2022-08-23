import {ITreeItem, TreeItemType} from "./Interfaces";
import {v4} from "uuid"

export class TreeItem implements ITreeItem {
    id: string | number = v4();
    name: string;
    value: any = null
    type: TreeItemType;
    isExpanded = false;
    children: TreeItem[] = [];
    isSelected = false;

    clickItemHandler(): TreeItem {
        if (this.children.length)
            this.toggleExpand()
        this.selectItem()
        return this
    }

    toggleExpand(): void {
        if (this.type === "file") return
        this.isExpanded = !this.isExpanded
    }

    selectItem(): TreeItem {
        if (this.isSelected) return
        this.isSelected = true
        return this
    }

    constructor(obj?: Partial<TreeItem>) {
        Object.assign(this, obj)
    }
}