import { Publisher, OrderCreatedEvent, Subjects } from '@sturez-org/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}