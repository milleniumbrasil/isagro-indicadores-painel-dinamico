// src/services/GetOrganicaService.ts

import Service from "./Service";
import { IPercentualAreaChart, IStackedAreaChart } from "../types";

class GetOrganicaService extends Service {

  public async getStackedOragicasData(): Promise<IStackedAreaChart[] | { error: string }> {
    return this.get<IStackedAreaChart[]>("/organicas/stacked");
  }

  public async getOrganicasAsPercentual(): Promise<IPercentualAreaChart[] | { error: string }> {
    return this.get<IPercentualAreaChart[]>("/organicas/percentual");
  }
}

export default GetOrganicaService;
