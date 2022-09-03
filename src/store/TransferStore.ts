import {defineStore} from "pinia";
import {TransferHistoryList} from "./models/TransferHistoryList";
import {useScanProductStore} from "./ScanProductStore";
import {useStudioStore} from "./StudioStore";
import {Transfer} from "./models/Transfer";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "./CurrentUserStore";
import moment from "moment";
import {useUserSettingsStore} from "./UserSettingsStore";
import ProductsService from "../api/services/ProductsService";
import {TransferPosition} from "./models/TransferPosition";
import FilesService from "../api/services/FilesService";
import {FileDataModel} from "../api/models/responses/Files/FileDataModel";
import {useTeamOnSetStore} from "./TeamOnSetStore";


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
        async transfer() {
            this.isLoading = true
            const scanProductStore = useScanProductStore()
            const studioStore = useStudioStore()
            const {shootingTypes} = scanProductStore.confirmedProduct.styleGuide
            const {product_code, product_uuid} = scanProductStore.confirmedProduct.product
            const shootingType = shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)
            this.transferList.transfer = new Transfer({
                date: moment().format(),
                productionTypeName: studioStore.productionTypeName,
                productionTypeUuid: studioStore.selectedProductionTypeUuid,
                productUuid: product_uuid,
                productCode: product_code,
                taskUuid: shootingType.taskUuid,
                positions: shootingType.positions.map(({
                                                           images,
                                                           altsImages,
                                                           id
                                                       }) => new TransferPosition({
                    id: id.toString(),
                    files: [...images.list, ...altsImages.list]
                }))
            })
            this.transferList.transfer.startUpload()
            this.transferList.addToHistory()
            try {
                const isBeginTransfer = await ProductsService.beginTransfer(this.transferList.transfer.productUuid, this.transferList.transfer.productionTypeUuid)
                if (!isBeginTransfer) {
                    this.transferList.transfer.uploadError()
                    return
                }
                const [, uuidList] = await FilesService.filesUploader("assets", this.transferList.transfer.allImages.map((item) => new FileDataModel({
                    file: item.image
                })))
                const teamOnSetStore = useTeamOnSetStore()
                const res = await ProductsService.transfer({
                    product_uuid: this.transferList.transfer.uuid,
                    production_type_uuid: this.transferList.transfer.productionTypeUuid,
                    data: {
                        task_uuid: this.transferList.transfer.taskUuid,
                        positions: this.transferList.transfer.positions.map(({id}) => ({
                            id,
                            fileIds: uuidList
                        })),
                        teamOnSet: [...teamOnSetStore.teamOnSet.map(({id}) => ({user_id: id.toString()}))]
                    }
                })
                if (res) {
                    const currentUserStore = useCurrentUserStore()
                    this.transferList.transfer.uploadSuccess()
                    await ipcRenderer.invoke("save-transfers", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.transferList.transfer)))
                    return true
                }
                this.transferList.transfer.uploadError()
            } catch (e) {
                this.transferList.transfer.uploadError()
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
