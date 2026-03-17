import React from "react";

const About = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About AutoHub</h1>
      <p className="text-white/80 max-w-2xl">
        AutoHub is a platform for buying, selling, and renting vehicles through approved
        dealerships. Dealers register their companies and receive approval from the
        platform's super admin before listing cars.
      </p>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">How it works</h2>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Dealerships register and are approved by a super admin.</li>
          <li>Dealership admins approve submitted cars with valid specs.</li>
          <li>Buyers can browse verified car listings to purchase or rent.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;