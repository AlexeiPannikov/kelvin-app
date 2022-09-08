import $api from "../api";
import {BaseResponse} from "../models/responses/BaseResponse";
import {IGetFilesResponse} from "../models/responses/Files/IGetFilesResponse";
import {FileDataModel} from "../models/responses/Files/FileDataModel";
import NoImage from "../../assets/images/no-img.png";

class FilesService {
    async getFile(scope: string, uuid: string): Promise<FileDataModel> {
        const res = await $api.get<BaseResponse<FileDataModel>>(
            `files/get/${scope}/${uuid}`
        );
        if (res?.data?.success) {
            return new FileDataModel({
                    uuid: res.data.data.uuid,
                    url: `${import.meta.env.VITE_BASE_URL}${res.data.data.url}`,
                    original_name: res.data.data.original_name
                }
            );
        }
    }

    async getFiles(scope: string, files: string[]): Promise<FileDataModel[]> {
        const res = await $api.post<BaseResponse<IGetFilesResponse>>(
            `files/gets/${scope}`,
            {files: files}
        );
        if (res?.data?.success) {
            return Object.entries(res.data.data).map(([key, value]) => new FileDataModel({
                uuid: key,
                url: `${import.meta.env.VITE_BASE_URL}${value.url}`,
                original_name: value.original_name,
            }))
        }
    }

    async uploadFile(scope: string, request: FormData): Promise<FileDataModel> {
        const res = await $api.post<BaseResponse<FileDataModel>>(
            `files/upload/${scope}`,
            request
        );
        if (res?.data?.success) {
            return new FileDataModel({
                    uuid: res.data.data.uuid,
                    url: `${import.meta.env.VITE_BASE_URL}${res.data.data.url}`,
                    original_name: res.data.data.original_name
                }
            );
        }
    }

    async filesUploader(scope: string, list: FileDataModel[]): Promise<[FileDataModel[], string[]]> {
        let fileList: FileDataModel[] = []
        for (const file of list) {
            if (!file && !file.file && !file.uuid) continue;
            if (file.file) {
                const formData = new FormData();
                formData.append("file", file.file);
                fileList.push(JSON.parse(JSON.stringify(await this.uploadFile(scope, formData))));
            }
            if (file.uuid) {
                fileList.push(new FileDataModel(file))
            }
        }
        return [fileList, fileList.map(({uuid}) => uuid)]
    }

    async filesDownloader(scope: string, data: FileDataModel | FileDataModel[]) {
        if (Array.isArray(data)) {
            if (!data.length) return
            const downloadFiles = await this.getFiles(scope, data.map(({uuid}) => uuid || ""))
            data.forEach(item => {
                const file = downloadFiles.find(({uuid}) => item.uuid === uuid)
                Object.assign(item, file)
                if (!item.url)
                    item.url = NoImage
            })
        }
        if (data instanceof FileDataModel) {
            const file = await this.getFile(scope, data.uuid)
            Object.assign(data, file)
        }
    }
}

export default new FilesService();
