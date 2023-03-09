import { Subjects, Publisher, TicketCreatedEvent } from "@sturez-org/common";

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
};