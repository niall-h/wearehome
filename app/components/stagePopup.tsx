"use client";

import { useEffect, useRef, useState } from "react";
import { Stage } from "@/lib/data/stages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Check, Trash2, X, Pencil } from "lucide-react";

interface StagePopupProps {
  stage: Stage;
  className: string;
  loading: boolean;
  onUpdate: (updatedLineup: string[]) => void;
}

export default function StagePopup({
  stage,
  className,
  loading,
  onUpdate,
}: StagePopupProps) {
  const [adding, setAdding] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newPrediction, setNewPrediction] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const predictions = stage.lineup ?? [];

  const simulateApi = async (data: string[]) =>
    new Promise<string[]>((res) => setTimeout(() => res(data), 400));

  // ---------- ADD ----------
  const addPrediction = async () => {
    if (!newPrediction.trim()) return;
    const updated = [...predictions, newPrediction.trim()];
    const result = await simulateApi(updated);
    onUpdate(result);
    setNewPrediction("");
    setAdding(false);
  };

  // ---------- DELETE (MULTI) ----------
  const deleteSelected = async () => {
    const updated = predictions.filter((_, i) => !selected.has(i));
    const result = await simulateApi(updated);
    onUpdate(result);
    setSelected(new Set());
    setEditMode(false);
  };

  const toggleSelection = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>{stage.name}</Button>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-3">
            {/* LIST */}
            {predictions.length > 0 ? (
              <div className="max-h-48 overflow-auto space-y-1">
                {predictions.map((p, i) => (
                  <div
                    key={i}
                    onClick={() => editMode && toggleSelection(i)}
                    className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition ${
                      editMode ? "hover:bg-muted" : ""
                    } ${selected.has(i) ? "bg-muted" : ""}`}
                  >
                    <span className="text-sm">{p}</span>

                    {editMode && (
                      <Checkbox
                        checked={selected.has(i)}
                        onCheckedChange={() => toggleSelection(i)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No predictions.</p>
              </div>
            )}

            {/* ADD INPUT */}
            {adding && (
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  placeholder="Artist name"
                  value={newPrediction}
                  onChange={(e) => setNewPrediction(e.target.value)}
                />
                <Button size="icon" variant="ghost" onClick={addPrediction}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setAdding(false);
                    setNewPrediction("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* ACTION ROW */}
            {!adding && (
              <div className="flex gap-2 justify-end">
                {!editMode ? (
                  <>
                    <Button
                      size="sm"
                      className="bg-[#ed3895] text-white hover:bg-[#d82f86]"
                      onClick={() => setAdding(true)}
                    >
                      Add
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditMode(false);
                        setSelected(new Set());
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-white"
                      disabled={selected.size === 0}
                      onClick={deleteSelected}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
