import { Publisher, Subjects, TicketUpdatedEvent } from "@sturez-org/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}