"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Image from next/image
import projects from "@/data/projects.json";
export default function GalleryOfServices() {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <section id="services" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Our Work
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Gallery of Services
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Explore our successful projects across various categories
          </p>
        </div>

        <div className="mt-10">
          <div className="flex justify-center space-x-4 mb-8">
            {["All", "Prototyping", "Batch Production", "Custom Design"].map(
              (category) => (
                <Button
                  key={category}
                  onClick={() => setFilter(category)}
                  variant={filter === category ? "default" : "outline"}
                >
                  {category}
                </Button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <Image
                  className="w-full h-48 object-cover"
                  src={project.imageUrl}
                  alt={project.name}
                  width={500} // Specify width
                  height={500} // Specify height
                />
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {project.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
