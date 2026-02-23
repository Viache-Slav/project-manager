const AuthCard = ({ children }) => {
  return (
    <div className="
      relative z-10
      rounded-2xl
      bg-[#3b2515cf]/25
      p-6
      text-center
      shadow-[0_0_20px_rgba(152,53,53,0.10)]
      backdrop-blur-sm
    ">
      {children}
    </div>
  );
};

export default AuthCard;
