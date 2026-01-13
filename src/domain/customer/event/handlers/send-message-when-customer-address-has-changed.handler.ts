import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressHasChangedEvent from "../customer-addres-has-changed.event";

export default class SendMessageWhenCustomerAddressHasChangedHandler implements EventHandlerInterface<CustomerAddressHasChangedEvent> {
  handle(event: CustomerAddressHasChangedEvent): void {
    const { id, name, address } = event.eventData;
    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${address.street}, ${address.number}, ${address.zip} ${address.city}`,
    );
  }
}
