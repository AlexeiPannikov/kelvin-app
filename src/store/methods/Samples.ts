import SamplesService from "../../api/services/SamplesService";
import {SampleModel} from "../../api/models/responses/Samples/SampleModel";
import Notifications from "../../view/components/ui-notifications/models/Notifications";

interface IParams {
    barcode: string
}

export const search = async ({barcode}: IParams): Promise<SampleModel[]> => {
    const samples: SampleModel[] = []
    try {
        const res = await SamplesService.search(barcode);
        if (res) {
            samples.push(...res.map((item) => new SampleModel(item)))
            if (!res.length) Notifications.newMessage("No products found for this code")
        }
    } catch (e) {
        console.log(e)
    }
    return samples
}