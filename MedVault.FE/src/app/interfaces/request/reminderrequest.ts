import { ReminderType } from "../../shared/enums/common-enum";

export interface ReminderRequest {
    id?: number,
    typeId: ReminderType;
    description?: string;
    reminderDateTime:  Date | string;
}