import { inject, Injectable } from "@angular/core";
import { ApiService } from "../common/api.service";
import { API_ENDPOINTS } from "../../utils/api-endpoint.constant";
import { ResponseModel } from "../../interfaces/response/response.interface";
import { Observable } from "rxjs";
import { DashboardSummaryResponse } from "../../interfaces/response/dashboardsummaryresponse";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private readonly api = inject(ApiService);

    getDashboardSummary(): Observable<ResponseModel<DashboardSummaryResponse>> {
        return this.api.get<ResponseModel<DashboardSummaryResponse>>(
            API_ENDPOINTS.Dashboard.getDashboardSummary
        );
    }
}