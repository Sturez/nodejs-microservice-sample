import { ExpirationCompleteEvent, Publisher, Subjects } from "@sturez-org/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;

}