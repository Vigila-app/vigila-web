"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, Button } from "@/components";
import { ReviewListComponent } from "@/components/reviews";
import { useVigilStore } from "@/src/store/vigil/vigil.store";
import { Routes } from "@/src/routes";
import { useAppStore } from "@/src/store/app/app.store";
import { StarIcon } from "@heroicons/react/24/solid";
import { ReviewsUtils } from "@/src/utils/reviews.utils";

const VigilDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const vigilId = params?.vigilId as string;
  const {
    loader: { isLoading: loading },
  } = useAppStore();

  const { vigils, getVigilsDetails } = useVigilStore();

  const vigil = vigils.find((v) => v.id === vigilId) || null;

  useEffect(() => {
    if ((vigilId && !vigil?.id) || vigil?.id !== vigilId) {
      getVigilsDetails([vigilId], true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vigil, vigilId]);

  const handleBookVigil = () => {
    router.push(`${Routes.createBooking.url}?vigilId=${vigilId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
            <Button
              action={() => router.push(Routes.services.url)}
              label="Torna ai Servizi"
              customClass="mt-4"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del profilo */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <Avatar
                  userId={vigil.id}
                  value={vigil.displayName}
                  size="big"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {vigil.displayName}
                  </h1>
                  <p className="text-gray-600">Vigil professionale</p>
                  {vigil.averageRating && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="inline-flex gap-1 items-center">
                        <StarIcon className="size-6 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {vigil.averageRating?.toFixed(1) ||
                            ReviewsUtils.calculateAverageRating(
                              vigil.reviews || []
                            )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                {/* <Button
                  action={() => {
                    router.push(`/vigil/${vigilId}/reviews`);
                  }}
                  label="Vedi Recensioni"
                  secondary
                /> */}
                <Button
                  action={handleBookVigil}
                  label="Prenota Servizio"
                  primary
                />
              </div>
            </div>
          </div>

          {/* Informazioni dettagliate */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonna sinistra - Informazioni personali */}
            <div className="lg:col-span-1 space-y-6">
              {/* Informazioni di contatto */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Informazioni di Contatto
                </h2>
                <div className="space-y-3">
                  {vigil.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">{vigil.email}</p>
                    </div>
                  )}
                  {vigil.name && vigil.surname && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Nome Completo
                      </label>
                      <p className="text-gray-900">
                        {vigil.name} {vigil.surname}
                      </p>
                    </div>
                  )}
                  {vigil.username && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Username
                      </label>
                      <p className="text-gray-900">@{vigil.username}</p>
                    </div>
                  )}
                </div>
              </div> */}

              {/* Statistiche */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Statistiche
                </h2>
                <div className="space-y-4">
                  {vigil.averageRating && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Valutazione Media
                      </label>
                      <div className="flex items-center space-x-2">
                        <StarIcon className="size-6 text-yellow-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {vigil.averageRating?.toFixed(1) ||
                            ReviewsUtils.calculateAverageRating(
                              vigil.reviews || []
                            )}
                        </span>
                      </div>
                    </div>
                  )}
                  {vigil.reviews && vigil.reviews.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Numero Recensioni
                      </label>
                      <p className="text-2xl font-bold text-gray-900">
                        {vigil.reviews.length}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonna destra - Recensioni */}
            <div className="lg:col-span-2 space-y-6">
              {/* Statistiche recensioni */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <ReviewStatsComponent
                  vigilId={vigilId}
                  showDistribution={true}
                />
              </div>

              <Divider /> */}

              {/* Lista recensioni */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ReviewListComponent
                  vigilId={vigilId}
                  showActions={false}
                  title="Recensioni Recenti"
                  limit={5}
                />
                {/* Link per vedere tutte le recensioni */}
                {vigil.reviews && vigil.reviews?.length > 5 ? (
                  <div className="mt-4 text-center">
                    <Button
                      action={() => {}}
                      label="Vedi Tutte le Recensioni"
                      secondary
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VigilDetailsPage;
