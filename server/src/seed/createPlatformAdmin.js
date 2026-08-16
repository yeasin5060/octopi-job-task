import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";

const createPlatformAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("MongoDB connected");

    const email = "admin@example.com";
    const password = "12345678";

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      console.log(
        "Platform Admin already exists"
      );

      process.exit(0);
    }

    const hashedPassword =
      await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "Platform Admin",
      email,
      password: hashedPassword,
      role: "PLATFORM_ADMIN",
      status: "ACTIVE",
      organizationId: null,
    });

    console.log(
      "Platform Admin created successfully"
    );

    console.log({
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createPlatformAdmin();