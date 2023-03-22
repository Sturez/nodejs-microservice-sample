import { Publisher, PaymentCreatedEvent, Subjects } from "@sturez-org/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;

}