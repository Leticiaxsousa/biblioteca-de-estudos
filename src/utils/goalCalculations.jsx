export const calculateGoalProgress = (goal, contents) => {
  const today = new Date();
  const periodStart = new Date(goal.period_start);
  const periodEnd = new Date(goal.period_end);
  let currentValue = 0;
  let progress = 0;
  switch (goal.type) {
    case 'weekly_content':
      currentValue = contents.filter(content => {
        const created = new Date(content.created_at);
        return created >= periodStart && created <= periodEnd;
      }).length;
      break;
    case 'completion_target':
      currentValue = contents.filter(content => {
        const completed = content.status === 'Concluído';
        const updated = new Date(content.updated_at);
        return completed && updated >= periodStart && updated <= periodEnd;
      }).length;
      break;

    case 'time_study':
      currentValue = Math.min(goal.current_value || 0, goal.target_value);
      break;

    case 'topic_mastery':
      currentValue = Math.min(goal.current_value || 0, goal.target_value);
      break;

    default:
      currentValue = 0;
  }

  progress = goal.target_value > 0 ? 
    Math.min(100, Math.round((currentValue / goal.target_value) * 100)) : 0;
  let status = goal.status;
  if (progress >= 100) {
    status = 'completed';
  } else if (today > periodEnd) {
    status = 'failed';
  } else {
    status = 'active';
  }
  const days_remaining = Math.max(0, Math.ceil((periodEnd - today) / (1000 * 60 * 60 * 24)));
  return {
    ...goal,
    current_value: currentValue,
    progress,
    status,
    days_remaining,
    is_overdue: today > periodEnd && progress < 100
  };
};
export const getDefaultPeriod = () => {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 7);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  };
};
export const validatePeriod = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();
  
  if (startDate > endDate) {
    return { isValid: false, error: 'A data de início deve ser anterior à data de fim' };
  }
  
  if (endDate < today) {
    return { isValid: false, error: 'O período não pode terminar no passado' };
  }
  
  return { isValid: true, error: null };
};