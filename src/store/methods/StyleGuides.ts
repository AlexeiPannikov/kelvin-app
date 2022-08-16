import StyleGuidesService from "../../api/services/StyleGuidesService";
import {StyleGuide} from "../../api/models/responses/StyleGuides/StyleGuide";
import {ShootingType} from "../../api/models/requests/StyleGuides/ShootingType";
import {Position} from "../../api/models/requests/StyleGuides/Position";
import FilesService from "../../api/services/FilesService";

interface IParams {
    uuid: string,
}

export const viewStyleGuide = async ({uuid}: IParams): Promise<StyleGuide> => {
    if (!uuid) return
    let styleGuide = new StyleGuide()
    try {
        const res = await StyleGuidesService.viewStyleGuide(uuid);
        if (res) {
            styleGuide = new StyleGuide(res.style_guide)
            styleGuide.shootingTypes = res.shootingTypes?.map(item => new ShootingType({
                ...item,
                positions: item.positions.map(position => new Position(position))
            }))
            await FilesService.filesDownloader("styleguide", styleGuide.getAllFiles())
        }
    } catch (e) {
        console.log(e)
    }
    return styleGuide
}