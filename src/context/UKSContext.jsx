import { createContext, useContext, useState } from "react";

const UKSContext = createContext(null);

export const TIER_KEYS = ["dasar", "madya", "utama", "paripurna"];

// Status per tier (sekolah)
export const TIER_STATUS = {
  LOCKED: "locked",       // belum bisa diisi (tier sebelumnya belum selesai)
  OPEN: "open",           // sedang bisa diisi
  SUBMITTED: "submitted", // sudah disubmit, terkunci
};

// Status verifikasi admin per soal
export const VERIFY = {
  PENDING: "pending",
  MEMENUHI: "memenuhi",
  BELUM: "belum",
};

// Kosongkan memori / data awal agar sekolah bisa mengisi dari 0
const DEMO_DATA = {};

export function UKSProvider({ children }) {
  const [schoolData, setSchoolData] = useState(DEMO_DATA);

  function getSchoolData(schoolId) {
    const sd = schoolData[schoolId] || {};
    return {
      tierStatus: sd.tierStatus || { dasar: TIER_STATUS.OPEN, madya: TIER_STATUS.LOCKED, utama: TIER_STATUS.LOCKED, paripurna: TIER_STATUS.LOCKED },
      answers: sd.answers || {},
      verifikasi: sd.verifikasi || {},
      certificateName: sd.certificateName || "",
      completed: sd.completed || false,
    };
  }

  function updateAnswer(schoolId, key, memenuhi, bukti) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          answers: {
            ...(sd.answers || {}),
            [key]: { memenuhi, bukti: bukti || { files: [], links: [] } },
          },
        },
      };
    });
  }

  // Submit a whole tier → lock it, open next
  function submitTier(schoolId, tierKey) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      const tierIdx = TIER_KEYS.indexOf(tierKey);
      const nextTier = TIER_KEYS[tierIdx + 1];
      const isLast = tierIdx === TIER_KEYS.length - 1;

      const newTierStatus = {
        ...(sd.tierStatus || {}),
        [tierKey]: TIER_STATUS.SUBMITTED,
      };
      if (nextTier) newTierStatus[nextTier] = TIER_STATUS.OPEN;

      return {
        ...prev,
        [schoolId]: {
          ...sd,
          tierStatus: newTierStatus,
          completed: isLast ? true : sd.completed,
          [`${tierKey}SubmittedAt`]: new Date().toLocaleString("id-ID"),
        },
      };
    });
  }

  function updateVerifikasi(schoolId, key, status, catatan) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          verifikasi: {
            ...(sd.verifikasi || {}),
            [key]: { status, catatan: catatan || "" },
          },
        },
      };
    });
  }

  function submitVerifikasiQuestion(schoolId, key, status, catatan) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          verifikasi: {
            ...(sd.verifikasi || {}),
            [key]: { status, catatan: catatan || "", finalized: true, verifiedAt: new Date().toLocaleString("id-ID") },
          },
        },
      };
    });
  }

  function setCertificateName(schoolId, name) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return { ...prev, [schoolId]: { ...sd, certificateName: name } };
    });
  }

  function getAllSchoolData() {
    return schoolData;
  }

  return (
    <UKSContext.Provider value={{
      getSchoolData, updateAnswer, submitTier,
      updateVerifikasi, submitVerifikasiQuestion,
      setCertificateName, getAllSchoolData,
    }}>
      {children}
    </UKSContext.Provider>
  );
}

export function useUKS() {
  return useContext(UKSContext);
}
