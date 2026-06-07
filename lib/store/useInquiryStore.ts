import { create } from "zustand";

interface InquiryState {
  verifiedInquiryIds: number[];
  addVerifiedId: (id: number) => void;
}

export const useInquiryStore = create<InquiryState>((set) => ({
  verifiedInquiryIds: [],
  addVerifiedId: (id) =>
    set((state) => ({
      verifiedInquiryIds: state.verifiedInquiryIds.includes(id)
        ? state.verifiedInquiryIds
        : [...state.verifiedInquiryIds, id],
    })),
}));
