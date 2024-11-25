export default function Contact() {
  return (
    <section className="flex-1 bg-white py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
          Contact Us
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-lg">
              Email:{" "}
              <a
                href="mailto:info@zen3dprinting.com"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                info@zen3dprinting.com
              </a>
            </p>
            <p className="text-lg">
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                +1 (234) 567-890
              </a>
            </p>
            <p className="text-lg">
              Instagram:{" "}
              <a
                href="https://instagram.com/zen3dprinting"
                className="text-blue-600 hover:text-blue-700 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                @zen3dprinting
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
