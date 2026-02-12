"use client";
import React from "react";
import { setCookie } from "cookies-next";

type Props = { token: string };

function SetToken({ token }: Props) {
  if (token) {
    // Set cookie with 1 hour expiry
    setCookie("api-token", token, { maxAge: 3600 });
  }
  return null;
}

export default SetToken;

