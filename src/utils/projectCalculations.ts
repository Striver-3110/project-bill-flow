
export const calculateProjectProgress = (
  projectId: string,
  projects: any[],
  timeEntries: any[]
) => {
  if (!projects || !timeEntries) return 0;
  
  const project = projects.find(p => p.project_id === projectId);
  if (!project) return 0;
  
  const projectTimeEntries = timeEntries.filter(entry => entry.project_id === projectId);
  const totalHoursLogged = projectTimeEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  
  const estimatedTotalHours = 100;
  const progress = Math.min(Math.round((totalHoursLogged / estimatedTotalHours) * 100), 100);
  
  return progress;
};

export const getMonthlyTimeData = (timeEntries: any[]) => {
  if (!timeEntries) return [];
  
  const monthMap = new Map();
  
  timeEntries.forEach(entry => {
    if (!entry.date) return;
    
    const date = new Date(entry.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthMap.has(monthYear)) {
      monthMap.set(monthYear, {
        month: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'short' }),
        hours: 0,
        billable: 0
      });
    }
    
    const monthData = monthMap.get(monthYear);
    monthData.hours += entry.hours || 0;
    if (entry.billable) {
      monthData.billable += entry.hours || 0;
    }
  });
  
  return Array.from(monthMap.values())
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
    .slice(-6);
};
