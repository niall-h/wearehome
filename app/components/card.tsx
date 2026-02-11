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
import { Spinner } from "@/components/ui/spinner";
import { Trash2, Pencil, X, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Stage } from "@/lib/data/stages";
import { Checkbox } from "@/components/ui/checkbox";

interface StageCardProps {
  stage: Stage;
  loading: boolean;
  onUpdate: (updatedLineup: string[]) => void;
}

export function StageCard({ stage, loading, onUpdate }: StageCardProps) {
  const predictions = stage.lineup ?? [];

  const [adding, setAdding] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPrediction, setNewPrediction] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);

  const simulateApiCall = async (updated: string[]) =>
    new Promise<string[]>((resolve) => setTimeout(() => resolve(updated), 300));

  // ---------- ADD ----------
  const addPrediction = async () => {
    if (!newPrediction.trim()) return;
    const updated = [...predictions, newPrediction.trim()];
    const result = await simulateApiCall(updated);
    onUpdate(result);
    setNewPrediction("");
    setAdding(false);
  };

  const cancelAdd = () => {
    setAdding(false);
    setNewPrediction("");
  };

  // ---------- EDIT MODE ----------
  const enterEditMode = () => {
    setEditMode(true);
    setSelected(new Set());
  };

  const cancelEditMode = () => {
    setEditMode(false);
    setSelected(new Set());
  };

  // ---------- SELECTION ----------
  const toggleSelect = (index: number) => {
    const next = new Set(selected);
    next.has(index) ? next.delete(index) : next.add(index);
    setSelected(next);
  };

  const deleteSelected = async () => {
    if (selected.size === 0) return;
    const updated = predictions.filter((_, i) => !selected.has(i));
    const result = await simulateApiCall(updated);
    onUpdate(result);
    cancelEditMode();
  };

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  return (
    <Card className="w-full h-[350px] max-w-[300px] flex flex-col">
      <CardHeader>
        <CardTitle>{stage.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner className="size-6" />
          </div>
        ) : predictions.length ? (
          <div className="flex-1 flex flex-col overflow-y-auto gap-1">
            {predictions.map((artist, index) => {
              const isSelected = selected.has(index);

              return (
                <div
                  key={index}
                  onClick={() => editMode && toggleSelect(index)}
                  className={`flex items-center justify-between rounded px-2 py-1 cursor-pointer transition
  ${editMode && isSelected ? "bg-pink-100" : ""}
  ${editMode ? "hover:bg-pink-50" : "hover:bg-gray-100"}`}
                >
                  <span className="text-sm truncate">{artist}</span>

                  {editMode && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(index)}
                      onClick={(e) => e.stopPropagation()}
                      className="data-[state=checked]:bg-[#ed3895] data-[state=checked]:border-[#ed3895]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No predictions.</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 w-full">
        {adding ? (
          <>
            <Input
              ref={inputRef}
              placeholder="Artist name"
              value={newPrediction}
              onChange={(e) => setNewPrediction(e.target.value)}
              className="flex-1"
            />
            <Button size="icon" variant="ghost" onClick={addPrediction}>
              <Check />
            </Button>
            <Button size="icon" variant="ghost" onClick={cancelAdd}>
              <X />
            </Button>
          </>
        ) : editMode ? (
          <>
            <Button
              variant="outline"
              onClick={cancelEditMode}
              className="w-1/2"
            >
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>

            <Button
              onClick={deleteSelected}
              disabled={selected.size === 0}
              className="w-1/2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setAdding(true)}
              className="w-1/2 bg-[#ed3895] text-white hover:bg-[#d82f86]"
            >
              Add
            </Button>

            <Button variant="outline" onClick={enterEditMode} className="w-1/2">
              <Pencil className="mr-1 h-4 w-4" /> Edit
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
