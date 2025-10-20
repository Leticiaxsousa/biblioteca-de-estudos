export const GOAL_TYPES = {
  WEEKLY_CONTENT: {
    key: 'weekly_content',
    label: 'Conteúdos por Semana',
    description: 'Quantos conteúdos quero estudar esta semana',
    unit: 'conteúdos',
    icon: '📚'
  },
  COMPLETION_TARGET: {
    key: 'completion_target', 
    label: 'Conteúdos para Concluir',
    description: 'Quantos conteúdos quero finalizar',
    unit: 'concluídos',
    icon: '✅'
  },
  TIME_STUDY: {
    key: 'time_study',
    label: 'Horas de Estudo',
    description: 'Quantas horas quero estudar esta semana',
    unit: 'horas',
    icon: '⏰'
  },
  TOPIC_MASTERY: {
    key: 'topic_mastery',
    label: 'Tópicos para Dominar',
    description: 'Quantos tópicos difíceis quero dominar',
    unit: 'tópicos',
    icon: '🎯'
  }
};
export const getGoalTypeByKey = (key) => {
  return Object.values(GOAL_TYPES).find(type => type.key === key) || GOAL_TYPES.WEEKLY_CONTENT;
};
export const getGoalTypeOptions = () => {
  return Object.values(GOAL_TYPES).map(type => ({
    value: type.key,
    label: `${type.icon} ${type.label}`,
    description: type.description
  }));
};