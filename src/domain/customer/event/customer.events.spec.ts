import { faker } from "@faker-js/faker";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerAddressHasChangedEvent from "./customer-addres-has-changed.event";
import SendFirstMessageWhenCustomerIsCreatedHandler from "./handlers/send-first-message-when-customer-is-created.handler";
import SendSecondMessageWhenCustomerIsCreatedHandler from "./handlers/send-second-message-when-customer-is-created.handler";
import SendMessageWhenCustomerAddressHasChangedHandler from "./handlers/send-message-when-customer-address-has-changed.handler";

describe("Customer Domain Events", () => {
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
  });

  describe("CustomerCreatedEvent", () => {
    it("should create a CustomerCreatedEvent with correct data", () => {
      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      };

      const event = new CustomerCreatedEvent(eventData);

      expect(event.eventData).toEqual(eventData);
      expect(event.dataTimeOccurred).toBeInstanceOf(Date);
    });

    it("should notify SendFirstMessageWhenCustomerIsCreatedHandler when customer is created", () => {
      const handler = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler);

      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      };
      const event = new CustomerCreatedEvent(eventData);

      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o primeiro console.log do evento: CustomerCreated",
      );

      consoleSpy.mockRestore();
    });

    it("should notify SendSecondMessageWhenCustomerIsCreatedHandler when customer is created", () => {
      const handler = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler);

      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      };
      const event = new CustomerCreatedEvent(eventData);

      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o segundo console.log do evento: CustomerCreated",
      );

      consoleSpy.mockRestore();
    });

    it("should notify both handlers when customer is created", () => {
      const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler1);
      eventDispatcher.register("CustomerCreatedEvent", handler2);

      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      };
      const event = new CustomerCreatedEvent(eventData);

      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Esse é o primeiro console.log do evento: CustomerCreated",
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "Esse é o segundo console.log do evento: CustomerCreated",
      );

      consoleSpy.mockRestore();
    });

    it("should handle multiple CustomerCreatedEvents", () => {
      const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler1);
      eventDispatcher.register("CustomerCreatedEvent", handler2);

      const event1 = new CustomerCreatedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      });
      const event2 = new CustomerCreatedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      });
      const event3 = new CustomerCreatedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      });

      eventDispatcher.notify(event1);
      eventDispatcher.notify(event2);
      eventDispatcher.notify(event3);

      expect(consoleSpy).toHaveBeenCalledTimes(6);

      consoleSpy.mockRestore();
    });
  });

  describe("CustomerAddressHasChangedEvent", () => {
    it("should create a CustomerAddressHasChangedEvent with correct data", () => {
      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      };

      const event = new CustomerAddressHasChangedEvent(eventData);

      expect(event.eventData).toEqual(eventData);
      expect(event.dataTimeOccurred).toBeInstanceOf(Date);
    });

    it("should notify SendMessageWhenCustomerAddressHasChangedHandler when customer address changes", () => {
      const handler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerAddressHasChangedEvent", handler);

      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      };
      const event = new CustomerAddressHasChangedEvent(eventData);

      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${eventData.address.street}, ${eventData.address.number}, ${eventData.address.zip} ${eventData.address.city}`,
      );

      consoleSpy.mockRestore();
    });

    it("should format address correctly in handler", () => {
      const handler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerAddressHasChangedEvent", handler);

      const eventData = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      };
      const event = new CustomerAddressHasChangedEvent(eventData);

      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${eventData.address.street}, ${eventData.address.number}, ${eventData.address.zip} ${eventData.address.city}`,
      );

      consoleSpy.mockRestore();
    });

    it("should handle multiple address changes", () => {
      const handler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerAddressHasChangedEvent", handler);

      const eventData1 = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      };

      const eventData2 = {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      };

      const event1 = new CustomerAddressHasChangedEvent(eventData1);
      const event2 = new CustomerAddressHasChangedEvent(eventData2);

      eventDispatcher.notify(event1);
      eventDispatcher.notify(event2);

      expect(consoleSpy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        `Endereço do cliente: ${eventData1.id}, ${eventData1.name} alterado para: ${eventData1.address.street}, ${eventData1.address.number}, ${eventData1.address.zip} ${eventData1.address.city}`,
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        `Endereço do cliente: ${eventData2.id}, ${eventData2.name} alterado para: ${eventData2.address.street}, ${eventData2.address.number}, ${eventData2.address.zip} ${eventData2.address.city}`,
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Integration scenarios", () => {
    it("should handle both CustomerCreated and AddressChanged events independently", () => {
      const createdHandler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const createdHandler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const addressHandler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", createdHandler1);
      eventDispatcher.register("CustomerCreatedEvent", createdHandler2);
      eventDispatcher.register("CustomerAddressHasChangedEvent", addressHandler);

      const customerId = faker.string.uuid();
      const customerName = faker.person.fullName();

      const createdEvent = new CustomerCreatedEvent({
        id: customerId,
        name: customerName,
      });

      const addressData = {
        street: faker.location.streetAddress(),
        number: faker.number.int({ min: 1, max: 9999 }),
        zip: faker.location.zipCode(),
        city: faker.location.city(),
      };

      const addressChangedEvent = new CustomerAddressHasChangedEvent({
        id: customerId,
        name: customerName,
        address: addressData,
      });

      eventDispatcher.notify(createdEvent);
      eventDispatcher.notify(addressChangedEvent);

      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(consoleSpy).toHaveBeenNthCalledWith(
        1,
        "Esse é o primeiro console.log do evento: CustomerCreated",
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        2,
        "Esse é o segundo console.log do evento: CustomerCreated",
      );
      expect(consoleSpy).toHaveBeenNthCalledWith(
        3,
        `Endereço do cliente: ${customerId}, ${customerName} alterado para: ${addressData.street}, ${addressData.number}, ${addressData.zip} ${addressData.city}`,
      );

      consoleSpy.mockRestore();
    });

    it("should unregister handlers correctly", () => {
      const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler1);
      eventDispatcher.register("CustomerCreatedEvent", handler2);

      eventDispatcher.unregister("CustomerCreatedEvent", handler1);

      const event = new CustomerCreatedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      });
      eventDispatcher.notify(event);

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Esse é o segundo console.log do evento: CustomerCreated",
      );

      consoleSpy.mockRestore();
    });

    it("should unregister all handlers", () => {
      const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
      const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();
      const addressHandler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerCreatedEvent", handler1);
      eventDispatcher.register("CustomerCreatedEvent", handler2);
      eventDispatcher.register("CustomerAddressHasChangedEvent", addressHandler);

      eventDispatcher.unregisterAll();

      const createdEvent = new CustomerCreatedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
      });
      const addressEvent = new CustomerAddressHasChangedEvent({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: {
          street: faker.location.streetAddress(),
          number: faker.number.int({ min: 1, max: 9999 }),
          zip: faker.location.zipCode(),
          city: faker.location.city(),
        },
      });

      eventDispatcher.notify(createdEvent);
      eventDispatcher.notify(addressEvent);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should preserve event data integrity across notifications", () => {
      const handler = new SendMessageWhenCustomerAddressHasChangedHandler();
      const consoleSpy = jest.spyOn(console, "log");

      eventDispatcher.register("CustomerAddressHasChangedEvent", handler);

      const customerId = faker.string.uuid();
      const customerName = faker.person.fullName();
      const originalAddress = {
        street: faker.location.streetAddress(),
        number: faker.number.int({ min: 1, max: 9999 }),
        zip: faker.location.zipCode(),
        city: faker.location.city(),
      };

      const event = new CustomerAddressHasChangedEvent({
        id: customerId,
        name: customerName,
        address: originalAddress,
      });

      eventDispatcher.notify(event);

      expect(event.eventData.address).toEqual(originalAddress);
      expect(event.eventData.id).toBe(customerId);
      expect(event.eventData.name).toBe(customerName);

      consoleSpy.mockRestore();
    });
  });
});
