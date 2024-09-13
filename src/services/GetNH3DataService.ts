// src/services/GetNH3DataService.ts

import { IStackedAreaChart } from "../types"
import Service from "./Service"

class GetNH3DataService extends Service {
	public async getStackedData(): Promise<IStackedAreaChart[]> {
		return this.get<IStackedAreaChart[]>("/nh3/stacked")
	}
}

export default GetNH3DataService
