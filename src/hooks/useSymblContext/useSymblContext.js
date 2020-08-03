import { useContext } from 'react';
import { SymblContext } from '../../components/SymblProvider';

export default function useSymblContext() {
    const context = useContext(SymblContext);
    if (!context) {
        throw new Error('useSymblContext must be used within a IntelligenceProvider');
    }
    return context;
}
