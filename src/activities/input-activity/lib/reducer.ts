import type { InitialState, InputAction } from '../type/types';

export const INITIAL_STATE: InitialState = {
  validation: false,
  result: false,
  inputs: []
};

const sameAnswers = (a: string[], b: string[]) => a.length === b.length && a.every((answer, i) => answer === b[i]);

export const inputReducer = (state: InitialState, action: InputAction): InitialState => {
  switch (action.type) {
    case 'register': {
      const { id, name, correctAnswer } = action.input;
      const current = state.inputs.find((input) => input.id === id);

      if (!current) {
        return { ...state, inputs: [...state.inputs, { id, name, correctAnswer, userAnswer: '' }] };
      }

      // Si el campo ya estaba registrado igual se devuelve el mismo estado: no hay nuevo render.
      if (current.name === name && sameAnswers(current.correctAnswer, correctAnswer)) return state;

      return {
        ...state,
        inputs: state.inputs.map((input) => (input.id === id ? { ...input, name, correctAnswer } : input))
      };
    }

    case 'unregister':
      return { ...state, inputs: state.inputs.filter(({ id }) => id !== action.id) };

    case 'change':
      // Una vez comprobada la actividad las respuestas ya no cambian.
      if (state.validation) return state;

      return {
        ...state,
        inputs: state.inputs.map((input) =>
          input.id === action.id ? { ...input, userAnswer: action.userAnswer } : input
        )
      };

    case 'validate':
      return { ...state, validation: true, result: action.result };

    case 'reset':
      return {
        validation: false,
        result: false,
        inputs: state.inputs.map((input) => ({ ...input, userAnswer: '' }))
      };
  }
};
