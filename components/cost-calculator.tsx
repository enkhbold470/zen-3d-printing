"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listFiles } from "@/lib/supabase/storage";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import pricing from "@/data/pricing.json";
interface CostEstimate {
  fileName: string;
  volume: number; // in cm³
  weight: number; // in grams
  printTime: number; // in hours
  cost: number; // in dollars
  material: string;
}

export default function CostCalculator() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimates, setEstimates] = useState<CostEstimate[]>([]);
  const [fileCount, setFileCount] = useState(0);
  const { user } = useUser();
  const [totalCost, setTotalCost] = useState(0);
  const pricingData = pricing.find((m) => m.material === "PLA") || {
    material: "PLA",
    density: 0,
    costPerGram: 0,
    electricityCostPerKWh: 0,
    printerPowerUsage: 0,
    maintenanceCost: 0,
    laborCostPerHour: 0,
    profitMargin: 0,
  };
  const calculateModelMetrics = async (
    url: string,
    fileName: string
  ): Promise<CostEstimate> => {
    console.log(`Calculating metrics for: ${fileName}`);

    const loader = new STLLoader();
    const geometry = await new Promise<THREE.BufferGeometry>(
      (resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      }
    );

    const position = geometry.attributes.position?.array as Float32Array;
    let volume = 0;

    for (let i = 0; i < position.length; i += 9) {
      const v0 = new THREE.Vector3(
        position[i],
        position[i + 1],
        position[i + 2]
      );
      const v1 = new THREE.Vector3(
        position[i + 3],
        position[i + 4],
        position[i + 5]
      );
      const v2 = new THREE.Vector3(
        position[i + 6],
        position[i + 7],
        position[i + 8]
      );
      volume += v0.dot(v1.cross(v2)) / 6.0;
    }

    volume = Math.abs(volume) / 1000; // Convert to cm³
    console.log(`Volume for ${fileName}: ${volume} cm³`);

    const density = pricingData.density || 0;
    const costPerGram = pricingData.costPerGram || 0;

    const weight = volume * density;
    let printTime = volume * 0.1; // Changed variable name to match interface

    // Adjust print time and labor cost
    // if (printTime < 1) {
    //   printTime = 1; // Set minimum print time to 1 hour
    // }

    const filamentCost = weight * costPerGram;
    const electricityCost =
      pricingData.printerPowerUsage *
      printTime *
      pricingData.electricityCostPerKWh;

    const baseCost =
      filamentCost + electricityCost + pricingData.maintenanceCost;
    const profit = baseCost * pricingData.profitMargin;
    const totalCost = baseCost + profit;

    console.log(`Weight for ${fileName}: ${weight} g`);
    console.log(`Print time for ${fileName}: ${printTime} hours`);
    console.log(`Total Cost for ${fileName}: $${totalCost.toFixed(2)}`);

    // Debugging: Log the pricing data used for calculations
    console.log(`Pricing Data for ${fileName}:`, pricingData);

    return {
      fileName,
      volume,
      weight,
      printTime, // Return printTime instead of printTimeInHours
      cost: totalCost,
      material: pricingData.material,
    };
  };

  const calculateCosts = async () => {
    if (!user) return;

    setIsCalculating(true);
    try {
      const files = await listFiles(user.id);
      const stlFiles = files.filter((file) =>
        file.name.toLowerCase().endsWith(".stl")
      );

      setFileCount(stlFiles.length);
      console.log(`Found ${stlFiles.length} STL files for user ${user.id}`);

      const estimates = await Promise.all(
        stlFiles.map((file) => {
          const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/model-files/${user.id}/${file.name}`;
          return calculateModelMetrics(
            fileUrl,
            file.name.split("/").pop() || file.name
          );
        })
      );

      // Calculate total cost without labor cost
      const totalCost = estimates.reduce(
        (sum, estimate) => sum + estimate.cost,
        0
      );

      console.log(`Calculated estimates for ${estimates.length} files`);
      setEstimates(estimates);
      // Store total cost in state if needed
      setTotalCost(totalCost + pricingData.laborCostPerHour); // Assuming you have a state for total cost
    } catch (error) {
      console.error("Error calculating costs:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={calculateCosts}
        disabled={isCalculating}
        className="w-full"
      >
        {isCalculating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculating {fileCount > 0 ? `for ${fileCount} files...` : "..."}
          </>
        ) : (
          "Calculate Costs for Uploaded Files"
        )}
      </Button>

      {estimates.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {estimates.map((estimate) => (
            <Card key={estimate.fileName}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {estimate.fileName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt>Volume:</dt>
                    <dd>{estimate.volume.toFixed(2)} cm³</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Weight:</dt>
                    <dd>{estimate.weight.toFixed(2)} g</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Print Time:</dt>
                    <dd>{estimate.printTime.toFixed(2)} hours</dd>
                  </div>
                  <div className="flex justify-between font-medium">
                    <dt>Estimated Cost:</dt>
                    <dd>${estimate.cost.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Material:</dt>
                    <dd>{estimate.material}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between font-bold">
            <dt>Total Cost:</dt>
            <dd>${totalCost.toFixed(2)}</dd> {/* Display total cost here */}
          </div>
        </div>
      )}
    </div>
  );
}
