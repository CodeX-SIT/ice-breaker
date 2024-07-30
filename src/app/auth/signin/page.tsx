// import React from "react";
// import {  } from "next-auth";

// export default async function SignInPage({}: {}) {}

import { signIn } from "@/auth";

export default async function SignIn() {
  return (
    <main>
      <section>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      </section>
    </main>
  );
}
