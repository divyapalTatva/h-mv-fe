import { inject, Injectable } from "@angular/core";
import { ApiService } from "../common/api.service";
import { API_ENDPOINTS } from "../../utils/api-endpoint.constant";
import { ResponseModel } from "../../interfaces/response/response.interface";
import { Observable } from "rxjs";
import { ReminderResponse } from "../../interfaces/response/reminderresponse.interface";
import { ReminderRequest } from "../../interfaces/request/reminderrequest";

@Injectable({
    providedIn: 'root'
})
export class ReminderService {
    private readonly api = inject(ApiService);

    getAllReminder(): Observable<ResponseModel<ReminderResponse[]>> {
        return this.api.get<ResponseModel<ReminderResponse[]>>(
            API_ENDPOINTS.Reminder.getAllReminder
        );
    }

    addReminder(reminderRequest: ReminderRequest): Observable<ResponseModel<number>> {
        return this.api.post<ResponseModel<number>>(
            API_ENDPOINTS.Reminder.addReminder,
            reminderRequest
        );
    }

    updateReminder(reminderRequest: ReminderRequest): Observable<ResponseModel<number>> {
        return this.api.put<ResponseModel<number>>(
            API_ENDPOINTS.Reminder.updateReminder,
            reminderRequest
        );
    }

    deleteReminder(id: number): Observable<ResponseModel<string>> {
        return this.api.delete<ResponseModel<string>>(
            API_ENDPOINTS.Reminder.deleteReminder.replace('{0}', id.toString()),
        );
    }

    getReminderById(id: number): Observable<ResponseModel<ReminderResponse>> {
        return this.api.get<ResponseModel<ReminderResponse>>(
            API_ENDPOINTS.Reminder.getReminderById.replace('{0}', id.toString()),
        );
    }
}