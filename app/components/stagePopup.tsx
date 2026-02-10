"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Stage } from "@/lib/data/stages";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface StagePopupProps {
  stage: Stage;
  className: string;
  loading: boolean;
  onUpdate: (updatedLineup: string[]) => void; // parent callback
}

export default function StagePopup({
  stage,
  className,
  loading,
  onUpdate,
}: StagePopupProps) {
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [newPrediction, setNewPrediction] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Local copy of predictions for UI interaction
  const [predictions, setPredictions] = useState<string[]>(stage.lineup);

  const simulateApiCall = async (updated: string[]) => {
    // Simulate delay
    return new Promise<string[]>((resolve) =>
      setTimeout(() => resolve(updated), 500)
    );
  };

  // ---------- ADD ----------
  const addPrediction = async () => {
    if (!newPrediction.trim()) return;
    const updated = [...predictions, newPrediction.trim()];
    const result = await simulateApiCall(updated);
    setPredictions(result);
    onUpdate(result);
    setNewPrediction("");
    setAdding(false);
  };

  const cancelAddPrediction = () => {
    setAdding(false);
    setNewPrediction("");
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
    setPredictions(result);
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
    setPredictions(result);
    onUpdate(result);
  };

  useEffect(() => {
    if ((adding || editingIndex !== null) && inputRef.current)
      inputRef.current.focus();
  }, [adding, editingIndex]);

  useEffect(() => {
    setPredictions(stage.lineup);
  }, [stage.lineup]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>{stage.name}</Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2">
            {predictions.length > 0 ? (
              <div className="flex flex-col max-h-50 overflow-auto">
                {predictions.map((prediction, index) => (
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
                        <span className="text-sm">{prediction}</span>
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
              <div className="h-30 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No predictions.</p>
              </div>
            )}

            {adding ? (
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
              <Button
                onClick={() => {
                  setAdding(true);
                  cancelEdit();
                }}
              >
                Add
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
