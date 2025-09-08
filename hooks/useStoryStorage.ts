"use client";

import { StoredStory, storyStorage } from "@/lib/story-storage";
import { useEffect, useState } from "react";

export function useStoryStorage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveStory = async (story: Omit<StoredStory, "id" | "createdAt">) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await storyStorage.saveStory(story);
      return id;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save story";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const story = await storyStorage.getStory(id);
      return story;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get story";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stories = await storyStorage.getAllStories();
      return stories;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get stories";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStory = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await storyStorage.deleteStory(id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete story";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStoryImages = async (id: string, images: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await storyStorage.updateStoryImages(id, images);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update story images";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveStory,
    getStory,
    getAllStories,
    deleteStory,
    updateStoryImages,
    isLoading,
    error,
  };
}

export function useStoredStories() {
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allStories = await storyStorage.getAllStories();
      setStories(allStories);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load stories";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  return {
    stories,
    isLoading,
    error,
    refresh: loadStories,
  };
}
