import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {StyleGuide} from "../models/responses/StyleGuides/StyleGuide";
import {ShootingType} from "../models/requests/StyleGuides/ShootingType";

class StyleGuidesService {
    async getStyleGuides(client_id: number): Promise<StyleGuide[]> {
        const res = await $api.get<BaseResponse<{ list: StyleGuide[] }>>(
            "styleguides",
            {params: {client_id}}
        );
        if (res?.data?.success) {
            return res.data.data.list;
        }
    }

    async viewStyleGuide(uuid: string): Promise<{ style_guide: StyleGuide, shootingTypes: ShootingType[] }> {
        const res = await $api.get<BaseResponse<{ style_guide: StyleGuide, shootingTypes: ShootingType[] }>>(
            `styleguides/${uuid}/view`
        );
        if (res?.data?.success) {
            return res.data.data;
        }
    }

    async viewVersionStyleGuide(uuid: string, sg_version: number | string): Promise<{ style_guide: StyleGuide, shootingTypes: ShootingType[] }> {
        const res = await $api.get<BaseResponse<{ style_guide: StyleGuide, shootingTypes: ShootingType[] }>>(
            `styleguides/${uuid}/${sg_version}/version`
        );
        if (res?.data?.success) {
            return res.data.data;
        }
    }
}

export default new StyleGuidesService();
