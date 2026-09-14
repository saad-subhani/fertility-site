import Hero from "@/components/home/Hero";
import AboutClinic from "@/components/home/AboutClinic";
import FertilityServices from "@/components/home/FertilityServices";
import Consultant from "@/components/home/Consultant";
import FAQs from "@/components/home/FAQs";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section id="home">
        <Hero />
      </section>

      {/* FERTILITY SERVICES — right after hero */}
      <section id="treatments">
        <FertilityServices />
      </section>

      {/* ABOUT */}
      <section id="about">
        <AboutClinic />
      </section>

      {/* CONSULTANT */}
      <section id="consultant">
        <Consultant />
      </section>

      {/* FAQS */}
      <section id="faqs">
        <FAQs />
      </section>

      {/* CONTACT */}
      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
