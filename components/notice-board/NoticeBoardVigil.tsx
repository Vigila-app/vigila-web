"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MapPinIcon,
  ClockIcon,
  MegaphoneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { NoticeBoardService } from "@/src/services/notice-board.service";
import { NoticeBoardI } from "@/src/types/notice-board.types";
import { useAppStore } from "@/src/store/app/app.store";
import { ToastStatusEnum } from "@/src/enums/toast.enum";
import Card from "@/components/card/card";
import { RolesEnum } from "@/src/enums/roles.enums";
import { dateDisplay } from "@/src/utils/date.utils";

const NoticeBoardVigil = () => {
  const { showToast } = useAppStore();
  const [notices, setNotices] = useState<NoticeBoardI[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [proposedIds, setProposedIds] = useState<Set<string>>(new Set());

  const loadNotices = useCallback(
    async (pageNum = 1) => {
      try {
        setIsLoading(true);
        const result = await NoticeBoardService.getNotices({
          page: pageNum,
          itemPerPage: 10,
        });
        const resultData = result as any;
        if (resultData?.data) {
          setNotices(resultData.data);
          setTotalPages(resultData.pagination?.pages || 1);
        }
      } catch {
        showToast({
          message: "Errore nel caricamento degli annunci",
          type: ToastStatusEnum.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    loadNotices(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePropose = async (notice: NoticeBoardI) => {
    try {
      await NoticeBoardService.proposeForNotice(notice.id);
      setProposedIds((prev) => new Set(prev).add(notice.id));
      showToast({
        message:
          "Proposta inviata! L'utente riceverà una notifica per completare la prenotazione.",
        type: ToastStatusEnum.SUCCESS,
      });
    } catch {
      showToast({
        message: "Errore nell'invio della proposta. Riprova.",
        type: ToastStatusEnum.ERROR,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <MegaphoneIcon className="size-7 text-vigil-orange" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bacheca annunci</h1>
          <p className="text-sm text-gray-500">
            Annunci attivi di utenti che cercano assistenza nella tua zona
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin size-8 border-4 border-vigil-orange border-t-transparent rounded-full" />
        </div>
      ) : notices.length === 0 ? (
        <Card role={RolesEnum.VIGIL}>
          <div className="text-center py-8 space-y-2">
            <MegaphoneIcon className="size-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 font-medium">
              Nessun annuncio attivo al momento
            </p>
            <p className="text-sm text-gray-400">
              Gli annunci pubblicati dagli utenti nella tua zona appariranno
              qui.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              proposed={proposedIds.has(notice.id)}
              onPropose={() => handlePropose(notice)}
            />
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center gap-3 pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Precedente
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Successiva
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NoticeCard = ({
  notice,
  proposed,
  onPropose,
}: {
  notice: NoticeBoardI;
  proposed: boolean;
  onPropose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onPropose();
    setIsLoading(false);
  };

  return (
    <Card role={RolesEnum.VIGIL} hoverable>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-800">{notice.name}</h3>
            {notice.service_type && (
              <span className="inline-block text-xs font-medium bg-vigil-orange/10 text-vigil-orange px-2 py-0.5 rounded-full mt-1">
                {notice.service_type}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
            <ClockIcon className="size-3.5" />
            {dateDisplay(notice.created_at)}
          </span>
        </div>

        {notice.message && (
          <p className="text-sm text-gray-600">{notice.message}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPinIcon className="size-3.5 text-vigil-orange" />
            {notice.city
              ? `${notice.city} (${notice.postal_code})`
              : notice.postal_code}
          </span>
        </div>

        {proposed ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium py-2">
            <CheckCircleIcon className="size-5" />
            Proposta inviata — l&apos;utente riceverà una email per completare
            la prenotazione
          </div>
        ) : (
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-vigil-orange hover:bg-vigil-orange/90 text-white text-sm font-semibold py-2 px-4 rounded-xl transition disabled:opacity-60"
          >
            {isLoading ? "Invio in corso…" : "Proposti per questo servizio"}
          </button>
        )}
      </div>
    </Card>
  );
};

export default NoticeBoardVigil;
