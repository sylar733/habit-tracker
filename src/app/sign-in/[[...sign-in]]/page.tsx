import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <div className="flex justify-center items-center flex-col gap-10 w-full h-screen">
      <SignUp />
    </div>
  );
}

export default SignUpPage;
