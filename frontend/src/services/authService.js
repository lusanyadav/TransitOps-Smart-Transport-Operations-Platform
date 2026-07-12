/**
 * ============================================================================
 * Auth Service
 * ============================================================================
 * API Base URL:
 * http://localhost:5555
 *
 * Endpoints:
 * POST /user/signin
 * POST /user/signup
 * ============================================================================
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555";

/**
 * Creates a consistent error object.
 */
const throwApiError = (message) => {
  const error = new Error(message);
  error.message = message;
  throw error;
};

/**
 * Generic POST request helper.
 */
async function apiPost(path, body) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throwApiError("Could not connect to the server. Please try again.");
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throwApiError(data.message || "Something went wrong.");
  }

  return data;
}

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Sign In
   *
   * Request:
   * {
   *   email,
   *   password
   * }
   *
   * Response:
   * {
   *   message,
   *   user,
   *   token
   * }
   */
  async signIn(credentials) {
    return await apiPost("/user/signin", credentials);
  },

  /**
   * Sign Up
   *
   * Request:
   * {
   *   email,
   *   password,
   *   role,
   *   full_name
   * }
   *
   * Response:
   * {
   *   message,
   *   user,
   *   token
   * }
   */
  async signUp(details) {
    return await apiPost("/user/signup", details);
  },
};