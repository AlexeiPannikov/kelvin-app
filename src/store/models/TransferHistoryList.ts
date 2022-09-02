import {Transfer} from "./Transfer";
import moment from "moment";

export class TransferHistoryList {

    historyList = new Array<Transfer>()
    transfer = new Transfer()

    get sortedHistoryByDate() {
        const sortedList = this.historyList.sort((a, b) => moment(a.date).isBefore(moment(b.date)) ? 1 : -1)
        const rez = new Map<string, Transfer[]>()
        sortedList.forEach((item, i) => {
            let stringDate = ""
            const isYesterday = moment(item.date).isSame(moment().subtract(1, "d"), "d")
            const isToday = moment(item.date).isSame(moment(), "d")
            const isBefore = moment(item.date).isBefore(moment().subtract(1, "d"), "d")
            if (isYesterday) stringDate = "Yesterday"
            if (isToday) stringDate = "Today"
            if (isBefore) stringDate = moment(item.date).format("MMMM DD, YYYY")
            const hasGroup = rez.has(stringDate)
            if (i === 0) rez.set(stringDate, [item])
            else if (hasGroup) {
                rez.set(stringDate, [...rez.get(stringDate), item])
            } else if (!hasGroup) {
                rez.set(stringDate, [item])
            }
        })
        return rez
    }

    addToHistory() {
        this.historyList.push(this.transfer)
    }

    constructor(obj?: Partial<TransferHistoryList>) {
        if (obj) Object.assign(this, obj)
    }
}