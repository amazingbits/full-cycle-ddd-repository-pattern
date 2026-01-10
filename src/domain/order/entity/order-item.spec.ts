import OrderItem from "./order-item";

describe("OrderItem unit tests", () => {
  describe("validation tests", () => {
    it("should throw error when id is empty", () => {
      expect(() => {
        new OrderItem("", "Item 1", 100, "p1", 1);
      }).toThrow("Id is required");
    });

    it("should throw error when productId is empty", () => {
      expect(() => {
        new OrderItem("i1", "Item 1", 100, "", 1);
      }).toThrow("ProductId is required");
    });

    it("should throw error when name is empty", () => {
      expect(() => {
        new OrderItem("i1", "", 100, "p1", 1);
      }).toThrow("Name is required");
    });

    it("should throw error when price is negative", () => {
      expect(() => {
        new OrderItem("i1", "Item 1", -1, "p1", 1);
      }).toThrow("Price must be greater than or equal to zero");
    });

    it("should throw error when quantity is zero", () => {
      expect(() => {
        new OrderItem("i1", "Item 1", 100, "p1", 0);
      }).toThrow("Quantity must be greater than zero");
    });

    it("should throw error when quantity is negative", () => {
      expect(() => {
        new OrderItem("i1", "Item 1", 100, "p1", -1);
      }).toThrow("Quantity must be greater than zero");
    });

    it("should accept price of zero", () => {
      const item = new OrderItem("i1", "Item 1", 0, "p1", 1);
      expect(item.price).toBe(0);
      expect(item.total()).toBe(0);
    });
  });

  describe("creation tests", () => {
    it("should create a valid order item", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);

      expect(item.id).toBe("i1");
      expect(item.name).toBe("Item 1");
      expect(item.price).toBe(100);
      expect(item.productId).toBe("p1");
      expect(item.quantity).toBe(2);
    });
  });

  describe("total calculation tests", () => {
    it("should calculate total correctly", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      expect(item.total()).toBe(200);
    });

    it("should calculate total correctly with decimal prices", () => {
      const item = new OrderItem("i1", "Item 1", 10.5, "p1", 3);
      expect(item.total()).toBe(31.5);
    });

    it("should return zero when price is zero", () => {
      const item = new OrderItem("i1", "Item 1", 0, "p1", 5);
      expect(item.total()).toBe(0);
    });
  });

  describe("change methods tests", () => {
    it("should change quantity successfully", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      item.changeQuantity(5);

      expect(item.quantity).toBe(5);
      expect(item.total()).toBe(500);
    });

    it("should throw error when changing to invalid quantity", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);

      expect(() => {
        item.changeQuantity(0);
      }).toThrow("Quantity must be greater than zero");

      expect(() => {
        item.changeQuantity(-1);
      }).toThrow("Quantity must be greater than zero");
    });

    it("should change price successfully", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      item.changePrice(150);

      expect(item.price).toBe(150);
      expect(item.total()).toBe(300);
    });

    it("should throw error when changing to negative price", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);

      expect(() => {
        item.changePrice(-1);
      }).toThrow("Price must be greater than or equal to zero");
    });

    it("should allow changing price to zero", () => {
      const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
      item.changePrice(0);

      expect(item.price).toBe(0);
      expect(item.total()).toBe(0);
    });
  });
});
