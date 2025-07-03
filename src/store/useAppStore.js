import { create } from 'zustand'
import { createMCPSlice } from './slice/mcpSlice'
import { createMCPSelectionSlice } from './slice/mcpSelectionSlice'

export const useAppStore = create((set) => ({
  ...createMCPSlice(set),
  ...createMCPSelectionSlice(set),
}))