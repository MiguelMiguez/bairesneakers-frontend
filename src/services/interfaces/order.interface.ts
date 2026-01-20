// ===========================================
// SERVICES - ORDER SERVICE INTERFACE
// ===========================================

import { 
  Order, 
  CreateOrderDTO, 
  PaginatedResponse, 
  PaginationOptions,
  MercadoPagoPreference 
} from '@/types';

/**
 * Interface que define el contrato del servicio de órdenes
 */
export interface IOrderService {
  /**
   * Obtiene una orden por su ID
   */
  getOrderById(id: string): Promise<Order>;

  /**
   * Obtiene una orden por su número
   */
  getOrderByNumber(orderNumber: string): Promise<Order>;

  /**
   * Obtiene las órdenes del usuario actual
   */
  getMyOrders(pagination?: PaginationOptions): Promise<PaginatedResponse<Order>>;

  /**
   * Obtiene todas las órdenes (Admin only)
   */
  getAllOrders(pagination?: PaginationOptions): Promise<PaginatedResponse<Order>>;

  /**
   * Crea una nueva orden
   */
  createOrder(order: CreateOrderDTO): Promise<Order>;

  /**
   * Cancela una orden
   */
  cancelOrder(orderId: string): Promise<Order>;

  /**
   * Actualiza el estado de una orden (Admin only)
   */
  updateOrderStatus(orderId: string, status: string): Promise<Order>;
}

/**
 * Interface para el servicio de pagos
 */
export interface IPaymentService {
  /**
   * Crea una preferencia de pago en MercadoPago
   */
  createPaymentPreference(orderId: string): Promise<MercadoPagoPreference>;
}
