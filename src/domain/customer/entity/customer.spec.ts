import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  describe("validation tests", () => {
    it("should throw error when id is empty", () => {
      expect(() => {
        new Customer("", "John");
      }).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
      expect(() => {
        new Customer("123", "");
      }).toThrow("Name is required");
    });
  });

  describe("creation tests", () => {
    it("should create a valid customer", () => {
      const customer = new Customer("123", "John");

      expect(customer.id).toBe("123");
      expect(customer.name).toBe("John");
      expect(customer.rewardPoints).toBe(0);
      expect(customer.isActive()).toBe(false);
    });
  });

  describe("name change tests", () => {
    it("should change name successfully", () => {
      const customer = new Customer("123", "John");
      customer.changeName("Jane");
      expect(customer.name).toBe("Jane");
    });

    it("should throw error when changing name to empty", () => {
      const customer = new Customer("123", "John");
      expect(() => {
        customer.changeName("");
      }).toThrow("Name is required");
    });
  });

  describe("address tests", () => {
    it("should change address successfully", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.changeAddress(address);

      expect(customer.Address).toBe(address);
    });

    it("should set address using setter", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.Address = address;

      expect(customer.Address).toBe(address);
    });
  });

  describe("activation tests", () => {
    it("should activate customer with valid address", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.Address = address;

      customer.activate();

      expect(customer.isActive()).toBe(true);
    });

    it("should throw error when address is undefined on activation", () => {
      expect(() => {
        const customer = new Customer("1", "Customer 1");
        customer.activate();
      }).toThrow("Address is mandatory to activate a customer");
    });

    it("should remain active after setting address", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.Address = address;
      customer.activate();

      const newAddress = new Address("Street 2", 456, "13330-251", "Rio de Janeiro");
      customer.changeAddress(newAddress);

      expect(customer.isActive()).toBe(true);
    });
  });

  describe("deactivation tests", () => {
    it("should deactivate customer", () => {
      const customer = new Customer("1", "Customer 1");

      customer.deactivate();

      expect(customer.isActive()).toBe(false);
    });

    it("should deactivate an active customer", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
      customer.Address = address;
      customer.activate();

      expect(customer.isActive()).toBe(true);

      customer.deactivate();

      expect(customer.isActive()).toBe(false);
    });
  });

  describe("reward points tests", () => {
    it("should start with zero reward points", () => {
      const customer = new Customer("1", "Customer 1");
      expect(customer.rewardPoints).toBe(0);
    });

    it("should add reward points", () => {
      const customer = new Customer("1", "Customer 1");

      customer.addRewardPoints(10);
      expect(customer.rewardPoints).toBe(10);

      customer.addRewardPoints(10);
      expect(customer.rewardPoints).toBe(20);
    });

    it("should accumulate reward points correctly", () => {
      const customer = new Customer("1", "Customer 1");

      customer.addRewardPoints(100);
      customer.addRewardPoints(50);
      customer.addRewardPoints(25);

      expect(customer.rewardPoints).toBe(175);
    });
  });
});
