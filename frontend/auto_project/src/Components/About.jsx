import React from "react";

const About = () => {
  return (
    /* Added text-white here to cover the entire component */
    <div className="space-y-12 text-white">
      {/* Original AutoHub Section */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">About AutoHub</h1>
        <p className="text-white/80 max-w-2xl">
          AutoHub is a platform for buying, selling, and renting vehicles through approved
          dealerships. Dealers register their companies and receive approval from the
          platform's super admin before listing cars.
        </p>
        {/* Changed background to a dark shade or transparent so white text is visible */}
        <div className="rounded-lg bg-white/10 p-6 shadow-sm backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-2">How it works</h2>
          <ul className="list-disc pl-5 text-white/90">
            <li>Dealerships register and are approved by a super admin.</li>
            <li>Dealership admins approve submitted cars with valid specs.</li>
            <li>Buyers can browse verified car listings to purchase or rent.</li>
          </ul>
        </div>
      </div>

      {/* New About Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h3 className="text-2xl font-bold mt-4">Who We Are</h3>
            <p className="text-white/80">
              At <strong>Auto Hub</strong>, we believe that driving is more than just transportation — 
              it's an experience. Founded in 2026, <br />we have been dedicated to crafting 
              innovative, high-performance, and stylish vehicles that deliver the thrill 
              of speed and the comfort of luxury.
            </p>

            <h3 className="text-2xl font-bold mt-4">Our Mission</h3>
            <p className="text-white/80">
              Our mission is to redefine modern driving by combining cutting-edge 
              technology with eco-friendly designs. We aim to inspire confidence, 
              performance, and sustainability in every car we build.
            </p>

            <h3 className="text-2xl font-bold mt-4">Why Choose Us</h3>
            <ul className="list-none space-y-2 text-white/80">
              <li><i className="fa-solid fa-check mr-2 text-white"></i> High-quality and reliable vehicles</li>
              <li><i className="fa-solid fa-check mr-2 text-white"></i> Outstanding customer service</li>
              <li><i className="fa-solid fa-check mr-2 text-white"></i> Affordable prices with flexible plans</li>
              <li><i className="fa-solid fa-check mr-2 text-white"></i> Passion for innovation and excellence</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;