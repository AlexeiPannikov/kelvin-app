import {defineStore} from "pinia";
import {TransferHistoryList} from "./models/TransferHistoryList";
import {useScanProductStore} from "./ScanProductStore";
import {useStudioStore} from "./StudioStore";
import {Transfer} from "./models/Transfer";
import {ipcRenderer} from "electron"
import {useCurrentUserStore} from "./CurrentUserStore";


export const useTransferStore = defineStore("transfer", {
    state: () => {
        return {
            transferList: new TransferHistoryList(),
        };
    },

    getters: {},

    actions: {
        async transfer() {
            const scanProductStore = useScanProductStore()
            const studioStore = useStudioStore()
            const {shootingTypes} = scanProductStore.confirmedProduct.styleGuide
            const {product_code} = scanProductStore.confirmedProduct.product
            const shootingType = shootingTypes.find(({production_type_uuid}) => studioStore.selectedProductionTypeUuid === production_type_uuid)
            const currentDate = new Date()
            this.transferList.itemsToTransfer = shootingType.positions.map(({images, altsImages}) => new Transfer({
                    productionTypeName: studioStore.productionTypeName,
                    productCode: product_code,
                    files: JSON.parse(JSON.stringify([...images.list, ...altsImages.list])),
                    date: new Date()
                })
            )
            this.transferList.historyList.push(...this.transferList.itemsToTransfer.map(item => new Transfer(item)))
            this.transferList.startUpload()
            try {
                const res = await new Promise<boolean>((resolve) => {
                    setTimeout(() => {
                        resolve(true)
                    }, 1000)
                })
                if (res) {
                    this.transferList.successUpload()
                    const currentUserStore = useCurrentUserStore()
                    await ipcRenderer.invoke("save-transfers", currentUserStore.currentUser.id, JSON.parse(JSON.stringify(this.transferList.itemsToTransfer)))
                    // const response = await ipcRenderer.invoke("get-transfers", currentUserStore.currentUser.id)
                    // console.log(response)
                }
            } catch (e) {
                this.transferList.errorUpload()
            }
        }
    },
});
