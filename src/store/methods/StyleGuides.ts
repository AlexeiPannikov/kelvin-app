import StyleGuidesService from "../../api/services/StyleGuidesService";
import {StyleGuide} from "../../api/models/responses/StyleGuides/StyleGuide";
import {ShootingType} from "../../api/models/requests/StyleGuides/ShootingType";
import {Position} from "../../api/models/requests/StyleGuides/Position";
import FilesService from "../../api/services/FilesService";

interface IParamsViewStyleGuide {
    uuid: string,
}

interface IParamsViewVersionStyleGuide {
    uuid: string,
    sg_version: string | number
}

const responseHandler = async (res: { style_guide: StyleGuide, shootingTypes: ShootingType[] }) => {
    const styleGuide = new StyleGuide(res.style_guide)
    styleGuide.shootingTypes = res.shootingTypes?.map(item => new ShootingType({
        ...item,
        positions: item.positions.map(position => new Position(position))
    }))
    await FilesService.filesDownloader("styleguide", styleGuide.getAllFiles())
    return styleGuide
}

export const viewStyleGuide = async ({uuid}: IParamsViewStyleGuide): Promise<StyleGuide> => {
    if (!uuid) return
    let styleGuide = new StyleGuide()
    try {
        const res = await StyleGuidesService.viewStyleGuide(uuid);
        styleGuide = await responseHandler(res)
    } catch (e) {
        console.log(e)
    }
    return styleGuide
}

export const viewVersionStyleGuide = async ({uuid, sg_version}: IParamsViewVersionStyleGuide): Promise<StyleGuide> => {
    if (!uuid && !sg_version) return
    let styleGuide = new StyleGuide()
    try {
        const res = await StyleGuidesService.viewVersionStyleGuide(uuid, sg_version);
        styleGuide = await responseHandler(res)
    } catch (e) {
        console.log(e)
    }
    return styleGuide
}