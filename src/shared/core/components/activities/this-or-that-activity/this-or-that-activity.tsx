import { useEffect, useReducer, useRef, useState } from 'react';

import type { InitialState, Option } from './types/types'
import { States } from './types/types';
import { ThisOrThatActivityProvider } from './this-or-that-activity-context';
import { ThisOrThatButton } from './this-or-that-button';
import { ThisOrThatElement } from './this-or-that-element';

const INITIAL_STATE = Object.freeze({
    validation: false,
    button: true,
    result: false,
    options: []
});

interface Props {
    children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
    onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
}

type SubComponents = {
    Select: typeof ThisOrThatElement;
    Button: typeof ThisOrThatButton;
};

const ThisOrThat: React.FC<Props> & SubComponents = ({ children, onResult }) => {
    // Hook useReducer para manejar el estado de la actividad
    const [activity, updateActivity] = useReducer(
        (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
        INITIAL_STATE
    );

    const [selectedId, setSelectedId] = useState<string | null>(null); // Hook useState para manejar el ID del elemento seleccionado
    const elementsId = useRef<string[]>([]); // useRef para almacenar los IDs de los elementos

    /**
     * Añade un ID de elemento al estado de la actividad.
     * Si el ID no está presente en el array `elementsId`, lo agrega.
     * @param uid - El ID del elemento a agregar.
     */
    const addElementsId = (uid: string): void => {
        if (!elementsId.current.includes(uid)) {
            elementsId.current = [...elementsId.current, uid];
        }
    };

    /**
     * Añade un valor de radio seleccionado al estado de la actividad.
     * Filtra las opciones anteriores por nombre y agrega la nueva opción seleccionada.
     * @param option - El objeto opción que contiene id, nombre y estado.
     */
    const addRadiosValues = ({ id, name, state }: Option) => {
        updateActivity({
            options: [...activity.options.filter((option) => option.name !== name), { id, name, state }]
        });
    };

    /**
     * Maneja la validación de la actividad.
     * Verifica si todas las opciones seleccionadas son correctas y actualiza el estado con el resultado.
     * @returns void
     */
    const handleValidation = () => {
        updateActivity({ validation: true, button: true });

        const result = activity.options.every(({ state }) => state === States.SUCCESS);

        if (onResult) {
          onResult({ result, options: activity.options });
        }

        updateActivity({ result });
    };

    /**
     * Reinicia la actividad al estado inicial.
     * Resetea el estado de la actividad y el ID del elemento seleccionado.
     * @returns void
     */
    const handleReset = () => {
        updateActivity(INITIAL_STATE);
        setSelectedId(null);

    };

    /**
     * Monitorea los cambios en las opciones seleccionadas.
     * Si hay opciones seleccionadas y la actividad no ha sido validada, activa el botón.
     * @returns void
     */
    useEffect(() => {
        if (!activity.options.length) return;

        if (!activity.validation) {
          updateActivity({ button: false });
        }
    }, [activity.options, activity.validation]);

    return(
        <ThisOrThatActivityProvider
            value={{
                addElementsId,
                addRadiosValues,
                handleValidation,
                handleReset,
                button: activity.button,
                result: activity.result,
                validation: activity.validation,
                selectedId,
                setSelectedId,
                options: activity.options,

             }}>
            {children}
        </ThisOrThatActivityProvider>
    );
};

ThisOrThat.Select = ThisOrThatElement
ThisOrThat.Button = ThisOrThatButton

export { ThisOrThat };