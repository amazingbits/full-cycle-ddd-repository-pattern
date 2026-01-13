import EventInterface from "../../@shared/event/event.interface";

export interface CustomerCreatedEventProps {
  id: string;
  name: string;
}

export default class CustomerCreatedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerCreatedEventProps;

  constructor(eventData: CustomerCreatedEventProps) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
