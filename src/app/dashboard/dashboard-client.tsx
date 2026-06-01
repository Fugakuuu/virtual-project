"use client";

import React, { useState, useEffect } from "react";
import { Asset } from "@/types/asset";
import { AssetGrid } from "@/components/dashboard/AssetGrid";
import { AssetSettingsModal } from "@/components/dashboard/AssetSettingsModal";
import { AddAssetModal } from "@/components/dashboard/AddAssetModal";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Home as HomeIcon, Zap as ZapIcon, User as UserIcon, LogOut as LogOutIcon } from "lucide-react";
import Dock from "@/components/ui/Dock";
import { createClient } from "@/utils/supabase/client";

export const DashboardClient = ({ 
  initialAssets,
  userId,
  user
}: { 
  initialAssets: Asset[];
  userId: string;
  user: { name?: string | null; image?: string | null };
}) => {
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userData, setUserData] = useState(user);
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null);
  const supabase = createClient();

  const dockItems = [
    { 
      icon: <HomeIcon size={18} />, 
      label: 'Home', 
      onClick: () => router.push('/') 
    },
    { 
      icon: <ZapIcon size={18} />, 
      label: 'Dashboard', 
      onClick: () => router.push('/dashboard') 
    },
    { 
      icon: <UserIcon size={18} />, 
      label: 'Profile', 
      onClick: () => router.push('/profile') 
    },
    { 
      icon: <LogOutIcon size={18} />, 
      label: 'Logout', 
      onClick: () => signOut({ callbackUrl: "/" }) 
    },
  ];

  const handleTrigger = (asset: Asset) => {
    console.log("Triggering via Supabase:", asset.name);
    const channel = supabase.channel(`overlay-${userId}`);
    channel.send({
      type: 'broadcast',
      event: 'play-asset',
      payload: { ...asset, userId }
    });
  };

  const handleSaveSettings = async (updated: Asset) => {
    const previousAssets = [...assets];
    setAssets(assets.map(a => a.id === updated.id ? updated : a));
    setEditingAsset(null);

    try {
      const response = await fetch(`/api/assets/${updated.id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated) 
      });

      if (!response.ok) throw new Error("Gagal menyimpan perubahan");
    } catch (error) {
      console.error("Save error:", error);
      setAssets(previousAssets);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    const previousAssets = [...assets];
    setAssets(assets.filter(a => a.id !== id));
    setEditingAsset(null);
    setDeleteTarget(null);

    try {
      const response = await fetch(`/api/assets/${id}`, { 
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Gagal menghapus aset");
    } catch (error) {
      console.error("Delete error:", error);
      setAssets(previousAssets);
    }
  };

  const handleCreateAsset = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  const handleOrderChange = async (newAssets: Asset[]) => {
    setAssets(newAssets);
    
    try {
      const orderData = newAssets.map((asset, index) => ({
        id: asset.id,
        order: index
      }));

      await fetch('/api/assets/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assets: orderData })
      });
    } catch (error) {
      console.error("Reorder persistence error:", error);
    }
  };

  return (
    <div className="relative pb-32">
      <DashboardHeader 
        user={userData} 
        onAddClick={() => setShowAddModal(true)} 
      />

      <AssetGrid 
        assets={assets} 
        onTrigger={handleTrigger}
        onSettings={setEditingAsset}
        onOrderChange={handleOrderChange}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Persistent Dock Navigation */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
            distance={140}
          />
        </div>
      </div>

      {editingAsset && (
        <AssetSettingsModal 
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSaveAction={handleSaveSettings}
          onDelete={() => setDeleteTarget(editingAsset)}
        />
      )}

      {showAddModal && (
        <AddAssetModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={handleCreateAsset}
        />
      )}

      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        assetName={deleteTarget?.name ?? ""}
        onConfirm={() => deleteTarget && handleDeleteAsset(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
