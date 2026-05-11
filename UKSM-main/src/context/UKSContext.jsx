import { createContext, useContext, useState } from "react";
// coomit
const UKSContext = createContext(null);

// Per-question status (sekolah)
export const Q_STATUS = {
  DRAFT: "draft",         // belum diisi / sedang diedit
  SUBMITTED: "submitted", // sudah disubmit, menunggu verifikasi admin
  EDITING: "editing",     // sedang diedit ulang setelah pernah submit
};

// Status verifikasi admin per soal
export const VERIFY = {
  PENDING: "pending",
  MEMENUHI: "memenuhi",
  BELUM: "belum",
};

// Demo data — beberapa soal sudah submitted, beberapa masih draft
const DEMO_DATA = {
  1: {
    answers: {
      dasar_0: {
        memenuhi: true,
        bukti: { files: [], links: [] },
        qStatus: Q_STATUS.SUBMITTED,
        submittedAt: null,
      },
      dasar_1: {
        memenuhi: true,
        bukti: { files: [], links: [] },
        qStatus: Q_STATUS.SUBMITTED,
        submittedAt: null,
      },
      dasar_2: {
        memenuhi: false,
        bukti: { files: [], links: [] },
        qStatus: Q_STATUS.SUBMITTED,
        submittedAt: null,
      },
      dasar_5: {
        memenuhi: true,
        bukti: { files: [], links: [] },
        qStatus: Q_STATUS.DRAFT,
        submittedAt: null,
      },
      madya_1: {
        memenuhi: true,
        bukti: { files: [], links: [] },
        qStatus: Q_STATUS.SUBMITTED,
        submittedAt: null,
      },
    },
    verifikasi: {
      dasar_0: { status: VERIFY.MEMENUHI, catatan: "", verifiedAt: null },
      dasar_2: { status: VERIFY.BELUM, catatan: "Kotak P3K tidak lengkap, harap dilengkapi.", verifiedAt: null },
    },
  },
  2: { answers: {}, verifikasi: {} },
};

export function UKSProvider({ children }) {
  const [schoolData, setSchoolData] = useState(DEMO_DATA);

  function getSchoolData(schoolId) {
    return schoolData[schoolId] || { answers: {}, verifikasi: {} };
  }

  // Update draft (tidak submit)
  function updateAnswer(schoolId, key, memenuhi, bukti) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      const existing = sd.answers?.[key] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          answers: {
            ...(sd.answers || {}),
            [key]: {
              ...existing,
              memenuhi,
              bukti: bukti || { files: [], links: [] },
              // jika sedang editing, tetap editing; jika draft tetap draft
              qStatus: existing.qStatus === Q_STATUS.SUBMITTED ? Q_STATUS.EDITING : (existing.qStatus || Q_STATUS.DRAFT),
            },
          },
        },
      };
    });
  }

  // Submit satu soal
  function submitQuestion(schoolId, key) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      const existing = sd.answers?.[key] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          answers: {
            ...(sd.answers || {}),
            [key]: {
              ...existing,
              qStatus: Q_STATUS.SUBMITTED,
              submittedAt: new Date().toLocaleString("id-ID"),
            },
          },
          // reset verifikasi for this key if re-submitted
          verifikasi: {
            ...(sd.verifikasi || {}),
            [key]: undefined, // clear old verification
          },
        },
      };
    });
  }

  // Set soal ke mode editing (buka kunci)
  function editQuestion(schoolId, key) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      const existing = sd.answers?.[key] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          answers: {
            ...(sd.answers || {}),
            [key]: { ...existing, qStatus: Q_STATUS.EDITING },
          },
        },
      };
    });
  }

  // Admin: update verifikasi satu soal
  function updateVerifikasi(schoolId, key, status, catatan) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          verifikasi: {
            ...(sd.verifikasi || {}),
            [key]: { status, catatan: catatan || "", verifiedAt: new Date().toLocaleString("id-ID") },
          },
        },
      };
    });
  }

  // Admin: submit verifikasi satu soal (finalize)
  function submitVerifikasiQuestion(schoolId, key, status, catatan) {
    setSchoolData((prev) => {
      const sd = prev[schoolId] || {};
      return {
        ...prev,
        [schoolId]: {
          ...sd,
          verifikasi: {
            ...(sd.verifikasi || {}),
            [key]: {
              status,
              catatan: catatan || "",
              verifiedAt: new Date().toLocaleString("id-ID"),
              finalized: true,
            },
          },
        },
      };
    });
  }

  function getAllSchoolData() {
    return schoolData;
  }

  return (
    <UKSContext.Provider value={{
      getSchoolData,
      updateAnswer,
      submitQuestion,
      editQuestion,
      updateVerifikasi,
      submitVerifikasiQuestion,
      getAllSchoolData,
    }}>
      {children}
    </UKSContext.Provider>
  );
}

export function useUKS() {
  return useContext(UKSContext);
}
