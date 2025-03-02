import { create } from 'zustand';
import { AuthState, User, UserType } from '../types';

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {

        const response = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        
        const text = await response.text(); // Read response as text to check errors

        if (!response.ok) {
            throw new Error("Login failed: " + text);
        }

        const data = JSON.parse(text); // Convert response back to JSON

        const { user, accessToken } = data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        set({ user, isAuthenticated: true });

    } catch (error) {
        console.error(' Login failed:', error);
        throw new Error('Login failed. Please check your credentials.');
    }
  },

  register: async (fullname: string, email: string, password: string, userType: UserType): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password, userType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      const registeredUser: User = {
        id: data.data._id, // Assuming your API returns `_id`
        fullname: data.data.fullname,
        email: data.data.email,
        userType: data.data.userType,
      };

      set({ user: registeredUser, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(registeredUser));
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },

  
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
  },
  
  updateUser: async (userData: Partial<User>) => {
    try {
        const accessToken = localStorage.getItem("accessToken"); // Get token
        if (!accessToken) throw new Error("Unauthorized");

        const response = await fetch("http://localhost:3000/api/v1/users/update-account", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`, // Send token for authentication
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update user");
        }

        const updatedUser = await response.json();
        console.log("Updated user:", updatedUser);

        // Update state and localStorage
        set((state) => ({
            user: state.user ? { ...state.user, ...updatedUser.data } : null,
        }));

        localStorage.setItem("user", JSON.stringify(updatedUser.data));

    } catch (error) {
        console.error("Update failed:", error);
        throw new Error("Something went wrong");
    }
  },

changePassword: async (oldPassword: string, newPassword: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Unauthorized");

    const response = await fetch("http://localhost:3000/api/v1/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to change password");
    }

    // Logout the user after password change
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    return data.message;
  } catch (error) {
    console.error("Password change failed:", error);
    throw new Error(error instanceof Error ? error.message : "Something went wrong");
  }
},
}));

// Initialize auth state from localStorage on app load
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({ user, isAuthenticated: true });
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('user');
    }
  }
}

export default useAuthStore;