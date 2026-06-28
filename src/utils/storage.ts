import type { UserReview, Address } from "../types";

const REVIEWS_KEY = "user_reviews";
const ADDRESSES_KEY = "user_addresses";

function readReviews(): UserReview[] {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UserReview[];
  } catch {
    return [];
  }
}

function writeReviews(reviews: UserReview[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function getUserReviews(userId: number): UserReview[] {
  return readReviews().filter((r) => r.userId === userId);
}

export function getProductReviews(productId: string): UserReview[] {
  return readReviews().filter((r) => r.productId === productId);
}

export function upsertReview(review: UserReview): void {
  const all = readReviews();
  const idx = all.findIndex(
    (r) => r.userId === review.userId && r.productId === review.productId
  );
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...review };
  } else {
    all.push(review);
  }
  writeReviews(all);
}

export function deleteReview(userId: number, productId: string): void {
  const all = readReviews().filter(
    (r) => !(r.userId === userId && r.productId === productId)
  );
  writeReviews(all);
}

// --------------------
// Address helpers
// --------------------

function readAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Address[];
  } catch {
    return [];
  }
}

function writeAddresses(addresses: Address[]) {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

export function getUserAddresses(userId: number): Address[] {
  return readAddresses().filter((a) => a.userId === userId);
}

export function upsertAddress(address: Address): void {
  const all = readAddresses();
  const idx = all.findIndex(
    (a) => a.id === address.id && a.userId === address.userId
  );
  // Eğer isDefault true ise, aynı kullanıcıdaki diğer adresleri default=false yap
  let updated = all.map((a) =>
    address.isDefault && a.userId === address.userId
      ? { ...a, isDefault: false }
      : a
  );
  if (idx >= 0) {
    updated[idx] = { ...updated[idx], ...address };
  } else {
    updated.push(address);
  }
  writeAddresses(updated);
}

export function deleteAddress(userId: number, addressId: string): void {
  const all = readAddresses().filter(
    (a) => !(a.userId === userId && a.id === addressId)
  );
  writeAddresses(all);
}

export function setDefaultAddress(userId: number, addressId: string): void {
  const all = readAddresses();
  const updated = all.map((a) =>
    a.userId === userId ? { ...a, isDefault: a.id === addressId } : a
  );
  writeAddresses(updated);
}
