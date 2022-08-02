import {TypeModel} from "./TypeModel";
import {CountryModel} from "./CountryModel";
import {LocationModel} from "./LocationModel";

export class GetLocationsData {
  locations: LocationModel[] = new Array<LocationModel>();
  countries: CountryModel[] = new Array<CountryModel>();
  types: TypeModel[] = new Array<TypeModel>();
}
