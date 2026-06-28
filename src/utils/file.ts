import { BASE_URL } from "@/Api/ApiConstants";

/**
 * Formats a file path or key into a full URL.
 * If the path is already a full URL or base64, it returns it as is.
 * Otherwise, it prepends the API's file retrieval endpoint.
 * 
 * @param path The file path or key (e.g., from user.avatar)
 * @returns The full URL to the file
 */
export const getFileUrl = (path: string | null | undefined): string | undefined => {
    if (!path) return undefined;

    // If it's already a full URL or a relative path that shouldn't be prefixed
    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:") ||
        path.startsWith("/")
    ) {
        return path;
    }

    // Prepend the base URL and file get endpoint
    return `${BASE_URL}/file/get/${path}`;
};
