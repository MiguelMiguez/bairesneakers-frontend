// ===========================================
// SERVICES - ORDER SERVICE IMPLEMENTATION
// ===========================================

import { httpClient } from './http.service';
import { IOrderService, IPaymentService } from './interfaces';
import { 
  Order, 
  CreateOrderDTO, 
  PaginatedResponse, 
  PaginationOptions,
  MercadoPagoPreference 
} from '@/types';

/**
 * Implementación del servicio de órdenes
 */
class OrderService implements IOrderService {
  private readonly endpoint = '/orders';

  async getOrderById(id: string): Promise<Order> {
    return httpClient.get<Order>(`${this.endpoint}/${id}`);
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    return httpClient.get<Order>(`${this.endpoint}/number/${orderNumber}`);
  }

  async getMyOrders(pagination?: PaginationOptions): Promise<PaginatedResponse<Order>> {
    const params: Record<string, string> = {};

    if (pagination) {
      params.page = String(pagination.page);
      params.limit = String(pagination.limit);
    }

    return httpClient.get<PaginatedResponse<Order>>(this.endpoint, params);
  }

  async getAllOrders(pagination?: PaginationOptions): Promise<PaginatedResponse<Order>> {
    // Misma implementación, el backend diferencia por rol
    return this.getMyOrders(pagination);
  }

  async createOrder(order: CreateOrderDTO): Promise<Order> {
    return httpClient.post<Order>(this.endpoint, order);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return httpClient.post<Order>(`${this.endpoint}/${orderId}/cancel`);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return httpClient.patch<Order>(`${this.endpoint}/${orderId}/status`, { status });
  }
}

/**
 * Implementación del servicio de pagos
 */
class PaymentService implements IPaymentService {
  private readonly endpoint = '/payments';

  async createPaymentPreference(orderId: string): Promise<MercadoPagoPreference> {
    return httpClient.post<MercadoPagoPreference>(
      `${this.endpoint}/create-preference`,
      { orderId }
    );
  }
}

// Singleton instances
export const orderService = new OrderService();
export const paymentService = new PaymentService();
