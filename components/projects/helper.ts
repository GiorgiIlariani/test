import { Billing, ProjectStatus } from 'types';

export const getBillingText = (type: Billing, shortName = false) => {
  switch (type) {
    case 'default':
      return shortName ? 'T&M' : 'Time & Material';
    case 'monthly':
      return shortName ? 'Monthly' : 'Monthly Retainer';
    case 'fixed':
      return shortName ? 'Fixed' : 'Fixed Price';
  }
};

export const getProjectStatus = (status: ProjectStatus) => {
  switch (status) {
    case 'pre-sale':
      return { title: 'Presale', color: 'bg-[#FFFBEB] text-[#D97706]' };
    case 'active':
      return { title: 'Active', color: 'bg-[#D1FAE5] text-[#059669]' };
    case 'completed':
      return { title: 'Completed', color: 'bg-[#F0F9FF] text-[#0284C7]' };
  }
};

export const getTermStatus = (status: string) => {
  switch (status) {
    case 'ongoing':
      return { title: 'ongoing', color: 'bg-[#EEF2FF] text-[#4F46E5]' };
    case 'upcoming':
      return { title: 'upcoming', color: 'bg-[#FAF2E4] text-[#EFA516]' };
    case 'completed':
      return { title: 'completed', color: 'bg-[#D1FAE5] text-[#059669]' };
    case 'booked':
      return { title: 'booked', color: 'bg-[#F1F2F4] text-[#5A636F]' };
    case 'expired':
      return { title: 'booking expired', color: 'bg-[#FEE2E2] text-[#DC2626]' };
  }
};
