import { NextResponse } from "next/server";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt"

export async function POST(req) {
    try {
        const body = await req.json()
        const userData = body.formData;

        if (!userData?.email || !userData?.password) {
            return NextResponse.json(
                { message: "All Fields Required" },
                { status: 400 }
            )
        }

        const duplicate = await User.findOne({ email: userData.email }).lean().exec();
        if (duplicate) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(userData.password, 15);
        userData.password = hashedPassword;

        await User.create(userData);
        return NextResponse.json({
            message: "User Created"
        },
            { status: 201 }
        )
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Error:", error }, { status: 500 });
    }
}