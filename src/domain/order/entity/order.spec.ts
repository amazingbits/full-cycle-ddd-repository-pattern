import Order from "./order";
import OrderItem from "./order-item";

describe("Order unit tests", () => {
  describe("validation tests", () => {
    it("should throw error when id is empty", () => {
      expect(() => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
        new Order("", "123", [item]);
      }).toThrow("Id is required");
    });

    it("should throw error when customerId is empty", () => {
      expect(() => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 1);
        new Order("123", "", [item]);
      }).toThrow("CustomerId is required");
    });

    it("should throw error when items is empty", () => {
      expect(() => {
        new Order("123", "123", []);
      }).toThrow("Items are required");
    });

    it("should throw error if the item quantity is zero", () => {
      expect(() => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
        new Order("o1", "c1", [item]);
      }).toThrow("Quantity must be greater than zero");
    });

    it("should throw error if any item quantity is less or equal to zero", () => {
      expect(() => {
        const item1 = new OrderItem("i1", "Item 1", 100, "p1", 1);
        const item2 = new OrderItem("i2", "Item 2", 200, "p2", 0);
        new Order("o1", "c1", [item1, item2]);
      }).toThrow("Quantity must be greater than zero");
    });
  });

  describe("creation tests", () => {
    it("should create a valid order with one item", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);

      expect(order.id).toBe("o1");
      expect(order.customerId).toBe("c1");
      expect(order.items).toHaveLength(1);
      expect(order.items[0]).toBe(item);
    });

    it("should create a valid order with multiple items", () => {
      const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 3);
      const order = new Order("o1", "c1", [item1, item2]);

      expect(order.id).toBe("o1");
      expect(order.customerId).toBe("c1");
      expect(order.items).toHaveLength(2);
    });
  });

  describe("total calculation tests", () => {
    it("should calculate total with one item", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);

      expect(order.total()).toBe(200);
    });

    it("should calculate total with multiple items", () => {
      const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
      const order = new Order("o1", "c1", [item1, item2]);

      expect(order.total()).toBe(600);
    });

    it("should calculate total correctly with decimal prices", () => {
      const item1 = new OrderItem("i1", "Item 1", 10.5, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 20.75, "p2", 3);
      const order = new Order("o1", "c1", [item1, item2]);

      expect(order.total()).toBe(83.25);
    });
  });

  describe("item management tests", () => {
    it("should add item to order", () => {
      const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item1]);

      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 1);
      order.addItem(item2);

      expect(order.items).toHaveLength(2);
      expect(order.total()).toBe(400);
    });

    it("should throw error when adding item with invalid quantity", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);

      expect(() => {
        const invalidItem = new OrderItem("i2", "Item 2", 200, "p2", 0);
        order.addItem(invalidItem);
      }).toThrow("Quantity must be greater than zero");
    });

    it("should remove item from order", () => {
      const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 1);
      const order = new Order("o1", "c1", [item1, item2]);

      order.removeItem("i1");

      expect(order.items).toHaveLength(1);
      expect(order.items[0].id).toBe("i2");
      expect(order.total()).toBe(200);
    });

    it("should throw error when removing last item", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);

      expect(() => {
        order.removeItem("i1");
      }).toThrow("Items are required");
    });

    it("should change all items", () => {
      const item1 = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item1]);

      const item2 = new OrderItem("i2", "Item 2", 200, "p2", 3);
      const item3 = new OrderItem("i3", "Item 3", 150, "p3", 1);
      order.changeItems([item2, item3]);

      expect(order.items).toHaveLength(2);
      expect(order.total()).toBe(750);
    });

    it("should throw error when changing to empty items", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      const order = new Order("o1", "c1", [item]);

      expect(() => {
        order.changeItems([]);
      }).toThrow("Items are required");
    });
  });
});
