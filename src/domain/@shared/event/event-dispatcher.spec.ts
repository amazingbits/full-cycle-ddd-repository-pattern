import EventDispatcher from "./event-dispatcher";
import EventInterface from "./event.interface";
import EventHandlerInterface from "./event-handler.interface";

class MockEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}

class MockEventHandler implements EventHandlerInterface<MockEvent> {
  public handledEvents: MockEvent[] = [];

  handle(event: MockEvent): void {
    this.handledEvents.push(event);
  }
}

class AnotherMockEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: any;

  constructor(eventData: any) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}

class AnotherMockEventHandler implements EventHandlerInterface<AnotherMockEvent> {
  public handledEvents: AnotherMockEvent[] = [];

  handle(event: AnotherMockEvent): void {
    this.handledEvents.push(event);
  }
}

describe("Event Dispatcher", () => {
  let eventDispatcher: EventDispatcher;

  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
  });

  describe("register", () => {
    it("should register an event handler", () => {
      const eventHandler = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler);

      expect(eventDispatcher.getEventHandlers["MockEvent"]).toBeDefined();
      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(1);
      expect(eventDispatcher.getEventHandlers["MockEvent"][0]).toBe(eventHandler);
    });

    it("should register multiple handlers for the same event", () => {
      const eventHandler1 = new MockEventHandler();
      const eventHandler2 = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler1);
      eventDispatcher.register("MockEvent", eventHandler2);

      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(2);
      expect(eventDispatcher.getEventHandlers["MockEvent"]).toContain(eventHandler1);
      expect(eventDispatcher.getEventHandlers["MockEvent"]).toContain(eventHandler2);
    });

    it("should register handlers for different events", () => {
      const mockEventHandler = new MockEventHandler();
      const anotherMockEventHandler = new AnotherMockEventHandler();

      eventDispatcher.register("MockEvent", mockEventHandler);
      eventDispatcher.register("AnotherMockEvent", anotherMockEventHandler);

      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(1);
      expect(eventDispatcher.getEventHandlers["AnotherMockEvent"].length).toBe(1);
    });
  });

  describe("unregister", () => {
    it("should unregister an event handler", () => {
      const eventHandler = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler);
      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(1);

      eventDispatcher.unregister("MockEvent", eventHandler);
      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(0);
    });

    it("should unregister only the specified handler", () => {
      const eventHandler1 = new MockEventHandler();
      const eventHandler2 = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler1);
      eventDispatcher.register("MockEvent", eventHandler2);

      eventDispatcher.unregister("MockEvent", eventHandler1);

      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(1);
      expect(eventDispatcher.getEventHandlers["MockEvent"][0]).toBe(eventHandler2);
    });

    it("should not affect other event handlers when unregistering", () => {
      const mockEventHandler = new MockEventHandler();
      const anotherMockEventHandler = new AnotherMockEventHandler();

      eventDispatcher.register("MockEvent", mockEventHandler);
      eventDispatcher.register("AnotherMockEvent", anotherMockEventHandler);

      eventDispatcher.unregister("MockEvent", mockEventHandler);

      expect(eventDispatcher.getEventHandlers["MockEvent"].length).toBe(0);
      expect(eventDispatcher.getEventHandlers["AnotherMockEvent"].length).toBe(1);
    });

    it("should do nothing when unregistering a non-existent handler", () => {
      const eventHandler = new MockEventHandler();

      expect(() => {
        eventDispatcher.unregister("MockEvent", eventHandler);
      }).not.toThrow();
    });
  });

  describe("unregisterAll", () => {
    it("should unregister all event handlers", () => {
      const mockEventHandler1 = new MockEventHandler();
      const mockEventHandler2 = new MockEventHandler();
      const anotherMockEventHandler = new AnotherMockEventHandler();

      eventDispatcher.register("MockEvent", mockEventHandler1);
      eventDispatcher.register("MockEvent", mockEventHandler2);
      eventDispatcher.register("AnotherMockEvent", anotherMockEventHandler);

      expect(Object.keys(eventDispatcher.getEventHandlers).length).toBe(2);

      eventDispatcher.unregisterAll();

      expect(Object.keys(eventDispatcher.getEventHandlers).length).toBe(0);
      expect(eventDispatcher.getEventHandlers["MockEvent"]).toBeUndefined();
      expect(eventDispatcher.getEventHandlers["AnotherMockEvent"]).toBeUndefined();
    });

    it("should work on empty event dispatcher", () => {
      expect(() => {
        eventDispatcher.unregisterAll();
      }).not.toThrow();

      expect(Object.keys(eventDispatcher.getEventHandlers).length).toBe(0);
    });
  });

  describe("notify", () => {
    it("should notify all handlers registered for an event", () => {
      const eventHandler1 = new MockEventHandler();
      const eventHandler2 = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler1);
      eventDispatcher.register("MockEvent", eventHandler2);

      const event = new MockEvent({ data: "test" });
      eventDispatcher.notify(event);

      expect(eventHandler1.handledEvents.length).toBe(1);
      expect(eventHandler1.handledEvents[0]).toBe(event);
      expect(eventHandler2.handledEvents.length).toBe(1);
      expect(eventHandler2.handledEvents[0]).toBe(event);
    });

    it("should notify only handlers registered for the specific event type", () => {
      const mockEventHandler = new MockEventHandler();
      const anotherMockEventHandler = new AnotherMockEventHandler();

      eventDispatcher.register("MockEvent", mockEventHandler);
      eventDispatcher.register("AnotherMockEvent", anotherMockEventHandler);

      const mockEvent = new MockEvent({ data: "test" });
      eventDispatcher.notify(mockEvent);

      expect(mockEventHandler.handledEvents.length).toBe(1);
      expect(anotherMockEventHandler.handledEvents.length).toBe(0);

      const anotherMockEvent = new AnotherMockEvent({ data: "another test" });
      eventDispatcher.notify(anotherMockEvent);

      expect(mockEventHandler.handledEvents.length).toBe(1);
      expect(anotherMockEventHandler.handledEvents.length).toBe(1);
    });

    it("should not throw error when notifying event with no handlers", () => {
      const event = new MockEvent({ data: "test" });

      expect(() => {
        eventDispatcher.notify(event);
      }).not.toThrow();
    });

    it("should pass event data correctly to handlers", () => {
      const eventHandler = new MockEventHandler();
      eventDispatcher.register("MockEvent", eventHandler);

      const eventData = { id: "123", name: "Test Event" };
      const event = new MockEvent(eventData);
      eventDispatcher.notify(event);

      expect(eventHandler.handledEvents[0].eventData).toEqual(eventData);
    });

    it("should preserve event timestamp", () => {
      const eventHandler = new MockEventHandler();
      eventDispatcher.register("MockEvent", eventHandler);

      const event = new MockEvent({ data: "test" });
      const originalTimestamp = event.dataTimeOccurred;

      eventDispatcher.notify(event);

      expect(eventHandler.handledEvents[0].dataTimeOccurred).toBe(originalTimestamp);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete lifecycle: register, notify, unregister", () => {
      const eventHandler = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler);

      const event1 = new MockEvent({ data: "first" });
      eventDispatcher.notify(event1);
      expect(eventHandler.handledEvents.length).toBe(1);

      eventDispatcher.unregister("MockEvent", eventHandler);

      const event2 = new MockEvent({ data: "second" });
      eventDispatcher.notify(event2);
      expect(eventHandler.handledEvents.length).toBe(1);
    });

    it("should allow re-registering after unregister all", () => {
      const eventHandler = new MockEventHandler();

      eventDispatcher.register("MockEvent", eventHandler);
      eventDispatcher.unregisterAll();
      eventDispatcher.register("MockEvent", eventHandler);

      const event = new MockEvent({ data: "test" });
      eventDispatcher.notify(event);

      expect(eventHandler.handledEvents.length).toBe(1);
    });

    it("should handle multiple events with multiple handlers", () => {
      const mockHandler1 = new MockEventHandler();
      const mockHandler2 = new MockEventHandler();
      const anotherHandler = new AnotherMockEventHandler();

      eventDispatcher.register("MockEvent", mockHandler1);
      eventDispatcher.register("MockEvent", mockHandler2);
      eventDispatcher.register("AnotherMockEvent", anotherHandler);

      eventDispatcher.notify(new MockEvent({ data: "mock1" }));
      eventDispatcher.notify(new MockEvent({ data: "mock2" }));
      eventDispatcher.notify(new AnotherMockEvent({ data: "another1" }));

      expect(mockHandler1.handledEvents.length).toBe(2);
      expect(mockHandler2.handledEvents.length).toBe(2);
      expect(anotherHandler.handledEvents.length).toBe(1);
    });
  });
});
