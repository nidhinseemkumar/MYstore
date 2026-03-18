import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLocationStore = create(
    persist(
        (set) => ({
            location: {
                address: 'Koramangala', // Defaults just for placeholder
                city: 'Bangalore',
                pincode: '560034',
                landmark: '',
                type: 'Home',
                phone: '',
                lat: 12.9716,
                lng: 77.5946,
            },
            setLocation: (newLocation) => set({ location: { ...newLocation } }),
        }),
        {
            name: 'location-storage', // store in localStorage
        }
    )
);
