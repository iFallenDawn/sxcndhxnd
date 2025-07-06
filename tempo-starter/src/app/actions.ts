"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import usersUtil from '../utils/users'
import validation from '../utils/validation'

export const signUpAction = async (formData: FormData) => {
  let firstName = formData.get("first_name")?.toString();
  const lastName = formData.get("last_name")?.toString() || '';
  const instagram = formData.get("instagram")?.toString() || '';
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!firstName || !lastName || !email || !password || !instagram) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "First name, Last name, Email, password, and Instagram are required",
    );
  }

  const fullName = `${firstName} ${lastName}`

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
        first_name: firstName,
        last_name: lastName,
        instagram: instagram
      }
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error)
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const updateUserInfoAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString()
  const firstName = formData.get("first_name")?.toString()
  const lastName = formData.get("last_name")?.toString()
  const instagram = formData.get("instagram")?.toString()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }
  interface updateData {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    instagram?: string;
  }

  const publicUsersData = await usersUtil.getUserById(user.id)

  const updatedData: updateData = {}
  if (firstName) updatedData.first_name = firstName
  if (lastName) updatedData.last_name = lastName
  if (firstName && lastName) {
    updatedData.full_name = `${firstName} ${lastName}`
  }
  else if (publicUsersData.first_name && lastName) {
    updatedData.full_name = `${publicUsersData.first_name} ${lastName}`
  }
  else if (firstName && publicUsersData.last_name) {
    updatedData.full_name = `${firstName} ${publicUsersData.last_name}`
  }
  if (instagram) updatedData.instagram = instagram

  const { data, error } = await supabase.auth.updateUser({
    email: email ? email : user.email,
    data: {
      ...updatedData
    }
  })

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/dashboard",
      error.message,
    );
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Profile info successfully updated",
  );
}

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
