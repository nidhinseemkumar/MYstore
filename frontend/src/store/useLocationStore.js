import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocationStore = create(
    persist(
        (set) => ({
            location: {
                address: 'Home',
                city: 'Bangalore',
                pincode: '',
            },
            setLocation: (newLocation) => set({ location: { ...newLocation } }),
        }),
        {
            name: 'location-storage', // store in localStorage
        }
    )
);
