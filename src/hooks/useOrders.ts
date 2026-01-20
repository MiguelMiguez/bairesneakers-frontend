// ===========================================
// HOOKS - USE ORDERS
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { orderService, paymentService } from '@/services';
import { 
  Order, 
  CreateOrderDTO, 
  PaginatedResponse,
  MercadoPagoPreference 
} from '@/types';

/**
 * Custom Hook para manejar órdenes del usuario
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Order>['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await orderService.getMyOrders({ page, limit });
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    pagination,
    isLoading,
    error,
    refetch: fetchOrders,
  };
}

/**
 * Custom Hook para obtener una orden específica
 */
export function useOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch order'));
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    isLoading,
    error,
    refetch: fetchOrder,
  };
}

/**
 * Custom Hook para crear órdenes y manejar pagos
 */
export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createOrder = useCallback(async (orderData: CreateOrderDTO): Promise<Order> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = await orderService.createOrder(orderData);
      return order;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create order');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPaymentPreference = useCallback(async (orderId: string): Promise<MercadoPagoPreference> => {
    setIsLoading(true);
    setError(null);

    try {
      const preference = await paymentService.createPaymentPreference(orderId);
      return preference;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create payment preference');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(async (orderId: string): Promise<Order> => {
    setIsLoading(true);
    setError(null);

    try {
      const order = await orderService.cancelOrder(orderId);
      return order;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel order');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createOrder,
    createPaymentPreference,
    cancelOrder,
    isLoading,
    error,
  };
}
