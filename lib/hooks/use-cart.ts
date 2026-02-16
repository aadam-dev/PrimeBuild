"use client";

import { useSyncExternalStore } from "react";

const CART_KEY = "primebuild_cart";

export type CartEntry = { productId: string; quantity: number };

const emptyCart: CartEntry[] = [];

let cachedRaw: string | null = null;
let cachedSnapshot: CartEntry[] = emptyCart;

function getSnapshot(): CartEntry[] {
  if (typeof window === "undefined") return emptyCart;
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw === cachedRaw) return cachedSnapshot;
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = emptyCart;
      return emptyCart;
    }
    const parsed = JSON.parse(raw) as CartEntry[];
    cachedSnapshot = Array.isArray(parsed) ? parsed : emptyCart;
    return cachedSnapshot;
  } catch {
    cachedRaw = null;
    cachedSnapshot = emptyCart;
    return emptyCart;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): CartEntry[] {
  return emptyCart;
}

export function useCart(): CartEntry[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useCartCount(): number {
  const cart = useCart();
  return cart.reduce((sum, e) => sum + e.quantity, 0);
}

export function getCartFromStorage(): CartEntry[] {
  return getSnapshot();
}

export function setCartToStorage(entries: CartEntry[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("storage"));
}

export function addToCart(productId: string, quantity: number) {
  const cart = getCartFromStorage();
  const i = cart.findIndex((e) => e.productId === productId);
  if (i >= 0) {
    cart[i].quantity += quantity;
    if (cart[i].quantity <= 0) {
      cart.splice(i, 1);
    }
  } else if (quantity > 0) {
    cart.push({ productId, quantity });
  }
  setCartToStorage(cart);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCartFromStorage();
  const i = cart.findIndex((e) => e.productId === productId);
  if (i >= 0) {
    if (quantity <= 0) {
      cart.splice(i, 1);
    } else {
      cart[i].quantity = quantity;
    }
  } else if (quantity > 0) {
    cart.push({ productId, quantity });
  }
  setCartToStorage(cart);
}

export function removeFromCart(productId: string) {
  updateCartQuantity(productId, 0);
}
