// src/services/GetPoluicaoDataService.ts

import { IStackedAreaChart } from "../types";
import Service from "./Service";

class GetPoluicaoDataService extends Service {

	public async getStackedData(): Promise<IStackedAreaChart[]> {
		return this.get<IStackedAreaChart[]>("/poluicao/stacked");
	  }
}

export default GetPoluicaoDataService;
