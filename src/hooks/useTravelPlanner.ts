import { useState } from 'react';
import { TransportInput, StayInput, TripInput, TripPayload } from '@/types';

export function useTravelPlanner() {
    const [step, setStep] = useState(1);

    const [transport, setTransport] = useState<TransportInput>({
        from: '',
        to: '',
        mode: 'Pesawat',
        transportBudget: '',
        preference: 'Murah',
    });

    const [stay, setStay] = useState<StayInput>({
        stayType: 'Hotel',
        budgetPerNight: '',
        locationPreference: 'Pusat Kota',
        nights: 1,
        guests: 1,
    });

    const [trip, setTrip] = useState<TripInput>({
        styles: ['Alam'],
        activityBudget: '',
        days: 1,
        pace: 'Normal',
    });

    const nextStep = () => setStep((s) => Math.min(3, s + 1));
    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const getPayload = (): TripPayload => ({
        transportation: transport,
        accommodation: stay,
        trip,
    });

    return {
        step,
        setStep,
        nextStep,
        prevStep,
        transport,
        setTransport,
        stay,
        setStay,
        trip,
        setTrip,
        getPayload,
    };
}
