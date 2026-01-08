import { prisma } from "../lib/prisma";
import { UserRole } from "../modules/post/post.router";

//**________________________ |_| ________________________________

async function seedAdmin() {
  try {
    const adminData = {
      name: "admin Saheb",
      email: "admin@admin.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    // check dataBase user is exist or not....
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const signUpAdmin = await fetch(
      "http://localhost:3001/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );
    if (signUpAdmin.ok) {
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error: any) {
    console.log(error);
  }
}
seedAdmin();
