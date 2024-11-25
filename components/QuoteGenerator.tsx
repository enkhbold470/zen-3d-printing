'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const QuoteGenerator = () => {
  const [dimensions, setDimensions] = useState({ x: '', y: '', z: '' })
  const [material, setMaterial] = useState('')
  const [finish, setFinish] = useState('')
  const [price, setPrice] = useState(0)

  const calculatePrice = () => {
    // This is a simplified price calculation. In a real application, this would be more complex.
    const volume = parseFloat(dimensions.x) * parseFloat(dimensions.y) * parseFloat(dimensions.z)
    let basePrice = volume * 0.1 // 10 cents per cubic mm

    if (material === 'abs') basePrice *= 1.2
    if (material ===
'resin') basePrice *= 1.5

    if (finish === 'polished') basePrice += 10
    if (finish === 'painted') basePrice += 20

    setPrice(Math.round(basePrice * 100) / 100)
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Quote</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Get an Instant Quote
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Enter your project details and see the price in real-time
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <Label htmlFor="x" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Dimensions (mm)
              </Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <Input
                    type="number"
                    name="x"
                    id="x"
                    placeholder="X"
                    value={dimensions.x}
                    onChange={(e) => setDimensions({ ...dimensions, x: e.target.value })}
                    className="flex-1 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                  />
                  <Input
                    type="number"
                    name="y"
                    placeholder="Y"
                    value={dimensions.y}
                    onChange={(e) => setDimensions({ ...dimensions, y: e.target.value })}
                    className="flex-1 block w-full min-w-0 rounded-none sm:text-sm border-gray-300"
                  />
                  <Input
                    type="number"
                    name="z"
                    placeholder="Z"
                    value={dimensions.z}
                    onChange={(e) => setDimensions({ ...dimensions, z: e.target.value })}
                    className="flex-1 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <Label htmlFor="material" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Material
              </Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Select onValueChange={(value) => setMaterial(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pla">PLA</SelectItem>
                    <SelectItem value="abs">ABS</SelectItem>
                    <SelectItem value="resin">Resin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <Label htmlFor="finish" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                Finish
              </Label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <Select onValueChange={(value) => setFinish(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a finish" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">Raw</SelectItem>
                    <SelectItem value="polished">Polished</SelectItem>
                    <SelectItem value="painted">Painted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
            <div></div>
            <div className="mt-5 sm:mt-6 sm:col-span-2">
              <Button onClick={calculatePrice} className="w-full justify-center">
                Calculate Price
              </Button>
            </div>
          </div>

          {price > 0 && (
            <div className="mt-8 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start">
              <div></div>
              <div className="mt-5 sm:mt-6 sm:col-span-2">
                <p className="text-2xl font-bold text-blue-600">Estimated Price: ${price}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default QuoteGenerator

