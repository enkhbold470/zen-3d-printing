"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Image from next/image

const testimonials = [
  {
    id: 1,
    content:
      "The quality of the 3D prints exceeded my expectations. Highly recommended!",
    author: "John Doe",
    role: "Product Designer",
    imageUrl: "https://placekeanu.com/100/100",
  },
  {
    id: 2,
    content:
      "Fast turnaround and excellent customer service. Will definitely use again!",
    author: "Jane Smith",
    role: "Architect",
    imageUrl: "https://placekeanu.com/100/100",
  },
  {
    id: 3,
    content:
      "Their expertise in 3D printing helped bring my concept to life. Amazing work!",
    author: "Mike Johnson",
    role: "Entrepreneur",
    imageUrl: "https://placekeanu.com/100/100",
  },
  {
    id: 4,
    content:
      "Impressed by the attention to detail and the finish quality of my prototypes.",
    author: "Sarah Lee",
    role: "Industrial Designer",
    imageUrl: "https://placekeanu.com/100/100",
  },
  {
    id: 5,
    content:
      "Great communication throughout the project. The team was very helpful.",
    author: "Chris Brown",
    role: "Engineer",
    imageUrl: "https://placekeanu.com/100/100",
  },
];

const CustomerTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What Our Customers Say
          </p>
        </div>

        <div className="mt-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="text-center">
                  <Image // Use Image component from next/image
                    className="mx-auto h-24 w-24 rounded-full"
                    src={testimonials[currentIndex].imageUrl}
                    alt={testimonials[currentIndex].author}
                    width={100} // Specify width
                    height={100} // Specify height
                  />
                  <div className="mt-4">
                    <p className="text-lg leading-6 font-medium text-gray-900">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-sm leading-6 text-gray-500">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg text-gray-500">
                      {testimonials[currentIndex].content}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button onClick={prevTestimonial} variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={nextTestimonial} variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
