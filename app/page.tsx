"use client";

import { useEffect, useState } from "react";
import { StageCard } from "./components/card";
import StagePopup from "./components/stagePopup";
import {
  allStages,
  cleanLineupData,
  mockStages,
  Stage,
} from "@/lib/data/stages";

export default function Home() {
  const [data, setData] = useState<Stage[]>(allStages);
  const [loading, setLoading] = useState<boolean>(true);

  // Load mock data with simulated delay
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const fullData = cleanLineupData(mockStages);
      setData(fullData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Helper to update a stage's lineup after StagePopup changes
  const handleStageUpdate = (stageId: string, updatedLineup: string[]) => {
    setData((prev) =>
      prev.map((stage) =>
        stage.id === stageId ? { ...stage, lineup: updatedLineup } : stage
      )
    );
  };

  const centerNodeIds = ["stereo", "bionic", "artcar"];

  const normalNodes = data.filter((s) => !centerNodeIds.includes(s.id));
  const centerNodes = data.filter((s) => centerNodeIds.includes(s.id));

  return (
    <div className="flex flex-col gap-16">
      {/* Map Section */}
      <div className="map-container">
        <h1 className="text-white text-4xl">My EDC 2026 Lineup</h1>
        <div className="map-background">
          <div className="map">
            {/* Normal nodes */}
            {normalNodes.map((stage) => (
              <StagePopup
                key={stage.id}
                className={`node ${stage.id}`}
                stage={stage}
                loading={loading}
                onUpdate={(updatedLineup) =>
                  handleStageUpdate(stage.id, updatedLineup)
                }
              />
            ))}

            {/* Center nodes */}
            <div className="center-node">
              {centerNodes.map((stage) => (
                <StagePopup
                  key={stage.id}
                  className={stage.id}
                  stage={stage}
                  loading={loading}
                  onUpdate={(updatedLineup) =>
                    handleStageUpdate(stage.id, updatedLineup)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Cards */}
      <section
        className="mx-auto w-full max-w-[1500px] grid gap-6 px-16 justify-center
        [grid-template-columns:repeat(auto-fit,minmax(250px,300px))]"
      >
        {data.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            loading={loading}
            onUpdate={(updatedLineup) =>
              handleStageUpdate(stage.id, updatedLineup)
            }
          />
        ))}
      </section>
    </div>
  );
}
