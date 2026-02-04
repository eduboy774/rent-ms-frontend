import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { getUserProfileAndRole } from "../../services/userService";
import { useUserContext } from "../../store/userContext";

export function useSignIn() {
  const navigate = useNavigate()
  const notifyError = () => toast.error("Invalid credentials");
  const notifySuccess = () => toast.success("Login successful");
  const { setUserProfileAndRoleData } = useUserContext();

  const authenticate = async (username: string, password: string) => {
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
    const AUTH_URL = import.meta.env.VITE_AUTH_URL;

    if (!CLIENT_ID || !CLIENT_SECRET || !AUTH_URL) {
      notifyError();
      return;
    }

    const body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", username);
    body.append("password", password);
    body.append("client_id", CLIENT_ID);
    body.append("client_secret", CLIENT_SECRET);

    try {
      const response = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();
      const accessToken = data?.access_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        notifySuccess();
        try {

             await getUserProfileAndRole(accessToken, setUserProfileAndRoleData);

            } catch (e) {
             console.error("Error after login while fetching profile data:", e);
            }
        navigate("/home");
      } else {
        notifyError();
      }
    } catch (err) {
      console.error("Login error:", err);
      notifyError();
    }
  };

  return { authenticate };
}
