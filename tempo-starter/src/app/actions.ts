"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import usersUtil from '../utils/users'
import validation from '../utils/validation'

export const signUpAction = async (formData: FormData) => {
  let first_name = formData.get("firstName")?.toString() || '';
  let last_name = formData.get("lastName")?.toString() || '';
  let instagram = formData.get("instagram")?.toString() || '';
  let email = formData.get("email")?.toString() || '';
  let password = formData.get("password")?.toString() || '';
  const supabase = await createClient();
  const origin = headers().get("origin");

  try {
    validation.checkString(first_name, 'First name')
    validation.checkString(last_name, 'Last name')
    validation.checkString(instagram, 'Instagram')
    validation.checkEmail(email)
    validation.checkPassword(password)
  } catch (e) {
    return encodedRedirect(
      "error",
      "/sign-up",
      e instanceof Error ? e.message : "All fields are required, password must be 6 characters long",
    )
  }

  try {
    const userExists = await usersUtil.checkUserWithEmailExists(email)
    if (userExists) throw `User with email ${email} already exists`
  } catch (e) {
    return encodedRedirect(
      "error",
      "/sign-up",
      `User with email ${email} already exists`,
    )
  }

  const { data: { user }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }
  const id = user?.id || ''
  validation.checkId(id)

  try {
    await usersUtil.createPublicUser(id, first_name, last_name, instagram, email)
  } catch (e) {
    console.log(e)
    return encodedRedirect("error", "/sign-up", 'An unknown error occurred');
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

// export const updateUserInfoAction = async (formData: FormData) => {
//   let first_name = formData.get("firstName")?.toString() || ''
//   let last_name = formData.get("lastName")?.toString() || ''
//   let instagram = formData.get("instagram")?.toString() || ''

//   const user = await validation.checkIsUserSignedIn()

//   if (!user) {
//     return redirect("/sign-in")
//   }

//   const publicUsersData = await usersUtil.getUserById(user.id)

//   first_name = first_name ? first_name : publicUsersData.first_name
//   last_name = last_name ? last_name : publicUsersData.last_name
//   instagram = instagram ? instagram : publicUsersData.instagram

//   first_name = validation.checkString(first_name, 'First name')
//   last_name = validation.checkString(last_name, 'Last name')
//   instagram = validation.checkString(instagram, 'Instagram')

//   try {
//     await usersUtil.updateUserNoEmail(user.id, first_name, last_name, instagram)
//   } catch (e) {
//     console.error(e);
//     return encodedRedirect(
//       "error",
//       "/dashboard",
//       e instanceof Error ? e.message : "Unable to update user",
//     );
//   }

//   return encodedRedirect(
//     "success",
//     "/dashboard",
//     "Profile info successfully updated",
//   );
// }

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
