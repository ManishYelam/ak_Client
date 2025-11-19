// ✅ src/utils/getUserId.js
export const getUserId = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const parsedUser = JSON.parse(user);
    return parsedUser?.id;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

export const getUserToken = () => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    const parsedUser = JSON.parse(user);
    return parsedUser?.token || null;
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
    return null;
  }
};

export const getUserData = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};
