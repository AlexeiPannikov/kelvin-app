import {BehaviourAfterTransferEnum} from "./BehaviourAfterTransferEnum";

export class PrimarySettings {
    folder = ""
    transferHistory = 7
    selectionsForTransferHistory = 7
    adobeApplications = {
        ps: "",
        br: ""
    }
    lastOpenedFolder = ""
    behaviourAfterTransfer = BehaviourAfterTransferEnum.Go
    computerLocation = {
        dontAskAgain: false,
        locationUuid: "",
        subLocationUuid: "",
    }
    teamOnSet: string[] = []

    constructor(obj?: Partial<PrimarySettings>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}