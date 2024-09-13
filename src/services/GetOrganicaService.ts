// src/services/GetOrganicaService.ts

import Service from "./Service";
import { IPercentualAreaChart, IStackedAreaChart } from "../types";

class GetOrganicaService extends Service {

  public async getStackedData(): Promise<IStackedAreaChart[]> {
    return this.get<IStackedAreaChart[]>("/organicas/stacked");
  }

  public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[]> {
    return this.get<IPercentualAreaChart[]>("/organicas/percentual");
  }
}

export default GetOrganicaService;
