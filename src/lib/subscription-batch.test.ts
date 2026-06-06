// Subscription batching tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { getSubscriptionDashboard } from './subscription';
import * as dbModule from './db';

vi.mock('./db', () => ({
  getDb: vi.fn()
}));

describe('getSubscriptionDashboard', () => {
  let getDbMock: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    getDbMock = dbModule.getDb as Mock;
  });

  it('should return null for non-existent business', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(null)
    };
    getDbMock.mockResolvedValue(mockDb);

    const result = await getSubscriptionDashboard('non-existent-id');
    expect(result).toBeNull();
  });

  it('should return subscription dashboard with all data in single call', async () => {
    const now = Date.now();
    const futureExpiry = now + 86400000;

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn()
    };
    // Business exists query
    mockDb.get
      .mockResolvedValueOnce({ id: 'biz-123' })
      // Order query - active paid order
      .mockResolvedValueOnce({
        servicePackageId: 'sp-basic-monthly',
        planExpiresAt: futureExpiry,
        paidDate: now,
        variantSnapshot: null,
        status: 'paid'
      })
      // SKU count
      .mockResolvedValueOnce({ count: 5 })
      // Plan slug lookup (servicePackage by id)
      .mockResolvedValueOnce({ slug: 'basic-monthly' })
      // Plan limits lookup (servicePackage by slug)
      .mockResolvedValueOnce({
        variants: JSON.stringify([{
          limits: { skuLimit: 10, maxImages: 16, maxVideos: 2 }
        }])
      });

    getDbMock.mockResolvedValue(mockDb);

    const result = await getSubscriptionDashboard('biz-123');

    expect(result).not.toBeNull();
    expect(result?.skuCount).toBe(5);
    expect(result?.skuLimit).toBe(10);
    expect(result?.status).toBe('active');
  });

  it('should handle businesses without subscription', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn()
    };

    mockDb.get
      // Business exists
      .mockResolvedValueOnce({ id: 'biz-no-sub' })
      // No orders
      .mockResolvedValueOnce(null)
      // SKU count
      .mockResolvedValueOnce({ count: 0 });

    getDbMock.mockResolvedValue(mockDb);

    const result = await getSubscriptionDashboard('biz-no-sub');

    expect(result).not.toBeNull();
    expect(result?.status).toBe('none');
    expect(result?.planSlug).toBeNull();
    expect(result?.skuLimit).toBe(0);
  });

  it('should handle expired subscription', async () => {
    const now = Date.now();
    // 31 days ago — past the 30-day grace period so status = 'expired'
    const pastExpiry = now - (31 * 86400000);

    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn()
    };

    mockDb.get
      .mockResolvedValueOnce({ id: 'biz-expired' })
      .mockResolvedValueOnce({
        servicePackageId: 'sp-basic-monthly',
        planExpiresAt: pastExpiry,
        paidDate: pastExpiry - 86400000,
        variantSnapshot: null,
        status: 'paid'
      })
      .mockResolvedValueOnce({ count: 3 })
      // Plan slug lookup (servicePackage by id)
      .mockResolvedValueOnce({ slug: 'basic-monthly' })
      // Plan limits lookup (servicePackage by slug) - returns null for expired (no plan)
      .mockResolvedValueOnce(null);

    getDbMock.mockResolvedValue(mockDb);

    const result = await getSubscriptionDashboard('biz-expired');

    expect(result).not.toBeNull();
    expect(result?.status).toBe('expired');
    expect(result?.isActive).toBe(false);
  });
});
