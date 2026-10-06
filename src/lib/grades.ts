export function gradeFor(total: number) {
  if (total >= 70) return { grade: "A", label: "Excellent", color: "bg-grass text-white", emoji: "🌟" };
  if (total >= 60) return { grade: "B", label: "Very good", color: "bg-sky text-white", emoji: "🎉" };
  if (total >= 50) return { grade: "C", label: "Good", color: "bg-sun text-ink", emoji: "👍" };
  if (total >= 45) return { grade: "D", label: "Fair", color: "bg-orange-300 text-ink", emoji: "💪" };
  if (total >= 40) return { grade: "E", label: "Pass", color: "bg-coral/70 text-white", emoji: "📚" };
  return { grade: "F", label: "Keep trying", color: "bg-coral text-white", emoji: "🌱" };
}

export function starsFor(percent: number) {
  if (percent >= 90) return 3;
  if (percent >= 60) return 2;
  if (percent > 0) return 1;
  return 0;
}
