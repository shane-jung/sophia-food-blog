import { createContext } from 'react';
import { Recipe } from '@/client/types';

interface EditableContextInterface {
    IsEditable: boolean;
}
export const EditableContext = createContext(false);