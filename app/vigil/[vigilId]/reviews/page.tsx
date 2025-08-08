"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ReviewListComponent,
  ReviewStatsComponent,
} from "@/components/reviews";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { VigilDetailsType } from "@/src/types/vigil.types";
import { Avatar } from "@/components";

const VigilReviewsPage = () => {
  const params = useParams();
  const vigilId = params?.vigilId as string;
  const [vigil, setVigil] = useState<VigilDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  const { getVigilsDetails } = useVigilStore();

  useEffect(() => {
    if (vigilId) {
      loadVigilData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigilId]);

  const loadVigilData = async () => {
    try {
      setLoading(true);
      await getVigilsDetails([vigilId]);
      // Get the vigil from store
      const vigilData = useVigilStore
        .getState()
        .vigils.find((v) => v.id === vigilId);
      setVigil(vigilData || null);
    } catch (error) {
      console.error("Error loading vigil data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!vigil) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vigil non trovato
            </h1>
            <p className="text-gray-500">
              Il vigil che stai cercando non esiste o non è disponibile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <Avatar userId={vigil.id} value={vigil.displayName} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {vigil.displayName}
              </h1>
              <p className="text-gray-600">Vigil professionale</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Statistics */}
          <div className="lg:col-span-1">
            <ReviewStatsComponent vigilId={vigilId} showDistribution={true} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <ReviewListComponent
              vigilId={vigilId}
              showActions={false}
              title={`Recensioni per ${vigil.displayName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VigilReviewsPage;
