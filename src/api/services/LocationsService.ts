import {BaseResponse} from "../models/responses/BaseResponse";
import {GetLocationData} from "../models/responses/Locations/GetLocationData";
import {GetLocationsData} from "../models/responses/Locations/GetLocationsData";
import $api from "../api";

class LocationsService {
  async getLocations(): Promise<GetLocationsData> {
    const res = await $api.get<BaseResponse<GetLocationsData>>(
      "studio/locations"
    );
    if (res?.data?.success) {
      return res.data.data;
    }
  }

  async getLocation(uuid: string): Promise<GetLocationData> {
    const res = await $api.get<BaseResponse<GetLocationData>>(
      `studio/locations/${uuid}`
    );
    if (res?.data?.success) {
      return res.data.data;
    }
  }
}

export default new LocationsService();
