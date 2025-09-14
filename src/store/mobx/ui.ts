import { makeAutoObservable, runInAction } from "mobx";
import { CityService } from "../../services/city/CityService";
import { GeoResponse } from "../../services/event/EventResponse";
import { WeekDay } from "../../helpers/utils/common";

export interface FilterParams {
  userId?: string;
  status?: string;
  eventType?: "EVENT" | "PLACE";
  page?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  categories?: string;
  day?: WeekDay;
  city?: string;
  country?: string;
  coordinates?: [number, number];
  zoom?: number;
  /**
   * Фильтр по событиям, созданным друзьями.
   * - `only` – только события друзей
   * - `exclude` – все события, кроме созданных друзьями
   */
  friends?: "only" | "exclude";
  /**
   * Фильтр по участию пользователя в событии.
   * - `joined` – события, в которых пользователь участвует
   * - `not_joined` – события, в которых пользователь не участвует
   */
  participation?: "joined" | "not_joined";
}

export type SnackbarType = 'success' | 'warning' | 'error' | 'info';

export interface SnackBarParams {
  visible: boolean;
  message: string;
  type: SnackbarType;
}

class UIStore {
  private cityService: CityService;
  coordinates: [number, number] | undefined = undefined;

  filters: FilterParams = {
    page: 1,
    startDate: undefined,
    endDate: undefined,
  };

  placeFilter: FilterParams = {
    page: 1,
    eventType: "PLACE",
    day: undefined,
  };

  geoFilter: FilterParams = {
    city: undefined,
    country: undefined,
  }

  snackBar: SnackBarParams = {
    visible: false,
    message: '',
    type: 'success',
  };

  // В будущем сюда можно добавить состояния для модальных окон и др.

  constructor() {
    makeAutoObservable(this);
    this.cityService = new CityService();
  }

  // Методы для работы с фильтрами
  setFilter<K extends keyof FilterParams>(key: K, value: FilterParams[K]) {
    this.filters = { ...this.filters, [key]: value };
  }

  // Методы для работы с фильтрами
  setPlaceFilter<K extends keyof FilterParams>(key: K, value: FilterParams[K]) {
    this.placeFilter = { ...this.placeFilter, [key]: value };
  }

  setFilterGroup<
    T extends 'filters' | 'geoFilter',
    K extends keyof UIStore[T]
  >(group: T, key: K, value: UIStore[T][K]) {
    this[group] = { ...this[group], [key]: value };
  }

  setFilters<K extends keyof Pick<UIStore, 'filters' | 'geoFilter' | 'placeFilter'>>(
    target: K,
    newFilters: Partial<UIStore[K]>
  ) {
    this[target] = { ...this[target], ...newFilters };
  }

  setGeoFilters(geo: GeoResponse) {
    if (geo.city) {
      if (this.geoFilter.city !== geo.city) {
        this.geoFilter = {
          city: geo?.city,
          country: geo?.country,
        }
      }
      this.coordinates = geo.coordinates
    }
  }

  resetFilters() {
    this.filters = {
      startDate: undefined,
      endDate: undefined,
      friends: undefined,
      participation: undefined,
    };
  }

  resetPlaceFilter() {
    this.placeFilter = {
      eventType: "PLACE",
      page: 1,
      day: undefined,
    }
  }

  //оставялем фильтрацию по городам
  resetFiltersDatesAndPage() {
    this.filters = {
      ...this.filters,
      page: 1,
      startDate: undefined,
      endDate: undefined,
      friends: undefined,
      participation: undefined,
    };
  }

  getFilters(): FilterParams {
    return this.filters;
  }

  // Методы для работы со Snackbar
  showSnackbar(message: string, type: SnackbarType) {
    this.snackBar.message = message;
    this.snackBar.type = type;
    this.snackBar.visible = true;
  }

  hideSnackbar() {
    this.snackBar.visible = false;
  }

  async getCountries() {
    try {
      return (await this.cityService.getAllCountries()).data;
    } catch (error) {
      console.error("Error getting countries:", error);
    }
  }

  async getCityesByCounty(county: string) {
    try {
      return (await this.cityService.getCityesByCounty(county)).data;
    } catch (error) {
      console.error("Error getting countries:", error);
    }
  }
}

export default new UIStore();