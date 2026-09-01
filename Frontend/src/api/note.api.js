import axiosInstance from "./axiosInstance";
import { NOTE_ENDPOINTS } from "../utils/constants";

export const createNoteApi = async ({ videoId, timestamp, title, content, codeSnippet, codeLanguage, isPrivate }) => {
  const response = await axiosInstance.post(NOTE_ENDPOINTS.BASE, {
    videoId,
    timestamp,
    title,
    content,
    codeSnippet,
    codeLanguage,
    isPrivate,
  });
  return response.data;
};

export const getVideoNotesApi = async (videoId) => {
  const response = await axiosInstance.get(NOTE_ENDPOINTS.BY_VIDEO(videoId));
  return response.data;
};

export const updateNoteApi = async ({ noteId, title, content, codeSnippet, codeLanguage, timestamp }) => {
  const response = await axiosInstance.patch(NOTE_ENDPOINTS.DETAIL(noteId), {
    title,
    content,
    codeSnippet,
    codeLanguage,
    timestamp,
  });
  return response.data;
};

export const deleteNoteApi = async (noteId) => {
  const response = await axiosInstance.delete(NOTE_ENDPOINTS.DETAIL(noteId));
  return response.data;
};

export const exportNotesApi = async (videoId) => {
  const response = await axiosInstance.get(NOTE_ENDPOINTS.EXPORT(videoId));
  return response.data;
};
