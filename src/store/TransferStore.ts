import {defineStore} from "pinia";
import {TransferHistoryList} from "./models/TransferHistoryList";
import {useScanProductStore} from "./ScanProductStore";
import {useStudioStore} from "./StudioStore";
import {Transfer} from "./models/Transfer";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "./CurrentUserStore";
import moment from "moment";
import {ImageModel} from "../view/pages/capture/components/files-view/ImageModel";
import {useUserSettingsStore} from "./UserSettingsStore";


export const useTransferStore = defineStore("transfer", {
    state: () => {
        return {
            isLoading: false,
            isFirstLoading: true,
            transferList: new TransferHistoryList(),
            selectedTransfer: null as Transfer,
        };
    },

    getters: {},

    actions: {
        async beginTransfer() {

        },

        async transfer() {
            this.isLoading = true
            const scanProductStore = useScanProductStore()
            const studioStore = useStudioStore()
            const {shootingTypes} = scanProductStore.confirmedProduct.styleGuide
            const {product_code} = scanProductStore.confirmedProduct.product
            const shootingType = shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)
            this.transferList.itemsToTransfer = shootingType.positions.map(({images, altsImages}) => new Transfer({
                    productionTypeName: studioStore.productionTypeName,
                    productCode: product_code,
                    files: (JSON.parse(JSON.stringify([...images.list, ...altsImages.list])) as ImageModel[]).map(item => new ImageModel({
                        ...item,
                        isSelected: false
                    })),
                    date: moment().format()
                })
            )
            this.transferList.startUpload()
            this.transferList.historyList.push(...this.transferList.itemsToTransfer)
            try {
                const res = await new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        resolve(true)
                    }, 2000)
                })
                if (res) {
                    const currentUserStore = useCurrentUserStore()
                    this.transferList.successUpload()
                    await ipcRenderer.invoke("save-transfers", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.transferList.itemsToTransfer)))
                    return true
                }
            } catch (e) {
                this.transferList.errorUpload()
            } finally {
                this.isLoading = false
            }
        },

        async getTransferHistory() {
            if (!this.isFirstLoading) return
            const currentUserStore = useCurrentUserStore()
            const res: Transfer[] = await ipcRenderer.invoke("get-transfers", currentUserStore.currentUser.id)
            if (res) {
                this.transferList.historyList.push(...res)
                await this.clearOldTransfers()
            }
        },

        async deleteTransfer() {
            const currentUserStore = useCurrentUserStore()
            const res = await ipcRenderer.invoke("delete-transfers", currentUserStore.currentUser.id, this.selectedTransfer.uuid)
            if (res) {
                this.transferList.historyList = this.transferList.historyList.filter(item => item.uuid !== this.selectedTransfer.uuid)
                this.selectedTransfer = null
            }
        },

        async clearOldTransfers() {
            const userSettingsStore = useUserSettingsStore()
            const maxTerm = userSettingsStore.primarySettings.transferHistory
            const oldTransferFilter = (item: Transfer) => {
                let maxDate = moment()
                const iterations = maxTerm / 7
                const remainder = maxTerm % 7
                for (let i = 1; i <= iterations; i++) {
                    maxDate = maxDate.subtract(7, "d")
                }
                maxDate.subtract(remainder, "d")
                return moment(item.date).isBefore(maxDate, "d")
            }
            const oldTransfers = this.transferList.historyList.filter(oldTransferFilter)
            const currentUserStore = useCurrentUserStore()
            for (const transfer of oldTransfers) {
                await ipcRenderer.invoke("delete-transfers", currentUserStore.currentUser.id, transfer.uuid)
            }
            this.transferList.historyList = this.transferList.historyList.filter(item => !oldTransferFilter(item))
        }
    },
});
