const Button = ({ text, className, id }) => {
  return (
    <a
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById("skills");

        if (target && id) {
          const offset = window.innerHeight * 0.15;
          const top =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({ top, behavior: "smooth" });
        }
      }}
      className={`${className ?? ""} cta-wrapper`}
    >
      <div className="cta-button group relative overflow-hidden rounded-full bg-yellow-400 hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 px-6 py-3 flex items-center justify-center gap-3">
        <span className="text-black font-bold tracking-wide text-lg">
          {text}
        </span>
        <div className="arrow-wrapper transform group-hover:transition-transform duration-300">
          <img
            src="/images/arrow-down.svg"
            alt="Flecha hacia abajo"
            className="w-5 h-5"
          />
        </div>
        <div className="absolute inset-0 border border-yellow-500 rounded-full animate-pulse opacity-10 pointer-events-none" />
      </div>
    </a>
  );
};

export default Button;
