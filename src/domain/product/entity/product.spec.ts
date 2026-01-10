import Product from "./product";

describe("Product unit tests", () => {
  describe("validation tests", () => {
    it("should throw error when id is empty", () => {
      expect(() => {
        new Product("", "Product 1", 100);
      }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
      expect(() => {
        new Product("123", "", 100);
      }).toThrow("Name is required");
    });

    it("should throw error when price is negative", () => {
      expect(() => {
        new Product("123", "Name", -1);
      }).toThrow("Price must be greater than or equal to zero");
    });

    it("should accept price of zero", () => {
      const product = new Product("123", "Product 1", 0);
      expect(product.price).toBe(0);
    });
  });

  describe("creation tests", () => {
    it("should create a valid product", () => {
      const product = new Product("123", "Product 1", 100);

      expect(product.id).toBe("123");
      expect(product.name).toBe("Product 1");
      expect(product.price).toBe(100);
    });

    it("should create a product with decimal price", () => {
      const product = new Product("123", "Product 1", 99.99);
      expect(product.price).toBe(99.99);
    });
  });

  describe("change methods tests", () => {
    it("should change name successfully", () => {
      const product = new Product("123", "Product 1", 100);
      product.changeName("Product 2");
      expect(product.name).toBe("Product 2");
    });

    it("should throw error when changing name to empty", () => {
      const product = new Product("123", "Product 1", 100);
      expect(() => {
        product.changeName("");
      }).toThrow("Name is required");
    });

    it("should change price successfully", () => {
      const product = new Product("123", "Product 1", 100);
      product.changePrice(150);
      expect(product.price).toBe(150);
    });

    it("should throw error when changing price to negative", () => {
      const product = new Product("123", "Product 1", 100);
      expect(() => {
        product.changePrice(-10);
      }).toThrow("Price must be greater than or equal to zero");
    });

    it("should allow changing price to zero", () => {
      const product = new Product("123", "Product 1", 100);
      product.changePrice(0);
      expect(product.price).toBe(0);
    });
  });
});
