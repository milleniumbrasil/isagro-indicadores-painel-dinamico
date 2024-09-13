// src/services/GetErosaoDataService.ts

import { IStackedAreaChart } from "../types";
import Service from "./Service";

class GetErosaoDataService extends Service {

	public async getStackedData(): Promise<IStackedAreaChart[]> {
		return this.get<IStackedAreaChart[]>("/erosao/stacked");
	  }
}

export default GetErosaoDataService;
