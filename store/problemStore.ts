import { create } from 'zustand';

export const useProblemStore = create((set) => ({
  department: 'Urban & Rural Infrastructure', // Updated default
  description: '',
  setDepartment: (newDept: string) => set({ department: newDept }),
  setDescription: (newDesc: string) => set({ description: newDesc }),
}));