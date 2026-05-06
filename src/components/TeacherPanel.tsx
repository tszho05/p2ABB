interface TeacherPanelProps {
  onRestart: () => void;
}

export default function TeacherPanel({ onRestart }: TeacherPanelProps) {
  return (
    <div className="teacher-panel" aria-label="教師控制">
      <button type="button" onClick={onRestart}>
        重新開始
      </button>
    </div>
  );
}
