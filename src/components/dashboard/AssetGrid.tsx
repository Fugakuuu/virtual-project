"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Play, Settings, Image as ImageIcon, Music, Film, Plus, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

import { Asset } from "@/types/asset";
import { motion } from "framer-motion";

interface SortableAssetProps {
  asset: Asset;
  onTrigger: (asset: Asset) => void;
  onSettings: (asset: Asset) => void;
}

const SortableAsset = ({ asset, onTrigger, onSettings }: SortableAssetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: asset.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  const Icon = asset.type === "IMAGE" ? ImageIcon : asset.type === "AUDIO" ? Music : Film;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={cn(
        "group relative aspect-square rounded-[var(--radius-asset-grid)] overflow-hidden transition-all duration-300",
        "bg-[#1c2d38] border border-[#3d4f58]",
        isDragging && "scale-105 z-50 ring-2 ring-[#00ed64] shadow-[rgba(0,30,43,0.12)_0px_26px_44px]"
      )}
    >
      {/* Subtle corner marker */}
      <div className="absolute top-3 left-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#3d4f58]" />
      </div>

      {/* Interaction Surface */}
      <div 
        onClick={() => onTrigger(asset)}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
      >
        {/* Icon Container */}
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-xl bg-[#001e2b] border border-[#3d4f58] flex items-center justify-center text-[#b8c4c2] group-hover:text-[#00ed64] group-hover:border-[rgba(0,237,100,0.25)] group-hover:scale-110 transition-all duration-500">
            <Icon size={28} strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Asset Name — Euclid-style */}
        <h3 className="text-white font-sans text-[14px] font-medium tracking-tight line-clamp-1 mb-1.5">
          {asset.name}
        </h3>

        {/* Type Label — Source Code Pro style */}
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[2px] text-[#5c6c75]">
          {asset.type}
        </p>
      </div>

      {/* Settings Tab */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onSettings(asset);
        }}
        className="absolute top-3 right-3 p-2 rounded-lg bg-[#001e2b] border border-[#3d4f58] text-[#5c6c75] hover:text-[#00ed64] hover:border-[rgba(0,237,100,0.25)] transition-all z-20 opacity-0 group-hover:opacity-100"
      >
        <Settings size={14} />
      </button>

      {/* Hover Status Bar */}
      <div className="absolute inset-x-3 bottom-3 h-[2px] bg-[#3d4f58]/30 rounded-full overflow-hidden">
        <motion.div 
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          className="h-full bg-[#00ed64] origin-left"
        />
      </div>
      
      {/* Trigger Feedback Overlay */}
      <div className="absolute inset-0 bg-[#00ed64] opacity-0 group-active:opacity-10 transition-opacity pointer-events-none" />

      {/* Hover Shadow */}
      <div 
        className="absolute inset-0 rounded-[var(--radius-asset-grid)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: 'rgba(0, 30, 43, 0.12) 0px 26px 44px, rgba(0, 0, 0, 0.13) 0px 7px 13px' }}
      />
    </div>
  );
};

export const AssetGrid = ({ 
  assets,
  onTrigger,
  onSettings,
  onOrderChange,
  onAddClick
}: { 
  assets: Asset[];
  onTrigger: (asset: Asset) => void;
  onSettings: (asset: Asset) => void;
  onOrderChange: (newAssets: Asset[]) => void;
  onAddClick: () => void;
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = assets.findIndex((i) => i.id === active.id);
      const newIndex = assets.findIndex((i) => i.id === over.id);
      onOrderChange(arrayMove(assets, oldIndex, newIndex));
    }
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square bg-[#1c2d38] border border-[#3d4f58] rounded-[var(--radius-asset-grid)] animate-pulse" />
        ))}
      </div>
    );
  }

  const DndContextAny = DndContext as any;

  return (
    <DndContextAny
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        <SortableContext items={assets} strategy={rectSortingStrategy}>
          {assets.map((asset) => (
            <SortableAsset
              key={asset.id}
              asset={asset}
              onTrigger={onTrigger}
              onSettings={onSettings}
            />
          ))}
        </SortableContext>
        
        {/* Add New Asset Button */}
        <button 
          onClick={onAddClick}
          className="aspect-square border-2 border-dashed border-[#3d4f58] rounded-[var(--radius-asset-grid)] bg-[#001e2b]/50 hover:border-[#00ed64]/40 hover:bg-[rgba(0,237,100,0.03)] text-[#5c6c75] flex flex-col items-center justify-center gap-4 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="w-12 h-12 rounded-xl border border-[#3d4f58] bg-[#1c2d38] flex items-center justify-center group-hover:scale-110 group-hover:border-[#00ed64] group-hover:text-[#00ed64] transition-all duration-500">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[2px] opacity-40 group-hover:opacity-100 group-hover:text-[#b8c4c2] transition-all">
            Add Asset
          </span>
        </button>
      </div>
    </DndContextAny>
  );
};
