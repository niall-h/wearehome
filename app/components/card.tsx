"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Stage } from "@/lib/data/stages";
import { Spinner } from "@/components/ui/spinner";

interface StageCardProps {
  stage: Stage;
  loading: boolean;
  onUpdate: (updatedLineup: string[]) => void; // callback to parent
}

export function StageCard({ stage, loading, onUpdate }: StageCardProps) {
  const [adding, setAdding] = useState<boolean>(false);
  const [newPrediction, setNewPrediction] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const predictions = stage.lineup ?? [];

  // Simulate mock API call
  const simulateApiCall = async (updated: string[]) =>
    new Promise<string[]>((resolve) => setTimeout(() => resolve(updated), 500));

  // ---------- ADD ----------
  const addPrediction = async () => {
    if (!newPrediction.trim()) return;
    const updated = [...predictions, newPrediction.trim()];
    const result = await simulateApiCall(updated);
    onUpdate(result);
    setNewPrediction("");
    setAdding(false);
  };

  const cancelAddPrediction = () => {
    setNewPrediction("");
    setAdding(false);
  };

  const handleAddClick = () => {
    cancelEdit();
    setAdding(true);
  };

  // ---------- EDIT ----------
  const editPrediction = (index: number) => {
    setAdding(false);
    setEditingIndex(index);
    setDraft(predictions[index]);
  };

  const saveEdit = async () => {
    if (editingIndex === null || !draft.trim()) return;
    const updated = predictions.map((p, i) =>
      i === editingIndex ? draft.trim() : p
    );
    const result = await simulateApiCall(updated);
    onUpdate(result);
    setEditingIndex(null);
    setDraft("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDraft("");
  };

  // ---------- DELETE ----------
  const deletePrediction = async (index: number) => {
    const updated = predictions.filter((_, i) => i !== index);
    const result = await simulateApiCall(updated);
    onUpdate(result);
  };

  useEffect(() => {
    if ((adding || editingIndex !== null) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding, editingIndex]);

  return (
    <Card className="w-full h-[350px] max-w-[300px] flex flex-col">
      <CardHeader>
        <CardTitle>{stage.name}</CardTitle>
      </CardHeader>

      {/* CardContent with scroll and flex layout */}
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : predictions.length > 0 ? (
          <div className="flex-1 flex flex-col overflow-y-auto gap-1">
            {predictions.map((artist, index) => (
              <div
                key={index}
                className={`group flex items-center py-1 justify-between rounded transition ${
                  editingIndex === index ? "" : "px-2 hover:bg-gray-100"
                }`}
              >
                {editingIndex === index ? (
                  <div className="flex w-full gap-2 px-2">
                    <Input
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button
                      className="text-gray-400 hover:text-green-500"
                      onClick={saveEdit}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500"
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm">{artist}</span>
                    <div className="hidden group-hover:flex gap-2">
                      <button
                        className="text-gray-400 hover:text-gray-700"
                        onClick={() => editPrediction(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => deletePrediction(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No predictions.</p>
          </div>
        )}
      </CardContent>

      {/* Footer Add section always at bottom */}
      <CardFooter className="flex-shrink-0">
        {!loading &&
          (adding ? (
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Artist Name"
                value={newPrediction}
                onChange={(e) => setNewPrediction(e.target.value)}
              />
              <button
                className="text-gray-400 hover:text-green-500"
                onClick={addPrediction}
              >
                <Check />
              </button>
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={cancelAddPrediction}
              >
                <X />
              </button>
            </div>
          ) : (
            <Button onClick={handleAddClick}>Add</Button>
          ))}
      </CardFooter>
    </Card>
  );
}
