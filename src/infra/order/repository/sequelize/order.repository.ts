import Order from "../../../../domain/order/entity/order";
import OrderItem from "../../../../domain/order/entity/order-item";
import OrderRepositoryInterface from "../../../../domain/order/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.sequelize.transaction(async (transaction) => {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
        transaction,
      });

      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: { id: entity.id },
          transaction,
        },
      );

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
        order_id: entity.id,
      }));

      await OrderItemModel.bulkCreate(items, { transaction });
    });
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: [{ model: OrderItemModel, as: "items" }],
        rejectOnEmpty: true,
      });
    } catch (_error) {
      throw new Error("Order not found");
    }

    const items = orderModel.items.map(
      (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity),
    );

    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel, as: "items" }],
    });

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (item) => new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity),
      );
      return new Order(orderModel.id, orderModel.customer_id, items);
    });
  }
}
