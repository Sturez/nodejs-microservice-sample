import { Publisher, Subjects, OrderCancelledEvent } from '@sturez-org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}