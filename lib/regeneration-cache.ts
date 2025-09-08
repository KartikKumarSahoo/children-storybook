/**
 * Regeneration Cache Management
 * Provides caching for regeneration requests to avoid redundant API calls
 * and improve performance. Implements both memory and localStorage caching.
 */

import { StoredStory } from "./story-storage";

export interface RegenerationCacheKey {
  storyId: string;
  regenerationType: "story" | "images" | "page";
  pageNumbers?: number[];
  modifiedParams?: Record<string, unknown>;
  paramHash?: string; // Hash of parameters for efficient comparison
}

export interface RegenerationCacheEntry {
  key: RegenerationCacheKey;
  result: StoredStory; // The cached regeneration result
  timestamp: number;
  expiresAt: number;
}

export class RegenerationCache {
  private memoryCache = new Map<string, RegenerationCacheEntry>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_MEMORY_ENTRIES = 50;
  private readonly STORAGE_KEY = "storybook_regeneration_cache";

  constructor() {
    this.loadFromStorage();
    this.startCleanupInterval();
  }

  /**
   * Generate a cache key from regeneration parameters
   */
  private generateCacheKey(params: RegenerationCacheKey): string {
    const { storyId, regenerationType, pageNumbers, modifiedParams } = params;

    const keyParts = [storyId, regenerationType];

    if (pageNumbers && pageNumbers.length > 0) {
      keyParts.push(`pages:${pageNumbers.sort().join(",")}`);
    }

    if (modifiedParams && Object.keys(modifiedParams).length > 0) {
      // Create a stable hash of the modified parameters
      const paramString = JSON.stringify(
        modifiedParams,
        Object.keys(modifiedParams).sort()
      );
      const paramHash = this.simpleHash(paramString);
      keyParts.push(`params:${paramHash}`);
    }

    return keyParts.join("|");
  }

  /**
   * Simple hash function for parameter objects
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Check if a regeneration result is cached and still valid
   */
  get(params: RegenerationCacheKey): RegenerationCacheEntry | null {
    const key = this.generateCacheKey(params);
    const entry = this.memoryCache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Cache a regeneration result
   */
  set(params: RegenerationCacheKey, result: StoredStory): void {
    const key = this.generateCacheKey(params);
    const timestamp = Date.now();
    const expiresAt = timestamp + this.CACHE_DURATION;

    const entry: RegenerationCacheEntry = {
      key: params,
      result,
      timestamp,
      expiresAt,
    };

    this.memoryCache.set(key, entry);

    // Enforce memory cache size limit
    if (this.memoryCache.size > this.MAX_MEMORY_ENTRIES) {
      this.evictOldestEntries();
    }

    this.saveToStorage();
  }

  /**
   * Remove oldest entries when cache is full
   */
  private evictOldestEntries(): void {
    const entries = Array.from(this.memoryCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    // Remove oldest 25% of entries
    const entriesToRemove = Math.floor(entries.length * 0.25);
    for (let i = 0; i < entriesToRemove; i++) {
      this.memoryCache.delete(entries[i][0]);
    }
  }

  /**
   * Check if a specific regeneration request is already cached
   */
  has(params: RegenerationCacheKey): boolean {
    return this.get(params) !== null;
  }

  /**
   * Invalidate cache entries for a specific story
   */
  invalidateStory(storyId: string): void {
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.key.storyId === storyId) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.memoryCache.delete(key));
    this.saveToStorage();
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.memoryCache.clear();
    this.clearStorage();
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number;
    memoryUsage: number;
    oldestEntry?: Date;
    newestEntry?: Date;
  } {
    const entries = Array.from(this.memoryCache.values());

    if (entries.length === 0) {
      return { totalEntries: 0, memoryUsage: 0 };
    }

    const timestamps = entries.map((entry) => entry.timestamp);
    const oldestTimestamp = Math.min(...timestamps);
    const newestTimestamp = Math.max(...timestamps);

    return {
      totalEntries: entries.length,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: new Date(oldestTimestamp),
      newestEntry: new Date(newestTimestamp),
    };
  }

  /**
   * Estimate memory usage of cache entries
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0;
    for (const entry of this.memoryCache.values()) {
      totalSize += JSON.stringify(entry).length * 2; // Rough estimate (UTF-16)
    }
    return totalSize;
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const entries: RegenerationCacheEntry[] = JSON.parse(stored);
      const now = Date.now();

      for (const entry of entries) {
        // Only load entries that haven't expired
        if (entry.expiresAt > now) {
          const key = this.generateCacheKey(entry.key);
          this.memoryCache.set(key, entry);
        }
      }
    } catch (error) {
      console.warn("Failed to load regeneration cache from storage:", error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const entries = Array.from(this.memoryCache.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn("Failed to save regeneration cache to storage:", error);
    }
  }

  /**
   * Clear cache from localStorage
   */
  private clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear regeneration cache from storage:", error);
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 5 * 60 * 1000); // Clean up every 5 minutes
  }

  /**
   * Remove expired entries from cache
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt <= now) {
        keysToDelete.push(key);
      }
    }

    if (keysToDelete.length > 0) {
      keysToDelete.forEach((key) => this.memoryCache.delete(key));
      this.saveToStorage();
    }
  }
}

// Singleton instance
export const regenerationCache = new RegenerationCache();
