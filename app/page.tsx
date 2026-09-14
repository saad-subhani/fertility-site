import Hero from "@/components/home/Hero";
import FertilityServices from "@/components/home/FertilityServices";
import Journey from "@/components/home/Journey";
import Consultant from "@/components/home/Consultant";
import Testimonials from "@/components/home/Testimonials";
import FAQs from "@/components/home/FAQs";
import NextStep from "@/components/home/NextStep";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      <section id="home">
        <Hero />
      </section>

      <section id="treatments">
        <FertilityServices />
      </section>

      <section id="journey">
        <Journey />
      </section>

      <section id="consultant">
        <Consultant />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="faqs">
        <FAQs />
      </section>

      <section id="contact">
        <Contact />
      </section>

      <section id="next-step">
        <NextStep />
      </section>
    </main>
  );
}
