import { ReminderType } from "../../shared/enums/common-enum";

export interface ReminderResponse {
    id: number;
    description: string;
    typeId: ReminderType;
    reminderDateTime: Date;
}