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
                href="mailto:info@zen@enk.icu"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                zen@enk.icu
              </a>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}
