import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { CREATE_USER } from "../../graphql/mutation";
import { CreateUserMutation, CreateUserVars } from "../../types/users";

export function useSignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [createUser, { loading }] = useMutation<CreateUserMutation, CreateUserVars>(
    CREATE_USER,
    {
      onCompleted: (data) => {
        const response = data.createUsersMutation.response;
        if (response.status) {
          toast.success("Account created successfully! Please sign in.");
          navigate("/");
        } else {
          toast.error(response.message || "Failed to create account");
        }
      },
      onError: (err) => {
        console.error("Signup error:", err);
        toast.error(err.message || "Failed to create account");
        setError(err.message);
      },
    }
  );

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setError(null);

    if (!firstName || !lastName || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    await createUser({
      variables: {
        input: {
          profileUniqueId: null,
          userFirstName: firstName,
          userLastName: lastName,
          userEmail: email,
          profilePhone: "",
          profileTitle: "",
          profilePhoto: "",
          profileGender: "MALE",
          profileType: "NORMAL_PROFILE",
          profileLevel: "DISTRICT",
          roleUniqueId: null,
          password: password,
        },
      },
    });
  };

  return { signUp, loading, error };
}
