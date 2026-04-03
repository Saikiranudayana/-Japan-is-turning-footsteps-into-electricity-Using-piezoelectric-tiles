import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";

interface FeatureCard {
  title: string;
  description: string;
  iconUrl: string;
}

const CARDS: FeatureCard[] = [
  {
    title: "ChatGPT",
    description:
      "Conversational AI answers, but lacks curation and context for deep exploration.",
    iconUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/512px-ChatGPT_logo.svg.png",
  },
  {
    title: "Perplexity",
    description:
      "Search meets AI — fast answers, but still surface-level on nuanced topics.",
    iconUrl:
      "https://uxwing.com/wp-content/themes/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/flavor/favicon.ico",
  },
  {
    title: "Google AI",
    description:
      "Powerful summaries at the top of search — but still driven by ads and rankings.",
    iconUrl:
      "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690b6.svg",
  },
];

export default function SearchChanged() {
  return (
    <section id="how-it-works" className="py-28 md:py-36 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          {...fadeUp(0)}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          Search Has{" "}
          <span className="serif-italic font-normal">Changed</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-5 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
        >
          AI is replacing links with answers. The way people discover content is
          evolving — and so should the way we create it.
        </motion.p>

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUp(0.15 + i * 0.1)}
              className="liquid-glass rounded-2xl p-8 flex flex-col items-center text-center"
            >
              {/* Icon placeholder — CSS circle fallback */}
              <div className="h-[120px] w-[120px] rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 overflow-hidden">
                <img
                  src={card.iconUrl}
                  alt={card.title}
                  className="h-16 w-16 object-contain"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          {...fadeUp(0.5)}
          className="mt-16 text-muted-foreground text-sm md:text-base"
        >
          The future isn't search. It's{" "}
          <span className="text-white font-medium">discovery</span>.
        </motion.p>
      </div>
    </section>
  );
}
