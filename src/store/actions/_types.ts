import { AxiosResponse } from "axios";

export interface AxiosResponseCustom<T> extends AxiosResponse<T> {
  data: T & { ok?: boolean };
}
