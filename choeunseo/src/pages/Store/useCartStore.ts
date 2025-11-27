// src/pages/Store/useCartStore.ts
import { create } from "zustand";

export interface Menu {
  id?: number;
  name: string;
  price: number;
  ingredients?: string;
  quantity: number;
}

export interface CartStore {
  storeId: number | null;
  storeName: string | null;
  deliveryFee: number;
  minOrderPrice: number;
  menus: Menu[];
  totalOrderAmount: number;

  addMenu: (
    store: {
      storeId: number;
      storeName: string;
      deliveryFee?: number;
      minOrderPrice?: number;
    },
    menu: Menu
  ) => void;

  clearCart: () => void;
  removeMenuAtIndex: (index: number) => void;
}

const useCartStore = create<CartStore>((set, get) => ({
  storeId: null,
  storeName: null,
  deliveryFee: 2000,
  minOrderPrice: 0,
  menus: [],
  totalOrderAmount: 0,
  
  addMenu: (store, menu) => {
    const state = get();

    if (state.storeId !== null && state.storeId !== store.storeId) {
      const keep = window.confirm(
        "다른 가게의 메뉴를 담으려고 합니다. 기존 장바구니를 초기화하고 새 가게의 메뉴로 교체할까요?"
      );
      if (!keep) return;
      set({
        storeId: store.storeId,
        storeName: store.storeName,
        deliveryFee: store.deliveryFee ?? 2000,
        minOrderPrice: store.minOrderPrice ?? 0,
        menus: [menu],
      });
      return;
    }

    // 같은 가게거나 빈 장바구니인 경우
    set((s) => {
      const existingMenuIndex = s.menus.findIndex(
        (m) => m.name === menu.name && m.price === menu.price
      );
      
      let nextMenus;
      
      if (existingMenuIndex !== -1) {
        // 2-1. 이미 존재하는 메뉴인 경우: 수량만 1 증가
        nextMenus = s.menus.map((m, index) =>
          index === existingMenuIndex
            ? { ...m, quantity: m.quantity + 1 }
            : m
        );
      } else {
        // 2-2. 새로운 메뉴인 경우: quantity: 1로 추가
        nextMenus = [...s.menus, { ...menu, quantity: 1 }];
      }
      
      // 3. 총 주문 금액 재계산
      const nextTotal = nextMenus.reduce(
        (acc, m) => acc + (m.price * m.quantity), // 💰 가격 * 수량으로 계산
        0
      );
      return {
        storeId: store.storeId,
        storeName: store.storeName,
        deliveryFee: store.deliveryFee ?? 2000,
        minOrderPrice: store.minOrderPrice ?? 0,
        menus: nextMenus,
        totalOrderAmount: nextTotal // ✨ total 업데이트
      };
    });
  },

  clearCart: () =>
    set({
      storeId: null,
      storeName: null,
      deliveryFee: 2000,
      minOrderPrice: 0,
      menus: [],
      totalOrderAmount: 0,
    }),

  removeMenuAtIndex: (index) =>
    set((s) => {
      const next = s.menus.filter((_, i) => i !== index);
      if (next.length === 0) {
        return {
          storeId: null,
          storeName: null,
          deliveryFee: 2000,
          minOrderPrice: 0,
          menus: [],
          totalOrderAmount: 0,
        };
      }
      
      // 💰 가격 * 수량으로 재계산
      const nextTotal = next.reduce((acc, m) => acc + (m.price * m.quantity), 0);
      
      return { ...s, menus: next, totalOrderAmount: nextTotal };
    }),
}));

export default useCartStore;