import Image from "next/image";

const SignInSide = () => {
  return (
    <div className="border border-red-500 flex items-center justify-center">
      <Image
        src="/us.png"
        alt="Us Admins"
        width={450}
        height={450}
        quality={100}
      />

      <div>
        
      </div>
    </div>
  );
};

export default SignInSide;
