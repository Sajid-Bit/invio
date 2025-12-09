interface BudgetAlertProps {
  message: string;
}

const BudgetAlert = ({ message }: BudgetAlertProps) => {
  return (
    <div className="bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm">
      <span className="text-lg">⚠️</span>
      <p className="text-xs font-semibold">{message}</p>
    </div>
  );
};

export default BudgetAlert;
