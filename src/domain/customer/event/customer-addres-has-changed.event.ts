import EventInterface from "../../@shared/event/event.interface";

export interface CustomerAddressHasChangedEventProps {
  id: string;
  name: string;
  address: {
    street: string;
    number: number;
    zip: string;
    city: string;
  };
}

export default class CustomerAddressHasChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: CustomerAddressHasChangedEventProps;

  constructor(eventData: CustomerAddressHasChangedEventProps) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
