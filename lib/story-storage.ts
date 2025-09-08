/**
 * IndexedDB utility for storing generated stories and their images
 * This provides much larger storage capacity than localStorage
 */

export interface StoredStory {
  id: string;
  title: string;
  characterDescription: string;
  pages: Array<{
    pageNumber: number;
    text: string;
    imagePrompt: string;
    imageUrl?: string;
  }>;
  createdAt: Date;
  childName: string;
  childAge: number;
}

class StoryStorage {
  private dbName = "StorybookDB";
  private version = 1;
  private storeName = "stories";
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt", { unique: false });
          store.createIndex("childName", "childName", { unique: false });
        }
      };
    });
  }

  async saveStory(
    story: Omit<StoredStory, "id" | "createdAt">
  ): Promise<string> {
    await this.init();

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    const id = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const storyWithMeta: StoredStory = {
      ...story,
      id,
      createdAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(storyWithMeta);

      request.onsuccess = () => {
        console.log("Story saved to IndexedDB:", id);
        resolve(id);
      };

      request.onerror = () => {
        reject(new Error("Failed to save story to IndexedDB"));
      };
    });
  }

  async getStory(id: string): Promise<StoredStory | null> {
    await this.init();

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error("Failed to retrieve story from IndexedDB"));
      };
    });
  }

  async getAllStories(): Promise<StoredStory[]> {
    await this.init();

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        // Sort by creation date, newest first
        const stories = request.result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(stories);
      };

      request.onerror = () => {
        reject(new Error("Failed to retrieve stories from IndexedDB"));
      };
    });
  }

  async deleteStory(id: string): Promise<void> {
    await this.init();

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log("Story deleted from IndexedDB:", id);
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete story from IndexedDB"));
      };
    });
  }

  async updateStoryImages(id: string, images: string[]): Promise<void> {
    const story = await this.getStory(id);
    if (!story) {
      throw new Error("Story not found");
    }

    // Update pages with image URLs
    const updatedPages = story.pages.map((page, index) => ({
      ...page,
      imageUrl: images[index] || page.imageUrl,
    }));

    const updatedStory = {
      ...story,
      pages: updatedPages,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(updatedStory);

      request.onsuccess = () => {
        console.log("Story images updated in IndexedDB:", id);
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to update story images in IndexedDB"));
      };
    });
  }

  async clearAllStories(): Promise<void> {
    await this.init();

    if (!this.db) {
      throw new Error("Database not initialized");
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("All stories cleared from IndexedDB");
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to clear stories from IndexedDB"));
      };
    });
  }
}

// Export a singleton instance
export const storyStorage = new StoryStorage();
