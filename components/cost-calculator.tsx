"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listFiles } from "@/lib/supabase/storage";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

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
  const { user } = useUser();

  const calculateModelMetrics = async (
    url: string,
    fileName: string
  ): Promise<CostEstimate> => {
    console.log(`Calculating metrics for: ${fileName}`);
    const loader = new STLLoader();
    const geometry = await new Promise((resolve, reject) => {
      loader.load(url, resolve, undefined, reject);
    });

    // Calculate volume using signed tetrahedron method
    const position = geometry.attributes.position.array;
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

    // Basic calculations
    const material = "PLA";
    const density = 1.24; // g/cm³ for PLA
    const weight = volume * density;
    const printTime = volume * 0.1; // Rough estimate: 6 minutes per cm³
    const costPerGram = 0.03; // $0.03 per gram
    const cost = weight * costPerGram + printTime * 2; // Material cost + machine time

    console.log(`Weight for ${fileName}: ${weight} g`);
    console.log(`Print time for ${fileName}: ${printTime} hours`);
    console.log(`Cost for ${fileName}: $${cost}`);

    return {
      fileName,
      volume,
      weight,
      printTime,
      cost,
      material,
    };
  };

  const calculateCosts = async () => {
    if (!user) return;

    setIsCalculating(true);
    try {
      const files = await listFiles(user.id);
      console.log(`Files retrieved for user ${user.id}:`, files);
      const stlFiles = files.filter((file) =>
        file.name.toLowerCase().endsWith(".stl")
      );

      console.log(`STL files found:`, stlFiles);

      const estimates = await Promise.all(
        stlFiles.map((file) => {
          const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/model-files/${user.id}/${file.name}`;
          return calculateModelMetrics(
            fileUrl,
            file.name.split("/").pop() || file.name
          );
        })
      );

      setEstimates(estimates);
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
            Calculating...
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
                    <dd>{estimate.printTime.toFixed(1)} hours</dd>
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
        </div>
      )}
    </div>
  );
}
