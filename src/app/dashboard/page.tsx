"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";

function Dashboard() {
    const { user } = useUser();

    return (
        <div>
            <h1>Hello, {user?.lastName || "User"}!</h1>
            <SignOutButton>Sign Out</SignOutButton>
        </div>
    );
}

export default Dashboard;
