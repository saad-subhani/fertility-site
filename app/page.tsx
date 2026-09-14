import Hero from "@/components/home/Hero";
import AboutClinic from "@/components/home/AboutClinic";
import FertilityServices from "@/components/home/FertilityServices";
import Journey from "@/components/home/Journey";
import Consultant from "@/components/home/Consultant";
import FAQs from "@/components/home/FAQs";
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

      <section id="about">
        <AboutClinic />
      </section>

      <section id="consultant">
        <Consultant />
      </section>

      <section id="faqs">
        <FAQs />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
