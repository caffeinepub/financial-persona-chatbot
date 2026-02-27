import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type QuestionResponses, type PersonaScores } from '../backend';

export function useCalculatePersonaScores() {
    const { actor } = useActor();

    return useMutation<PersonaScores, Error, QuestionResponses>({
        mutationFn: async (responses: QuestionResponses) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.calculatePersonaScores(responses);
        },
    });
}
